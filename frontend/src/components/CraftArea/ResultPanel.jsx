
import React from 'react';

const ResultPanel = ({ result, onClose }) => {
  if (!result) return null;

  return (
    <div className="result-panel show">
      <div className="result-card">
        <div className="result-new-badge">New Discovery!</div>
        <div className="result-placeholder">
          {result.image_url ? (
            <img src={result.image_url} alt={result.name} />
          ) : (
            <span>🌿</span>
          )}
        </div>
        <div className="result-name">{result.name}</div>
        <div className="result-type-row">
          <span className="type-badge">{result.type}</span>
          <span className="type-badge">G{result.generation}</span>
        </div>
        <div className="result-lineage">
          {result.parents?.join(' + ')}
        </div>
        <div className="result-desc">{result.description}</div>
        <div className="result-btns">
          <button className="result-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPanel;
