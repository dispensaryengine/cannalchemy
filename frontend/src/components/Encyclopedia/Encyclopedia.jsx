import React, { useEffect, useRef, useState } from 'react';
import GeneticsEvidence from '../Shared/GeneticsEvidence';
import { useGame } from '../../context/GameContext';
export default function Encyclopedia({ onClose }) {
  const {strains,recipes,discoveries,detailId,setDetailId} = useGame();
  const bodyRef = useRef(null);
  useEffect(()=>{ if(bodyRef.current) bodyRef.current.scrollTop=0; },[detailId]);
  const [query,setQuery] = useState('');
  const [tab,setTab] = useState('list');
  const owned = new Set(discoveries.map(d=>d.strain_id));
  const tiers = [...new Set(strains.map(s=>s.generation))].sort((a,b)=>a-b);
  const selected = strains.find(s=>s.id===detailId);
  useEffect(()=>{const key=e=>{if(e.key==='Escape')onClose()};document.addEventListener('keydown',key);return()=>document.removeEventListener('keydown',key)},[onClose]);
  const filtered = strains.filter(s=>(owned.has(s.id)?s.name.toLowerCase().includes(query.toLowerCase()):!query));
  function item(s) { const known=owned.has(s.id);return <button key={s.id} className={`enc-list-item ${known?'':'undiscovered'}`} disabled={!known} onClick={()=>setDetailId(s.id)}><span className="enc-list-emoji">{known?s.emoji:'🔒'}</span><span className="enc-list-info"><span className="enc-list-name">{known?s.name:'???'}</span><span className="enc-list-meta">{s.type} · Tier {s.generation}</span></span><span className="enc-list-arrow">{known?'→':'🔒'}</span></button>; }
  return <div className="encyclopedia-overlay open" role="dialog" aria-modal="true" aria-label="Strain Encyclopedia"><div className="encyclopedia-backdrop" onClick={onClose}/><div className="encyclopedia-panel">
    <div className="enc-header"><div className="enc-title">📖 Strain Encyclopedia</div><button className="enc-close" aria-label="Close encyclopedia" onClick={onClose}>×</button></div>
    <div className="enc-tabs"><button className={`enc-tab ${tab==='list'?'active':''}`} onClick={()=>{setDetailId(null);setTab('list')}}>All Strains</button><button className={`enc-tab ${tab==='generations'?'active':''}`} onClick={()=>{setDetailId(null);setTab('generations')}}>Game Tiers</button></div>
    <div className="enc-search"><input placeholder="Search encyclopedia..." value={query} onChange={e=>{setDetailId(null);setQuery(e.target.value)}}/></div>
    <div className="enc-body" ref={bodyRef}>{selected?<>
      <button className="enc-back-btn" onClick={()=>setDetailId(null)}>← Back</button><div className="enc-detail-hero"><div className="enc-detail-emoji">{selected.emoji}</div><h2>{selected.name}</h2><div>{selected.type} · Game tier {selected.generation}</div></div>
      <div className="enc-lineage">🧬 {selected.lineage}</div><p className="enc-description">{selected.description}</p>
      <div className="result-stats"><div>THC: {selected.thc_range}</div><div>CBD: {selected.cbd_range}</div></div>
      <GeneticsEvidence strain={selected}/><h3>Reported effects</h3><div className="result-effects">{selected.effects?.map(e=><span key={e} className="effect-tag">{e}</span>)}</div>
      <h3>Flavor profile</h3><div className="flavor-bars">{Object.entries(selected.flavor||{}).map(([name,v])=><div key={name}><span>{name}</span><progress max="1" value={v}/></div>)}</div>
      <h3>{selected.unlock?.kind==='cross'?'Published parent combination':selected.unlock?.kind==='selection'?'Named selection':'Seed-bank accession'}</h3>{selected.unlock?.kind==='archive'&&<p>Imported after {selected.unlock.after_crosses} unique cross outcomes. {selected.genetics_status==='unknown'?'Exact parents are unknown.':'The established accession is imported without inventing missing parent crosses.'}</p>}{selected.unlock?.kind==='selection'&&<p>Unlocked from {strains.find(s=>s.id===selected.unlock.requires[0])?.name}. No new cross is claimed.</p>}{recipes.filter(r=>r.offspring_id===selected.id).map(r=><div className="hint-item" key={r.id}>{[r.parent1,r.parent2].map((p,i)=><React.Fragment key={p.id+String(i)}>{i>0?' × ':''}<button className="lineage-link" disabled={!owned.has(p.id)} onClick={()=>setDetailId(p.id)}>{owned.has(p.id)?p.name:'???'}</button></React.Fragment>)}</div>)}
      <h3>Descendants</h3><div className="result-effects">{[...new Set(recipes.filter(r=>r.parent1_id===selected.id||r.parent2_id===selected.id).map(r=>r.offspring_id))].map(id=><button className="effect-tag" disabled={!owned.has(id)} onClick={()=>setDetailId(id)} key={id}>{owned.has(id)?strains.find(s=>s.id===id)?.name:'🔒 ???'}</button>)}</div>
    </>:tab==='list'?filtered.map(item):tiers.map(g=><section className="enc-gen-section" key={g}><h3>{g===0?'Landrace origins':`Game tier ${g}`}</h3>{filtered.filter(s=>s.generation===g).map(item)}</section>)}</div>
  </div></div>;
}
