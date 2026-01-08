
import React from 'react';

interface SectionCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}

const SectionCard: React.FC<SectionCardProps> = ({ icon, title, description, onClick }) => {
    return (
        <div 
            className="bg-white/95 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ease-in-out shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:border-blue-500 border-2 border-transparent"
            onClick={onClick}
        >
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
        </div>
    );
};

export default SectionCard;
