require('dotenv').config();
const { sequelize } = require('../config/db');
const Strain = require('../models/Strain');
const Recipe = require('../models/Recipe');
require('../models/Discovery');
const { source, validateCatalog } = require('../lib/catalog');
async function seed() {
  const summary = validateCatalog(); // Reject broken catalogs before touching MySQL.
  await sequelize.sync();
  // Upgrade the old pair-only uniqueness rule. Different named selections can share broad parent labels.
  const qi = sequelize.getQueryInterface();
  const indexes = await qi.showIndex('recipes');
  for (const index of indexes) {
    const fields = index.fields.map(f=>f.attribute).sort();
    if (index.unique && JSON.stringify(fields) === JSON.stringify(['parent1_id','parent2_id'])) await qi.removeIndex('recipes', index.name);
  }
  const recipes = [];
  const strains = Object.entries(source).map(([id, s]) => {
    for (const parents of s.recipes || []) {
      const [parent1_id, parent2_id] = [...parents].sort();
      recipes.push({ parent1_id, parent2_id, offspring_id: id });
    }
    return { id, name: s.name, type: s.type.find(t=>t!=='landrace').replace(/^./, c=>c.toUpperCase()),
      generation:s.generation, thc:Number.isFinite(parseFloat(s.thc))?parseFloat(s.thc):null, cbd:Number.isFinite(parseFloat(s.cbd))?parseFloat(s.cbd):null,
      flavor:s.flavors, effects:s.effects, description:s.desc, image_url:null,
      lineage:s.lineage, emoji:s.emoji, color:s.color, thc_range:s.thc, cbd_range:s.cbd };
  });
  const fields = Object.keys(strains[0]).filter(k=>k!=='id');
  await sequelize.transaction(async transaction => {
    await Strain.bulkCreate(strains, { updateOnDuplicate: fields, transaction });
    // Recipes have no player-owned references; replace stale mappings atomically, preserving all discoveries.
    await Recipe.destroy({ where:{}, transaction });
    await Recipe.bulkCreate(recipes, { transaction });
  });
  console.log(`Catalog ready: ${summary.total} strains, ${summary.recipes} cross outcomes, ${summary.uniquePairs} parent pairs`);
}
if (require.main === module) seed().then(()=>sequelize.close()).catch(err=>{console.error(err.message);process.exitCode=1;});
module.exports = { seed };
