
import React, { useState, useCallback } from 'react';
import Slot from './Slot';
import CombineButton from './CombineButton';
import ResultPanel from './ResultPanel';
import { useDrop } from 'react-dnd';
import { validateRecipe } from '../../services/recipes';
import { useDiscoveries } from '../../hooks/useDiscoveries';

const CraftArea = ({ onNotify }) => {
  const [slot1, setSlot1] = useState(null);
  const [slot2, setSlot2] = useState(null);
  const [result, setResult] = useState(null);
  const [isCombining, setIsCombining] = useState(false);
  const { addDiscovery } = useDiscoveries();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'strain',
    drop: (item) => {
      if (!slot1) {
        setSlot1(item.strain);
      } else if (!slot2) {
        setSlot2(item.strain);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleCombine = useCallback(async () => {
    if (!slot1 || !slot2) return;

    setIsCombining(true);
    try {
      const { valid, offspring } = await validateRecipe(slot1.id, slot2.id);
      if (valid && offspring) {
        setResult(offspring);
        // Auto-add to discoveries if it's a new strain
        await addDiscovery(offspring.id);
        onNotify(`Discovered ${offspring.name}!`, 'success');
      } else {
        onNotify('Invalid combination!', 'error');
      }
    } catch (error) {
      console.error('Error combining strains:', error);
      onNotify('Error combining strains', 'error');
    } finally {
      setIsCombining(false);
    }
  }, [slot1, slot2, addDiscovery, onNotify]);

  const handleClearSlots = useCallback(() => {
    setSlot1(null);
    setSlot2(null);
    setResult(null);
  }, []);

  return (
    <div className="craft-area">
      <div className="craft-canvas" ref={drop}>
        <div className="drop-zone">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Slot strain={slot1} onClear={() => setSlot1(null)} />
              <div className="plus-sign">+</div>
              <Slot strain={slot2} onClear={() => setSlot2(null)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <CombineButton
                onClick={handleCombine}
                disabled={!slot1 || !slot2 || isCombining}
              />
              <button className="clear-btn" onClick={handleClearSlots}>
                Clear Slots
              </button>
            </div>
          </div>
        </div>
        <ResultPanel
          result={result}
          onClose={() => setResult(null)}
        />
      </div>
    </div>
  );
};

export default CraftArea;
