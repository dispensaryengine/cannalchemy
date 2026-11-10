import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useGame } from '../../context/GameContext';
export default function StrainMap({onClose}) {
  const {strains,recipes,discoveries,setDetailId}=useGame();
  const [labels,setLabels]=useState(true),[hidden,setHidden]=useState(true);
  const [view,setView]=useState({x:0,y:0,scale:1});
  const drag=useRef(null);
  const owned=useMemo(()=>new Set(discoveries.map(d=>d.strain_id)),[discoveries]);
  const nodes=useMemo(()=>{const result={};for(let gen=0;gen<=5;gen++){const group=strains.filter(s=>s.generation===gen);group.forEach((s,i)=>{result[s.id]={s,x:120+gen*255,y:80+i*(800/Math.max(group.length-1,1))}})}return result},[strains]);
  useEffect(()=>{const key=e=>{if(e.key==='Escape')onClose()};document.addEventListener('keydown',key);return()=>document.removeEventListener('keydown',key)},[onClose]);
  return <div className="strainmap-overlay open" role="dialog" aria-modal="true" aria-label="Strain map"><div className="strainmap-backdrop" onClick={onClose}/><div className="strainmap-container">
    <div className="strainmap-header"><div className="strainmap-title-area"><span className="strainmap-title">🗺️ Strain Lineage Map</span><span className="strainmap-subtitle">{discoveries.length} / {strains.length} discovered</span></div><div className="strainmap-controls">
      <button className="strainmap-ctrl-btn" onClick={()=>setView({x:0,y:0,scale:1})}>⟲ Reset View</button><button className="strainmap-ctrl-btn" onClick={()=>setLabels(!labels)}>Labels: {labels?'On':'Off'}</button><button className="strainmap-ctrl-btn" onClick={()=>setHidden(!hidden)}>Hidden: {hidden?'Show':'Hide'}</button><button className="strainmap-close" aria-label="Close strain map" onClick={onClose}>×</button>
    </div></div><div className="strainmap-canvas-wrap">
      <svg className="lineage-map" viewBox="0 0 1560 980" onWheel={e=>setView(v=>({...v,scale:Math.min(3,Math.max(.5,v.scale*(e.deltaY<0?1.1:.9)))}))} onPointerDown={e=>{drag.current={px:e.clientX,py:e.clientY,x:view.x,y:view.y};e.currentTarget.setPointerCapture(e.pointerId)}} onPointerMove={e=>{if(drag.current){const rect=e.currentTarget.getBoundingClientRect();setView(v=>({...v,x:drag.current.x+(e.clientX-drag.current.px)*1560/rect.width,y:drag.current.y+(e.clientY-drag.current.py)*980/rect.height}))}}} onPointerUp={()=>{drag.current=null}}>
        <g transform={`translate(${view.x} ${view.y}) scale(${view.scale})`}>
          {[0,1,2,3,4,5].map(g=><text key={g} x={120+g*255} y="32" fill="#c8a850" textAnchor="middle" fontSize="18">{g===0?'Landraces':`Gen ${g}`}</text>)}
          {recipes.flatMap(r=>[r.parent1_id,r.parent2_id].map((id,i)=>{const a=nodes[id],b=nodes[r.offspring_id];return a&&b&&(hidden||(owned.has(id)&&owned.has(r.offspring_id)))?<line key={`${r.id}-${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={owned.has(id)&&owned.has(r.offspring_id)?'#4a9a6a':'#263d35'} strokeWidth="1.5"/>:null}))}
          {Object.values(nodes).filter(n=>hidden||owned.has(n.s.id)).map(({s,x,y})=>{const known=owned.has(s.id),craftable=recipes.some(r=>r.offspring_id===s.id&&owned.has(r.parent1_id)&&owned.has(r.parent2_id));return <g key={s.id} role="button" tabIndex={known?0:-1} aria-label={known?s.name:'Undiscovered strain'} onKeyDown={e=>{if(e.key==='Enter'&&known){onClose();setDetailId(s.id)}}} onClick={()=>{if(known){onClose();setDetailId(s.id)}}} style={{cursor:known?'pointer':'default'}}>
            <title>{known?s.name:craftable?'Craftable now':'Undiscovered strain'}</title><circle cx={x} cy={y} r={known?15:10} fill={known?(s.generation===0?'#c8a850':'#7ec850'):craftable?'#60a0d0':'#2a3a40'} stroke="#0d1a0f" strokeWidth="3"/>{labels&&<text x={x} y={y+32} textAnchor="middle" fill={known?'#c8e8b0':'#557365'} fontSize="14">{known?s.name:'???'}</text>}
          </g>})}
        </g>
      </svg><div className="strainmap-zoom-info">Scroll to zoom · Drag to pan · Click a discovered strain for details</div>
      <div className="map-key">🟡 Landrace · 🟢 Discovered · 🔵 Craftable · ⚫ Hidden</div>
    </div></div></div>;
}
