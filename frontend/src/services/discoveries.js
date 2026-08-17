
import api from './api';

export const getDiscoveries = async () => {
  const response = await api.get('/discoveries');
  return response.data.discoveries;
};

export const addDiscovery = async (strainId) => {
  const response = await api.post('/discoveries', { strain_id: strainId });
  return response.data;
};

export const removeDiscovery = async (strainId) => {
  const response = await api.delete(`/discoveries/${strainId}`);
  return response.data;
};
