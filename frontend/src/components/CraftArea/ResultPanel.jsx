import React from 'react';
import { useGame } from '../../context/GameContext';
export default function ResultPanel({ result, onClose }) {
  const { setDetailId } = useGame();
  if (!result) return null;
  return <div className="result-panel show"><div className="result-card">
    <div className="result-new-badge">{result.isNew?'✨ NEW DISCOVERY':'📚 ALREADY KNOWN'}</div>
    <div className="result-placeholder" style={{background:`${result.color}22`}}>{result.emoji||'🌿'}</div>
    <div className="result-name">{result.name}</div><div className="result-type-row"><span className="type-badge">{result.type}</span><span className="type-badge">Gen {result.generation}</span></div>
    <div className="result-lineage">🧬 {result.lineage}</div><div className="result-desc">{result.description}</div>
    <div className="result-stats"><div>THC: {result.thc_range}</div><div>CBD: {result.cbd_range}</div></div>
    <div className="result-effects">{result.effects?.map(e=><span className="effect-tag" key={e}>{e}</span>)}</div>
    <div className="result-btns"><button className="result-btn" onClick={onClose}>Add to Collection →</button><button className="result-btn secondary" onClick={()=>{onClose();setDetailId(result.id)}}>📖 View Details</button></div>
  </div></div>;
}
