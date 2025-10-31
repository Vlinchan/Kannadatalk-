
import React from 'react';
import { Language } from '../types';
import { LANGUAGES } from '../constants';

interface LanguageSelectorProps {
  onSelect: (language: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-maroon-900 mb-2">Welcome!</h2>
        <p className="text-stone-700">Please select your language to begin.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-md">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            onClick={() => onSelect(lang.id)}
            className="group flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-300 ease-in-out border-2 border-transparent hover:border-amber-500"
          >
            <span className="text-6xl mb-4">{lang.flag}</span>
            <span className="text-2xl font-semibold text-stone-800 group-hover:text-maroon-900">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
