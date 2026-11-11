import React, {useEffect} from 'react';
import {useGame} from '../../context/GameContext';
export default function SeedBank({onClose}) {
  const {strains,discoveries,setDetailId}=useGame();
  const owned=new Set(discoveries.map(d=>d.strain_id));
  const count=strains.filter(s=>s.unlock?.kind==='cross'&&owned.has(s.id)).length;
  const accessions=strains.filter(s=>['archive','selection'].includes(s.unlock?.kind));
  const milestones=[...new Set(accessions.filter(s=>s.unlock.kind==='archive').map(s=>s.unlock.after_crosses))].sort((a,b)=>a-b);
  useEffect(()=>{const key=e=>{if(e.key==='Escape')onClose()};document.addEventListener('keydown',key);return()=>document.removeEventListener('keydown',key)},[onClose]);
  return <div className="encyclopedia-overlay open" role="dialog" aria-modal="true" aria-label="Seed bank"><div className="encyclopedia-backdrop" onClick={onClose}/><div className="encyclopedia-panel seed-bank-panel">
    <div className="enc-header"><div className="enc-title">🌱 Seed Bank</div><button className="enc-close" onClick={onClose} aria-label="Close seed bank">×</button></div>
    <div className="enc-body"><p>Import established genetics to open new breeding branches. Accessions arrive automatically as you discover unique cross outcomes.</p><p className="seed-progress"><strong>{count}</strong> unique cross outcomes discovered</p><p>Unknown parents stay unknown. Complex founder lines and named clone selections enter through the seed bank instead of invented recipes.</p>
      {milestones.map(n=><section key={n} className="enc-gen-section"><h3>{n===0?'Foundation accessions':`After ${n} unique cross outcomes`} {count>=n?'✓':'🔒'}</h3>{accessions.filter(s=>s.unlock.kind==='archive'&&s.unlock.after_crosses===n).map(s=><button className={`seed-entry ${owned.has(s.id)?'owned':''}`} key={s.id} disabled={!owned.has(s.id)} onClick={()=>{onClose();setDetailId(s.id)}}><span>{owned.has(s.id)?'✓':'🔒'} {s.name}</span><small>{s.genetics_status.replaceAll('-',' ')}</small></button>)}</section>)}
      <section className="enc-gen-section"><h3>Named selections & breeding accessions</h3><p>These arrive when their source line is discovered. They are selections, not additional crosses.</p>{accessions.filter(s=>s.unlock.kind==='selection').map(s=><button className="seed-entry" key={s.id} disabled={!owned.has(s.id)} onClick={()=>{onClose();setDetailId(s.id)}}><span>{owned.has(s.id)?'✓':'🔒'} {s.name}</span><small>From {strains.find(p=>p.id===s.unlock.requires[0])?.name}</small></button>)}</section>
    </div>
  </div></div>;
}
