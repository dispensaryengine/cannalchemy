import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getAllStrains } from '../services/strains';
import { getAllRecipes } from '../services/recipes';
import { getDiscoveries } from '../services/discoveries';
const GameContext = createContext();
export function GameProvider({ children }) {
  const { token, user } = useAuth();
  const [strains, setStrains] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [discoveries, setDiscoveries] = useState([]);
  const [combosCount, setCombosCount] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slots, setSlots] = useState([null, null]);
  const [detailId, setDetailId] = useState(null);
  const refresh = useCallback(async () => {
    const data = await getDiscoveries();
    setDiscoveries(data);
  }, []);
  useEffect(() => {
    let active = true;
    setLoading(true); setError(null);
    setSlots([null, null]); setDetailId(null);
    if (!token) { setDiscoveries([]); setLoading(false); return; }
    Promise.all([getAllStrains(), getAllRecipes(), getDiscoveries()])
      .then(([s, r, d]) => { if (active) { setStrains(s); setRecipes(r); setDiscoveries(d); setCombosCount(user?.combos_count || 0); } })
      .catch(err => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token, user]);
  const selectStrain = strain => setSlots(current => !current[0] ? [strain, current[1]] : [current[0], strain]);
  return <GameContext.Provider value={{ strains, recipes, discoveries, combosCount, setCombosCount, isLoading, error, refresh, slots, setSlots, selectStrain, detailId, setDetailId }}>{children}</GameContext.Provider>;
}
export const useGame = () => useContext(GameContext);
