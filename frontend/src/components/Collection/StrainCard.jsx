import React from 'react';
import { useDrag } from 'react-dnd';
import { useGame } from '../../context/GameContext';
export default function StrainCard({ strain }) {
  const {selectStrain,setDetailId} = useGame();
  const [{isDragging}, drag] = useDrag(()=>({type:'strain',item:{strain},collect:m=>({isDragging:m.isDragging()})}),[strain]);
  return <div ref={drag} className={`strain-card ${isDragging?'dragging':''}`} role="button" tabIndex={0} aria-label={`Select ${strain.name}`} onClick={()=>selectStrain(strain)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectStrain(strain)}}}>
    <button className="info-btn" aria-label={`Details for ${strain.name}`} onClick={e=>{e.stopPropagation();setDetailId(strain.id)}}>📖</button>
    <div className="placeholder-img" style={{background:`${strain.color}22`,border:`1px solid ${strain.color}44`}}>{strain.emoji||'🌿'}</div>
    <div className="card-name">{strain.name}</div><div className="card-type">{strain.type}</div><div className="card-badge">{strain.generation===0?'L':`T${strain.generation}`}</div>
  </div>;
}
