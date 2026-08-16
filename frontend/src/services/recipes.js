
import api from './api';

export const getAllRecipes = async () => {
  const response = await api.get('/recipes');
  return response.data.recipes;
};

export const validateRecipe = async (parent1Id, parent2Id) => {
  const response = await api.post('/recipes/validate', { parent1_id: parent1Id, parent2_id: parent2Id });
  return response.data;
};
