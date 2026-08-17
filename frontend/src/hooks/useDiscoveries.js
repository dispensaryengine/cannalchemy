
import { useState, useEffect, useCallback } from 'react';
import { getDiscoveries, addDiscovery, removeDiscovery } from '../services/discoveries';
import { useAuth } from './useAuth';

export const useDiscoveries = () => {
  const { token } = useAuth();
  const [discoveries, setDiscoveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDiscoveries = useCallback(async () => {
    if (!token) {
      setDiscoveries([]);
      setIsLoading(false);
      return;
    }
    try {
      const data = await getDiscoveries();
      setDiscoveries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDiscoveries();
  }, [fetchDiscoveries]);

  const add = useCallback(async (strainId) => {
    try {
      await addDiscovery(strainId);
      await fetchDiscoveries();
    } catch (err) {
      setError(err.message);
    }
  }, [fetchDiscoveries]);

  const remove = useCallback(async (strainId) => {
    try {
      await removeDiscovery(strainId);
      await fetchDiscoveries();
    } catch (err) {
      setError(err.message);
    }
  }, [fetchDiscoveries]);

  return { discoveries, isLoading, error, addDiscovery: add, removeDiscovery: remove, refresh: fetchDiscoveries };
};
