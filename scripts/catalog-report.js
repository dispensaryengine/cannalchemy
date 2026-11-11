const fs=require('node:fs');const path=require('node:path');
const {source,validateCatalog}=require('../backend/lib/catalog');
const r=validateCatalog(),names=ids=>ids.map(id=>source[id].name).join(' × ');
const header=['id','strain','unlock_method','parent_a','parent_b','after_unique_crosses','selection_source','game_tier','genetics_status','lineage','note','source_urls'];
const quote=s=>'"'+String(s??'').replaceAll('"','""')+'"';
const rows=Object.entries(source).sort(([,a],[,b])=>a.name.localeCompare(b.name)).map(([id,s])=>{
 const u=s.unlock;return [id,s.name,u.kind,u.parents?.[0]?source[u.parents[0]].name:'',u.parents?.[1]?source[u.parents[1]].name:'',u.after_crosses??'',names(u.requires||[]),s.generation,s.genetics_status,s.lineage,s.genetics_note,s.sources.map(x=>x.url).join(' | ')];
});
fs.writeFileSync(path.join(__dirname,'../docs/strain-lineages.csv'),[header,...rows].map(row=>row.map(quote).join(',')).join('\n')+'\n');
fs.writeFileSync(path.join(__dirname,'../docs/progression-audit.json'),JSON.stringify(r,null,2)+'\n');
console.log(JSON.stringify({...r,path:undefined,waves:r.waves.map(w=>({crosses:w.crosses.length,imports:w.imports.length,total:w.total}))},null,2));
