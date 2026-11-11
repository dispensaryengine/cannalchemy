const test=require('node:test');const assert=require('node:assert/strict');const {randomBytes}=require('node:crypto');
const {source,validateCatalog}=require('../lib/catalog');const base=process.env.TEST_BASE_URL;
test('MySQL migration, all outcomes, milestones, isolation, and account persistence',{skip:!base},async()=>{
 let last=0;
 async function api(path,{token,body,status=200}={}){
  // Keep the end-to-end playthrough below the production API's per-IP limit.
  await new Promise(resolve=>setTimeout(resolve,Math.max(0,650-(Date.now()-last))));last=Date.now();
  const r=await fetch(`${base}/api${path}`,{method:body===undefined?'GET':'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});
  const d=await r.json();assert.equal(r.status,status,`${path}: ${d.error?.message||r.status}`);return d;
 }
 const summary=validateCatalog();assert.equal((await api('/health')).database,'mysql');
 const response=await api('/strains');const strains=response.strains;const recipes=(await api('/recipes')).recipes;
 assert.equal(strains.length,summary.total);assert.equal(recipes.length,summary.recipes);assert.equal(response.catalog.uniquePairs,summary.uniquePairs);
 for(const s of strains){assert.deepEqual(s.unlock,source[s.id].unlock);assert.ok(s.sources.length);assert.equal(s.lineage,source[s.id].lineage);}
 await api('/auth/me',{status:401});await api('/recipes/validate',{body:{parent1_id:'afghani',parent2_id:'thai'},status:401});
 const guest=await api('/auth/guest',{body:{}}),other=await api('/auth/guest',{body:{}});assert.notEqual(guest.user.id,other.user.id);
 const getOwned=async token=>new Set((await api('/discoveries',{token})).discoveries.map(d=>d.strain_id));
 let owned=await getOwned(guest.token);const initial=[...owned];assert.ok(owned.has('skunk-1'));assert.ok(!owned.has('og-kush'));
 await api('/recipes/validate',{token:guest.token,body:{parent1_id:'gelato',parent2_id:'runtz'},status:403});
 await api('/discoveries',{token:guest.token,body:{strain_id:'permanent-marker'},status:403});
 const first=await api('/recipes/validate',{token:guest.token,body:{parent1_id:'south-indian',parent2_id:'brazilian-sativa'}});assert.equal(first.offspring.id,'white-widow');assert.equal(first.isNew,true);
 const repeat=await api('/recipes/validate',{token:guest.token,body:{parent1_id:'brazilian-sativa',parent2_id:'south-indian'}});assert.equal(repeat.isNew,false);assert.equal(repeat.combos_count,2);
 // Old fabricated shortcut must be absent after the live seeder replaces recipes.
 const invalid=await api('/recipes/validate',{token:guest.token,body:{parent1_id:'afghani',parent2_id:'thai'}});assert.equal(invalid.valid,false);
 assert.deepEqual([...await getOwned(other.token)].sort(),initial.sort());
 owned=await getOwned(guest.token);let steps=0;
 while(owned.size<summary.total){
  const ready=recipes.find(r=>!owned.has(r.offspring_id)&&owned.has(r.parent1_id)&&owned.has(r.parent2_id));assert.ok(ready,`No frontier at ${owned.size} discoveries`);
  const result=await api('/recipes/validate',{token:guest.token,body:{parent1_id:ready.parent2_id,parent2_id:ready.parent1_id}});
  assert.equal(result.valid,true);assert.equal(result.isNew,true);
  assert.ok(!owned.has(result.offspring.id));owned.add(result.offspring.id);(result.unlocked||[]).forEach(id=>owned.add(id));
  steps++;assert.ok(steps<=summary.recipes);if(steps%20===0)console.log(`Live playthrough: ${steps} crosses, ${owned.size}/${summary.total} entries`);
 }
 assert.equal(owned.size,summary.total);assert.equal((await getOwned(guest.token)).size,summary.total);
 // Both genuine same-pair outcomes are kept. The old seed logic dropped these silently.
 assert.ok(owned.has('critical-mass')&&owned.has('super-skunk'));assert.ok(owned.has('white-russian')&&owned.has('kalashnikova'));
 const countBefore=(await api('/auth/me',{token:guest.token})).user.combos_count;
 const samePair=await api('/recipes/validate',{token:guest.token,body:{parent1_id:'afghani',parent2_id:'skunk-1'}});assert.equal(samePair.isNew,false);assert.equal(samePair.remaining_outcomes,0);assert.equal(samePair.combos_count,countBefore+1);
 const username=`test_${randomBytes(6).toString('hex')}`,password=randomBytes(20).toString('hex');
 const account=await api('/auth/signup',{body:{username,password}});await api('/auth/signup',{body:{username,password},status:409});await api('/auth/login',{body:{username,password:'incorrect'},status:401});
 await api('/recipes/validate',{token:account.token,body:{parent1_id:'brazilian-sativa',parent2_id:'south-indian'}});
 const login=await api('/auth/login',{body:{username:username.toUpperCase(),password}});assert.equal(login.user.id,account.user.id);assert.equal(login.user.combos_count,1);assert.ok((await getOwned(login.token)).has('white-widow'));
 console.log(`Verified all ${summary.total} entries and ${summary.recipes} cross outcomes on MySQL.`);
});
