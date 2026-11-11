import React, { useState } from 'react';
import Slot from './Slot';
import CombineButton from './CombineButton';
import ResultPanel from './ResultPanel';
import { useDrop } from 'react-dnd';
import { validateRecipe } from '../../services/recipes';
import { useGame } from '../../context/GameContext';
export default function CraftArea({ onNotify }) {
  const { slots, setSlots, selectStrain, refresh, setCombosCount } = useGame();
  const [result, setResult] = useState(null);
  const [isCombining, setCombining] = useState(false);
  const [{isOver}, drop] = useDrop(() => ({ accept: 'strain', drop: (item,monitor) => { if (!monitor.didDrop()) selectStrain(item.strain); }, collect: monitor => ({isOver: monitor.isOver()}) }), [slots]);
  async function combine() {
    if (!slots[0] || !slots[1] || isCombining) return;
    setCombining(true);
    try {
      const data = await validateRecipe(slots[0].id, slots[1].id);
      setCombosCount(data.combos_count);
      if (data.valid) {
        await refresh();
        setResult({...data.offspring, isNew: data.isNew, remainingOutcomes: data.remaining_outcomes, unlocked: data.unlocked});
        onNotify(data.isNew?`Discovered ${data.offspring.name}!${data.unlocked?.length ? ` + ${data.unlocked.length} seed-bank accessions` : ''}`:`${data.offspring.name} is already in your collection.`, 'success');
      } else onNotify('No known combination — try different strains.', 'error');
    } catch (err) { onNotify(err.message || 'Unable to combine strains', 'error'); }
    finally { setCombining(false); }
  }
  const clear = () => { setSlots([null,null]); setResult(null); };
  return <div className="craft-area"><div className={`craft-canvas ${isOver?'drag-over':''}`} ref={drop}>
    <div className="drop-zone"><div className="craft-controls"><div className="parent-slots">
      <Slot strain={slots[0]} label="Parent A" onClear={()=>setSlots([null,slots[1]])} onDrop={s=>setSlots([s,slots[1]])}/>
      <div className="plus-sign">+</div>
      <Slot strain={slots[1]} label="Parent B" onClear={()=>setSlots([slots[0],null])} onDrop={s=>setSlots([slots[0],s])}/>
    </div><CombineButton onClick={combine} disabled={!slots[0]||!slots[1]||isCombining}/><button className="clear-btn" onClick={clear}>Clear Slots</button>
    <p className="craft-help">Click or drag two parents. Some pairs have more than one named outcome; repeat to discover each.</p></div></div>
    <ResultPanel result={result} onClose={clear}/>
  </div></div>;
}
