import React from 'react';
import { useDrop } from 'react-dnd';
export default function Slot({ strain, label, onClear, onDrop }) {
  const [{isOver}, drop] = useDrop(() => ({ accept: 'strain', drop: (item,monitor) => { onDrop(item.strain); return {handled:true}; }, collect: m=>({isOver:m.isOver()}) }), [onDrop]);
  return <div ref={drop} className={`slot ${strain?'filled':''} ${isOver?'drag-over':''}`}>
    {strain?<><div className="slot-placeholder-img" style={{background:`${strain.color}22`}}>{strain.emoji||'🌿'}</div><div className="slot-name">{strain.name}</div><button className="slot-clear-btn" aria-label={`Clear ${label}`} onClick={onClear}>×</button></>:<div className="slot-empty-text">Drop<br/>strain here</div>}
    <div className="slot-label">{label}</div>
  </div>;
}
