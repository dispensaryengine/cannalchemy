
import React from 'react';

const FilterTabs = ({ activeFilter, onFilter }) => {
  const filters = ['all', 'landrace', 'indica', 'sativa', 'hybrid'];

  return (
    <div className="filter-tabs">
      {filters.map((filter) => (
        <button
          key={filter}
          className={"filter-tab " + (activeFilter === filter ? "active" : "")}
          onClick={() => onFilter(filter)}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
