
const Recipe = require('../models/Recipe');
const Strain = require('../models/Strain');

// Get All Recipes
const getAllRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.findAll({
      include: [
        { model: Strain, as: 'parent1', attributes: ['id', 'name'] },
        { model: Strain, as: 'parent2', attributes: ['id', 'name'] },
        { model: Strain, as: 'offspring', attributes: ['id', 'name', 'generation'] },
      ],
    });
    
    res.json({
      success: true,
      recipes,
    });
  } catch (error) {
    next(error);
  }
};

// Validate a Recipe
const validateRecipe = async (req, res, next) => {
  try {
    const { parent1_id, parent2_id } = req.body;
    
    // Normalize parent order (alphabetical)
    const [parent1, parent2] = [parent1_id, parent2_id].sort();
    
    const recipe = await Recipe.findOne({
      where: { parent1_id: parent1, parent2_id: parent2 },
      include: [
        { model: Strain, as: 'offspring', attributes: ['id', 'name', 'generation'] },
      ],
    });
    
    if (!recipe) {
      return res.json({
        success: true,
        valid: false,
      });
    }
    
    res.json({
      success: true,
      valid: true,
      offspring: recipe.offspring,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRecipes,
  validateRecipe,
};
