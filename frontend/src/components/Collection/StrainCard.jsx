
import React from 'react';
import { useDrag } from 'react-dnd';

const StrainCard = ({ strain, onClick }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'strain',
    item: { strain },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={"strain-card " + (isDragging ? "dragging" : "")}
      onClick={onClick}
    >
      <div className="placeholder-img">
        {strain.image_url ? (
          <img src={strain.image_url} alt={strain.name} />
        ) : (
          <span>🌿</span>
        )}
      </div>
      <div className="card-name">{strain.name}</div>
      <div className="card-type">{strain.type}</div>
      <div className="card-badge">G{strain.generation}</div>
    </div>
  );
};

export default StrainCard;
