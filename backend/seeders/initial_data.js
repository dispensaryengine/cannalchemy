require('dotenv').config();
const { sequelize } = require('../config/db');
const Strain = require('../models/Strain');
const Recipe = require('../models/Recipe');
require('../models/Discovery');
const source = require('../data/strains.json');
async function seed() {
  await sequelize.sync();
  const recipes = new Map();
  const strains = Object.entries(source).map(([id, s]) => {
    for (const parents of s.recipes || []) {
      const [parent1_id, parent2_id] = [...parents].sort();
      const key = `${parent1_id}+${parent2_id}`;
      if (!recipes.has(key)) recipes.set(key, { parent1_id, parent2_id, offspring_id: id });
    }
    return { id, name: s.name, type: s.type.find(t => t !== 'landrace').replace(/^./, c => c.toUpperCase()),
      generation: s.generation, thc: parseFloat(s.thc), cbd: parseFloat(s.cbd),
      flavor: s.flavors, effects: s.effects, description: s.desc, image_url: null,
      lineage: s.lineage, emoji: s.emoji, color: s.color, thc_range: s.thc, cbd_range: s.cbd };
  });
  await sequelize.transaction(async transaction => {
    await Strain.bulkCreate(strains, { ignoreDuplicates: true, transaction });
    await Recipe.bulkCreate([...recipes.values()], { ignoreDuplicates: true, transaction });
  });
  console.log(`Catalog ready: ${strains.length} strains, ${recipes.size} recipes`);
}
if (require.main === module) seed().then(() => sequelize.close()).catch(err => { console.error(err.message); process.exitCode = 1; });
module.exports = { seed };
