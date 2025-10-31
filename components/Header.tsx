import React from 'react';
import { ElephantIcon } from './icons/ElephantIcon';
import { Language } from '../types';

interface HeaderProps {
    language: Language | null;
    onLanguageChange: () => void;
}

export const Header: React.FC<HeaderProps> = ({ language, onLanguageChange }) => {
    return (
        <header className="bg-maroon-800/10 backdrop-blur-sm p-4 text-stone-800 shadow-md flex justify-between items-center z-10">
            <div className="flex items-center gap-3">
                <ElephantIcon className="h-10 w-10 text-amber-600" />
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-maroon-900">KannadaTalk</h1>
                    <p className="text-xs text-stone-600">Learn Kannada Easily</p>
                </div>
            </div>
            {language && (
                <button
                    onClick={onLanguageChange}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 shadow-sm text-sm"
                >
                    Switch Language
                </button>
            )}
        </header>
    );
};
