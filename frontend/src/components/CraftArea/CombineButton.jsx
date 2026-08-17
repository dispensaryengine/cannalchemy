
import React from 'react';

const CombineButton = ({ onClick, disabled }) => {
  return (
    <button
      className="combine-btn"
      onClick={onClick}
      disabled={disabled}
    >
      Combine
    </button>
  );
};

export default CombineButton;
