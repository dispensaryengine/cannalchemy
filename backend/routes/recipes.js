
const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipes');

router.get('/', recipeController.getAllRecipes);
router.post('/validate', recipeController.validateRecipe);

module.exports = router;
