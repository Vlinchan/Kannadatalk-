
import React from 'react';
import { LearningMode } from '../types';
import { MODES } from '../constants';

interface ModeSelectorProps {
  onSelect: (mode: LearningMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-maroon-900 mb-2">Choose Your Path</h2>
        <p className="text-stone-700">How would you like to start learning Kannada today?</p>
      </div>
      <div className="flex flex-col gap-5 w-full max-w-sm">
        {MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onSelect(mode.id)}
            className="group flex items-center gap-4 p-5 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl hover:bg-amber-100/50 transform transition-all duration-300 ease-in-out border border-amber-200/50"
          >
            <span className="text-4xl">{mode.icon}</span>
            <span className="text-lg font-medium text-stone-800 text-left">{mode.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
