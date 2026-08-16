
import React from 'react';

const Slot = ({ strain, onClear }) => {
  return (
    <div className={"slot " + (strain ? "filled" : "")}>
      {strain ? (
        <>
          <div className="slot-placeholder-img">
            {strain.image_url ? (
              <img src={strain.image_url} alt={strain.name} />
            ) : (
              <span>🌿</span>
            )}
          </div>
          <div className="slot-name">{strain.name}</div>
        </>
      ) : (
        <div className="slot-empty-text">Drop strain here</div>
      )}
      <div className="slot-label">{strain ? (strain.id === slot1?.id ? 'Parent A' : 'Parent B') : 'Parent'}</div>
      {strain && (
        <button className="slot-clear-btn" onClick={onClear}>
          X
        </button>
      )}
    </div>
  );
};

export default Slot;
