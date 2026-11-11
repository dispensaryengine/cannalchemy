import React,{useEffect,useMemo,useRef,useState} from 'react';
import {useGame} from '../../context/GameContext';
export default function StrainMap({onClose}){
 const {strains,recipes,discoveries,setDetailId}=useGame();
 const [labels,setLabels]=useState(true),[hidden,setHidden]=useState(false),[focus,setFocus]=useState('');
 const [view,setView]=useState({x:0,y:0,scale:1});const drag=useRef(null);
 const owned=useMemo(()=>new Set(discoveries.map(d=>d.strain_id)),[discoveries]);
 const relations=useMemo(()=>[...recipes.flatMap(r=>[r.parent1_id,r.parent2_id].map((id,i)=>({id:`${r.id}-${i}`,from:id,to:r.offspring_id,selection:false}))),...strains.filter(s=>s.unlock?.kind==='selection').map(s=>({id:`select-${s.id}`,from:s.unlock.requires[0],to:s.id,selection:true}))],[recipes,strains]);
 const visible=useMemo(()=>{
   let chosen=strains.filter(s=>hidden||owned.has(s.id));
   if(focus){const ids=new Set([focus]);relations.filter(r=>r.from===focus||r.to===focus).forEach(r=>{ids.add(r.from);ids.add(r.to)});chosen=chosen.filter(s=>ids.has(s.id));}
   return chosen;
 },[strains,hidden,owned,focus,relations]);
 const tiers=[...new Set(visible.map(s=>s.generation))].sort((a,b)=>a-b);
 const nodes={};tiers.forEach((tier,col)=>{visible.filter(s=>s.generation===tier).forEach((s,row)=>{nodes[s.id]={s,x:130+col*255,y:95+row*64}})});
 const width=Math.max(800,tiers.length*255+30),height=Math.max(600,...tiers.map(g=>visible.filter(s=>s.generation===g).length*64+100));
 useEffect(()=>{setView({x:0,y:0,scale:1})},[hidden,focus]);
 useEffect(()=>{const key=e=>{if(e.key==='Escape')onClose()};document.addEventListener('keydown',key);return()=>document.removeEventListener('keydown',key)},[onClose]);
 return <div className="strainmap-overlay open" role="dialog" aria-modal="true" aria-label="Strain map"><div className="strainmap-backdrop" onClick={onClose}/><div className="strainmap-container">
 <div className="strainmap-header"><div className="strainmap-title-area"><span className="strainmap-title">🗺️ Strain Lineage Map</span><span className="strainmap-subtitle">{discoveries.length} / {strains.length} discovered · Game tiers</span></div><div className="strainmap-controls">
 <select className="map-focus" aria-label="Focus lineage on strain" value={focus} onChange={e=>setFocus(e.target.value)}><option value="">All branches</option>{strains.filter(s=>owned.has(s.id)).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select>
 <button className="strainmap-ctrl-btn" onClick={()=>setView({x:0,y:0,scale:1})}>⟲ Reset View</button><button className="strainmap-ctrl-btn" onClick={()=>setLabels(!labels)}>Labels: {labels?'On':'Off'}</button><button className="strainmap-ctrl-btn" onClick={()=>setHidden(!hidden)}>Hidden: {hidden?'Show':'Hide'}</button><button className="strainmap-close" aria-label="Close strain map" onClick={onClose}>×</button>
 </div></div><div className="strainmap-canvas-wrap">
 <svg className="lineage-map" viewBox={`0 0 ${width} ${height}`} onWheel={e=>setView(v=>({...v,scale:Math.min(5,Math.max(.3,v.scale*(e.deltaY<0?1.15:.87)))}))} onPointerDown={e=>{drag.current={px:e.clientX,py:e.clientY,x:view.x,y:view.y};e.currentTarget.setPointerCapture(e.pointerId)}} onPointerMove={e=>{if(drag.current){const rect=e.currentTarget.getBoundingClientRect();const units=Math.max(width/rect.width,height/rect.height);setView(v=>({...v,x:drag.current.x+(e.clientX-drag.current.px)*units,y:drag.current.y+(e.clientY-drag.current.py)*units}))}}} onPointerUp={()=>{drag.current=null}} onPointerCancel={()=>{drag.current=null}}>
 <g transform={`translate(${view.x} ${view.y}) scale(${view.scale})`}>
 {tiers.map((g,col)=><text key={g} x={130+col*255} y="32" fill="#c8a850" textAnchor="middle" fontSize="18">{g===0?'Starters':`Tier ${g}`}</text>)}
 {relations.map(r=>{const a=nodes[r.from],b=nodes[r.to];return a&&b?<line key={r.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={r.selection?'#bd9d5a':'#4a9a6a'} strokeDasharray={r.selection?'5 4':undefined} strokeWidth="1.5"/>:null})}
 {Object.values(nodes).map(({s,x,y})=>{const known=owned.has(s.id),craftable=recipes.some(r=>r.offspring_id===s.id&&owned.has(r.parent1_id)&&owned.has(r.parent2_id));return <g key={s.id} role="button" tabIndex={known?0:-1} aria-label={known?s.name:'Undiscovered strain'} onKeyDown={e=>{if(e.key==='Enter'&&known){onClose();setDetailId(s.id)}}} onClick={()=>{if(known){onClose();setDetailId(s.id)}}} style={{cursor:known?'pointer':'default'}}><title>{known?s.name:craftable?'Craftable now':'Undiscovered strain'}</title><circle cx={x} cy={y} r={known?13:9} fill={known?(s.unlock?.kind==='archive'?'#c8a850':'#7ec850'):craftable?'#60a0d0':'#2a3a40'} stroke="#0d1a0f" strokeWidth="3"/>{labels&&<text x={x} y={y+30} textAnchor="middle" fill={known?'#c8e8b0':'#557365'} fontSize="13">{known?s.name:'???'}</text>}</g>})}
 </g></svg><div className="strainmap-zoom-info">Scroll to zoom · Drag to pan · Choose a strain to focus its family</div><div className="map-key">Gold: imports · Green: discovered · Dashed: selection · Tiers show game depth</div>
 </div></div></div>;
}
