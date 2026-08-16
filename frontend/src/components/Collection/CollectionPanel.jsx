
import React, { useState, useEffect } from 'react';
import StrainCard from './StrainCard';
import SearchBar from './SearchBar';
import FilterTabs from './FilterTabs';
import { useDiscoveries } from '../../hooks/useDiscoveries';
import { useStrains } from '../../hooks/useStrains';

const CollectionPanel = () => {
  const { discoveries, isLoading: isDiscoveriesLoading } = useDiscoveries();
  const { strains, isLoading: isStrainsLoading } = useStrains();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const collection = strains.filter((strain) => {
    // Filter by discoveries
    const isDiscovered = discoveries.some((d) => d.strain_id === strain.id);
    if (!isDiscovered) return false;

    // Filter by search query
    if (searchQuery && !strain.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Filter by type
    if (activeFilter === 'landrace' && strain.generation !== 0) return false;
    if (activeFilter === 'indica' && strain.type !== 'Indica') return false;
    if (activeFilter === 'sativa' && strain.type !== 'Sativa') return false;
    if (activeFilter === 'hybrid' && strain.type !== 'Hybrid') return false;

    return true;
  });

  if (isStrainsLoading || isDiscoveriesLoading) {
    return <div className="collection-panel">Loading...</div>;
  }

  return (
    <div className="collection-panel">
      <div className="panel-title">Your Collection</div>
      <SearchBar onSearch={setSearchQuery} />
      <FilterTabs activeFilter={activeFilter} onFilter={setActiveFilter} />
      <div className="collection-grid">
        {collection.map((strain) => (
          <StrainCard key={strain.id} strain={strain} />
        ))}
      </div>
    </div>
  );
};

export default CollectionPanel;
