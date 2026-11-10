import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AuthProvider } from './components/Auth/AuthContext';
import { useAuth } from './hooks/useAuth';
import { GameProvider, useGame } from './context/GameContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import GuestLogin from './components/Auth/GuestLogin';
import Header from './components/Shared/Header';
import CollectionPanel from './components/Collection/CollectionPanel';
import CraftArea from './components/CraftArea/CraftArea';
import Encyclopedia from './components/Encyclopedia/Encyclopedia';
import StrainMap from './components/StrainMap/StrainMap';
import Notification from './components/Shared/Notification';
import LoadingSpinner from './components/Shared/LoadingSpinner';
import './App.css';
function Game() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { strains, recipes, discoveries, isLoading, error, detailId, setDetailId } = useGame();
  const [authMode, setAuthMode] = useState('login');
  const [encyclopedia, setEncyclopedia] = useState(false);
  const [map, setMap] = useState(false);
  const [notification, setNotification] = useState(null);
  const owned = new Set(discoveries.map(d => d.strain_id));
  const hints = recipes.filter(r => !owned.has(r.offspring_id) && owned.has(r.parent1_id) && owned.has(r.parent2_id)).slice(0,4);
  const noop = () => {};
  if (authLoading && !isAuthenticated) return <LoadingSpinner isLoading />;
  if (!isAuthenticated) return <div className="auth-overlay open"><div className="auth-card">
    <div className="auth-logo">🌿 CHRON<span>ALCHEMY</span></div>
    <p className="auth-subtitle">Cannabis Strain Lineage Game</p>
    <div className="auth-tabs"><button className={`auth-tab ${authMode==='login'?'active':''}`} onClick={()=>setAuthMode('login')}>Log In</button><button className={`auth-tab ${authMode==='signup'?'active':''}`} onClick={()=>setAuthMode('signup')}>Sign Up</button></div>
    {authMode==='login'?<Login onSwitchToSignup={()=>setAuthMode('signup')} onClose={noop}/>:<Signup onSwitchToLogin={()=>setAuthMode('login')} onClose={noop}/>}
    <GuestLogin onClose={noop}/>
  </div></div>;
  return <div className="app">
    <Header onOpenEncyclopedia={()=>setEncyclopedia(true)} onOpenStrainMap={()=>setMap(true)}/>
    {isLoading?<LoadingSpinner isLoading/>:error?<div className="load-error" role="alert">{error}<button onClick={()=>window.location.reload()}>Retry</button></div>:<div className="main">
      <CollectionPanel/>
      <CraftArea onNotify={(message,type)=>setNotification({message,type})}/>
      <aside className="info-panel"><section className="hint-section"><div className="hint-title">💡 Possible Combos</div><div className="hint-list">
        {hints.length?hints.map(r=><div className="hint-item" key={r.id}><strong>{r.offspring?.name}</strong><br/>{r.parent1?.name} × {r.parent2?.name}</div>):<div className="hint-item">{discoveries.length===strains.length?'🎉 All strains discovered!':'Keep exploring to unlock hints.'}</div>}
      </div></section><section className="discovery-log"><div className="log-title">📜 Discovery Log</div>
        {[...discoveries].filter(d=>d.generation>0).sort((a,b)=>new Date(b.discovered_at)-new Date(a.discovered_at)).map(d=><div className="log-entry" key={d.strain_id}><div className="log-strain">🌿 {d.strain_name}</div><div className="log-combo">{strains.find(s=>s.id===d.strain_id)?.lineage}</div></div>)}
      </section></aside>
    </div>}
    {(encyclopedia||detailId)&&<Encyclopedia onClose={()=>{setEncyclopedia(false);setDetailId(null)}}/>}
    {map&&<StrainMap onClose={()=>setMap(false)}/>}
    {notification&&<Notification {...notification} onClose={()=>setNotification(null)}/>}
  </div>;
}
export default function App() { return <AuthProvider><GameProvider><DndProvider backend={HTML5Backend}><Game/></DndProvider></GameProvider></AuthProvider>; }
