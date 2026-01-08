
import React from 'react';
import ContentArea from '../ContentArea';

interface LibriSectionProps {
    onBack: () => void;
}

interface PlatformCardProps {
    icon: string;
    title: string;
    description: string;
    link: string;
    bgColor: string;
}

const PlatformCard: React.FC<PlatformCardProps> = ({ icon, title, description, link, bgColor }) => (
    <div className="bg-white p-5 rounded-xl text-center shadow-md transition-transform hover:scale-105">
        <div className="text-4xl mb-3">{icon}</div>
        <h4 className="text-lg font-bold text-slate-800 mb-2">{title}</h4>
        <p className="text-slate-600 text-sm mb-4 h-10">{description}</p>
        <a href={link} target="_blank" rel="noopener noreferrer" className={`${bgColor} text-white py-2 px-5 rounded-full text-sm font-bold inline-block`}>
            Accedi
        </a>
    </div>
);

const LibriSection: React.FC<LibriSectionProps> = ({ onBack }) => {
    return (
        <ContentArea title="Libri di Testo" onBack={onBack}>
            <p className="mb-6">Consulta i tuoi libri in formato digitale.</p>

            <div className="bg-green-50 p-6 rounded-2xl mb-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">📚 Piattaforme Libri Digitali</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PlatformCard 
                        icon="📖"
                        title="myZanichelli"
                        description="Accedi ai contenuti digitali Zanichelli"
                        link="https://my.zanichelli.it/"
                        bgColor="bg-red-500 hover:bg-red-600"
                    />
                     <PlatformCard 
                        icon="🎓"
                        title="HUB Scuola"
                        description="Piattaforma Mondadori Education"
                        link="https://www.hubscuola.it/login"
                        bgColor="bg-blue-500 hover:bg-blue-600"
                    />
                     <PlatformCard 
                        icon="📱"
                        title="My Place - Sanoma"
                        description="Contenuti digitali Sanoma Italia"
                        link="https://login.sanoma.it/"
                        bgColor="bg-green-600 hover:bg-green-700"
                    />
                     <PlatformCard 
                        icon="🔵"
                        title="Pearson"
                        description="Piattaforma digitale Pearson"
                        link="https://login.pearson.com/v1/piapi/iesui/signin"
                        bgColor="bg-purple-500 hover:bg-purple-600"
                    />
                </div>
            </div>
        </ContentArea>
    );
};

export default LibriSection;