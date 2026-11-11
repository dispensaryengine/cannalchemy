const source = require('../data/strains.json');
const entries = Object.entries(source);
const starterIds = entries.filter(([, s]) => s.unlock.kind === 'starter').map(([id]) => id);
const crosses = entries.filter(([, s]) => s.unlock.kind === 'cross').map(([id, s]) => ({ offspring_id: id, parents: s.unlock.parents }));
const accessions = entries.filter(([, s]) => ['archive', 'selection'].includes(s.unlock.kind));
const crossIds = new Set(crosses.map(r => r.offspring_id));
function crossCount(owned) { return [...owned].filter(id => crossIds.has(id)).length; }
function eligibleAccessions(owned) {
  const count = crossCount(owned);
  return accessions.filter(([id, s]) => !owned.has(id) && count >= s.unlock.after_crosses && s.unlock.requires.every(id => owned.has(id))).map(([id]) => id);
}
function grantAccessions(owned) {
  const added = [];
  let available;
  do { available = [...starterIds.filter(id => !owned.has(id)), ...eligibleAccessions(owned)]; available.forEach(id => { owned.add(id); added.push(id); }); } while (available.length);
  return added;
}
function serializeStrain(row) {
  if (!row) return row;
  const data = row.toJSON ? row.toJSON() : row;
  const s = source[data.id];
  return s ? { ...data, unlock: s.unlock, sources: s.sources, genetics_status: s.genetics_status, genetics_note: s.genetics_note, entry_role: s.entry_role || 'cultivar-or-accession' } : data;
}
function validateCatalog(data = source) {
  const keys = new Set(Object.keys(data));
  const seen = new Set();
  for (const [id, s] of Object.entries(data)) {
    if (!['starter', 'cross', 'archive', 'selection'].includes(s.unlock?.kind)) throw new Error(`Invalid unlock kind: ${id}`);
    if (!s.sources?.length || s.sources.some(s => !/^https:\/\//.test(s.url) || !s.claim || !s.accessed)) throw new Error(`Missing source: ${id}`);
    const u = s.unlock, deps = u.parents || u.requires || [];
    if (u.kind === 'cross' && (deps.length !== 2 || s.recipes?.length !== 1 || JSON.stringify(s.recipes[0]) !== JSON.stringify(deps))) throw new Error(`Invalid recipe: ${id}`);
    if (['archive', 'selection'].includes(u.kind) && (!Number.isInteger(u.after_crosses) || u.after_crosses < 0)) throw new Error(`Invalid milestone: ${id}`);
    if (u.kind !== 'cross' && s.recipes?.length) throw new Error(`Non-cross recipe: ${id}`);
    for (const p of deps) if (!keys.has(p) || p === id) throw new Error(`Invalid dependency ${p}: ${id}`);
    const recipeKey = [...deps].sort().join('+') + '=>' + id;
    if (seen.has(recipeKey)) throw new Error(`Duplicate recipe: ${id}`);
    seen.add(recipeKey);
  }
  const visiting = new Set(), visited = new Set();
  function visit(id) {
    if (visiting.has(id)) throw new Error(`Circular ancestry: ${id}`);
    if (visited.has(id)) return;
    visiting.add(id);
    const u = data[id].unlock;
    (u.parents || u.requires || []).forEach(visit);
    visiting.delete(id); visited.add(id);
  }
  keys.forEach(visit);
  // Explore the full closure using unique crossed cultivars, never attempts or imported entries, for milestones.
  const owned = new Set(Object.entries(data).filter(([,s])=>s.unlock.kind === 'starter').map(([id])=>id));
  const path = [], waves = [];
  let prior;
  do {
    prior = owned.size;
    const count = [...owned].filter(id=>data[id].unlock.kind==='cross').length;
    const imports = Object.entries(data).filter(([id,s])=>!owned.has(id)&&['archive','selection'].includes(s.unlock.kind)&&count>=s.unlock.after_crosses&&s.unlock.requires.every(p=>owned.has(p))).map(([id])=>id);
    imports.forEach(id=>owned.add(id));
    const next = Object.entries(data).filter(([id,s])=>!owned.has(id)&&s.unlock.kind==='cross'&&s.unlock.parents.every(p=>owned.has(p))).map(([id])=>id);
    next.forEach(id=>{owned.add(id);path.push(id);});
    waves.push({ imports, crosses: next, total: owned.size, availableCrosses: next.length });
  } while (owned.size > prior);
  const unreachable = [...keys].filter(id=>!owned.has(id));
  if (unreachable.length) throw new Error(`Unreachable catalog: ${unreachable.join(', ')}`);
  const recipes = Object.entries(data).filter(([,s])=>s.unlock.kind==='cross');
  const pairs = new Set(recipes.map(([,s])=>[...s.unlock.parents].sort().join('+')));
  return { total: keys.size, starters: Object.values(data).filter(s=>s.unlock.kind==='starter').length, recipes: recipes.length, uniquePairs: pairs.size, archives: Object.values(data).filter(s=>s.unlock.kind==='archive').length, selections: Object.values(data).filter(s=>s.unlock.kind==='selection').length, maxTier: Math.max(...Object.values(data).map(s=>s.generation)), waves, path, unreachable };
}
module.exports = { source, starterIds, crosses, crossIds, crossCount, eligibleAccessions, grantAccessions, serializeStrain, validateCatalog };
