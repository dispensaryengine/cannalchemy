
import api from './api';

export const getAllStrains = async (params = {}) => {
  const response = await api.get('/strains', { params });
  return response.data.strains;
};

export const getStrain = async (id) => {
  const response = await api.get(`/strains/${id}`);
  return response.data.strain;
};
