
import { useState, useEffect } from 'react';
import { getAllStrains } from '../services/strains';

export const useStrains = () => {
  const [strains, setStrains] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStrains = async () => {
      try {
        const data = await getAllStrains();
        setStrains(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStrains();
  }, []);

  return { strains, isLoading, error };
};
