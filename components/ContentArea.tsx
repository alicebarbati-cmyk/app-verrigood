
import React from 'react';
import { ArrowLeftIcon } from './icons';

interface ContentAreaProps {
    title: string;
    onBack: () => void;
    children: React.ReactNode;
}

const ContentArea: React.FC<ContentAreaProps> = ({ title, onBack, children }) => {
    return (
        <div className="bg-white/95 rounded-2xl p-8 shadow-xl animate-fade-in">
            <header className="flex items-center mb-6 pb-4 border-b-2 border-slate-200">
                <button 
                    onClick={onBack}
                    className="bg-slate-500 text-white font-semibold py-2 px-5 rounded-full cursor-pointer mr-5 text-base transition-colors duration-300 hover:bg-slate-600 flex items-center justify-center"
                >
                    <ArrowLeftIcon />
                    Indietro
                </button>
                <h2 className="text-3xl font-bold text-slate-800">{title}</h2>
            </header>
            <div className="text-base leading-relaxed text-slate-700">
                {children}
            </div>
        </div>
    );
};

export default ContentArea;
