const test=require('node:test');
const assert=require('node:assert/strict');
const {source,starterIds,crosses,grantAccessions,eligibleAccessions,crossCount,validateCatalog}=require('../lib/catalog');
const audit=require('../../docs/original-lineage-audit.json');
test('catalog has sourced, complete, acyclic dependencies and every entry is reachable',()=>{
 const r=validateCatalog();assert.equal(r.total,199);assert.equal(r.recipes,106);assert.equal(r.uniquePairs,104);assert.equal(r.archives,68);assert.equal(r.selections,17);assert.deepEqual(r.unreachable,[]);
 assert.equal(r.starters+r.recipes+r.archives+r.selections,r.total);
 assert.equal(new Set(audit.map(s=>s.id)).size,44);for(const s of audit)assert.ok(source[s.id]);
});
test('uncertain founders and exact parental selections are not replaced by invented shortcuts',()=>{
 assert.equal(source.chemdawg.genetics_status,'unknown');assert.equal(source['og-kush'].unlock.kind,'archive');assert.equal(source['zkittlez'].unlock.kind,'archive');
 assert.deepEqual(source['white-widow'].unlock.parents,['brazilian-sativa','south-indian']);
 assert.deepEqual(source['runtz'].unlock.parents,['zkittlez','gelato']);
 assert.deepEqual(source['girl-scout-cookies'].unlock.parents,['og-kush-gsc-parent','f1-durb']);
 assert.deepEqual(source['permanent-marker'].unlock.parents,['biscotti-sherb-bx1','jealousy-f2']);
 assert.deepEqual(source['gary-payton'].unlock.parents,['the-y','snowman']);
 assert.deepEqual(source['cereal-milk'].unlock.parents,['y-life','snowman']);
 assert.deepEqual(source['ice-cream-cake'].unlock.parents,['wedding-cake','gelato-33']);
 assert.deepEqual(source['do-si-dos'].unlock.parents,['ogkb','face-off-og-bx1']);
 assert.equal(source['mac-1'].unlock.kind,'selection');assert.equal(source['white-runtz'].unlock.kind,'selection');
});
test('reject missing references, circular selections, missing sources, and unreachable milestones',()=>{
 const copy=()=>structuredClone(source);
 let c=copy();c.runtz.unlock.parents[0]='missing';c.runtz.recipes=[c.runtz.unlock.parents];assert.throws(()=>validateCatalog(c),/Invalid dependency/);
 c=copy();c['gelato-33'].unlock.requires=['gelato-41'];c['gelato-41'].unlock.requires=['gelato-33'];assert.throws(()=>validateCatalog(c),/Circular/);
 c=copy();c.runtz.sources=[];assert.throws(()=>validateCatalog(c),/Missing source/);
 c=copy();c['brazilian-sativa'].unlock.after_crosses=10000;assert.throws(()=>validateCatalog(c),/Unreachable/);
});
test('imports and repeated attempts do not count as cross milestones; awards are idempotent',()=>{
 const owned=new Set(starterIds);grantAccessions(owned);assert.equal(crossCount(owned),0);assert.ok(!owned.has('og-kush'));assert.equal(grantAccessions(owned).length,0);
 for(const id of ['white-widow','lemon-skunk','critical-mass'])owned.add(id);
 assert.ok(eligibleAccessions(owned).includes('northern-lights'));grantAccessions(owned);assert.equal(crossCount(owned),3);assert.ok(!owned.has('og-kush'));
});
test('100 different discovery orders finish without a dead end or random-outcome bottleneck',()=>{
 for(let seed=1;seed<=100;seed++){
  let state=seed;const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/2**32};
  const owned=new Set(starterIds);grantAccessions(owned);
  while(owned.size<Object.keys(source).length){
   const frontier=crosses.filter(r=>!owned.has(r.offspring_id)&&r.parents.every(p=>owned.has(p)));
   assert.ok(frontier.length,`Stalled with ${owned.size} entries, seed ${seed}`);
   const chosen=frontier[Math.floor(random()*frontier.length)];owned.add(chosen.offspring_id);grantAccessions(owned);
  }
  assert.equal(crossCount(owned),106);
 }
});
