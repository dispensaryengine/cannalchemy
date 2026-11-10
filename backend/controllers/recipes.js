const { Op } = require('sequelize');
const { sequelize } = require('../config/db');
const Recipe = require('../models/Recipe');
const Strain = require('../models/Strain');
const Discovery = require('../models/Discovery');
const User = require('../models/User');
exports.getAllRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.findAll({ include: [
      { model: Strain, as: 'parent1', attributes: ['id', 'name'] },
      { model: Strain, as: 'parent2', attributes: ['id', 'name'] },
      { model: Strain, as: 'offspring', attributes: ['id', 'name', 'generation'] },
    ] });
    res.json({ success: true, recipes });
  } catch (err) { next(err); }
};
exports.validateRecipe = async (req, res, next) => {
  try {
    const { parent1_id, parent2_id } = req.body;
    if (typeof parent1_id !== 'string' || typeof parent2_id !== 'string') return res.status(400).json({ error: { message: 'Two parent strain IDs are required' } });
    const result = await sequelize.transaction(async transaction => {
      const user = await User.findByPk(req.user.id, { transaction, lock: transaction.LOCK.UPDATE });
      if (!user) return { forbidden: true };
      const ids = [...new Set([parent1_id, parent2_id])];
      const count = await Discovery.count({ where: { user_id: user.id, strain_id: { [Op.in]: ids } }, transaction });
      if (count !== ids.length) return { forbidden: true };
      const [parent1, parent2] = [parent1_id, parent2_id].sort();
      const recipe = await Recipe.findOne({ where: { parent1_id: parent1, parent2_id: parent2 }, include: [{ model: Strain, as: 'offspring' }], transaction });
      await user.increment('combos_count', { transaction });
      await user.reload({ transaction });
      if (!recipe) return { valid: false, combos_count: user.combos_count };
      const [, isNew] = await Discovery.findOrCreate({ where: { user_id: user.id, strain_id: recipe.offspring_id }, transaction });
      return { valid: true, offspring: recipe.offspring, isNew, combos_count: user.combos_count };
    });
    if (result.forbidden) return res.status(403).json({ error: { message: 'Discover both parents before combining them' } });
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};
