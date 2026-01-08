
import React, { useState } from 'react';
import type { Section } from './types';
import Header from './components/Header';
import SectionCard from './components/SectionCard';

// Icons
import { 
    BookOpenIcon, LocationMarkerIcon, LibraryIcon, 
    ClipboardListIcon, PencilIcon, DocumentTextIcon, ClockIcon, 
    ShieldCheckIcon, AppleIcon, QuestionMarkCircleIcon 
} from './components/icons';

// Section Components
import StoriaSection from './components/sections/StoriaSection';
import DoveSiamoSection from './components/sections/DoveSiamoSection';
import RisorseSection from './components/sections/RisorseSection';
import RegistroSection from './components/sections/RegistroSection';
import StudioSection from './components/sections/StudioSection';
import VerificaSection from './components/sections/VerificaSection';
import OrganizzazioneSection from './components/sections/OrganizzazioneSection';
import CiboSection from './components/sections/CiboSection';
import RegolamentoSection from './components/sections/RegolamentoSection';
import InformazioniSection from './components/sections/InformazioniSection';

const App: React.FC = () => {
    const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

    const handleBack = () => {
        setActiveSectionId(null);
    };

    const sections: Section[] = [
        { id: 'storia', title: 'Storia della Scuola', description: 'Scopri le origini e l\'evoluzione del nostro istituto', icon: <BookOpenIcon />, component: (props) => <StoriaSection {...props} /> },
        { id: 'dove-siamo', title: 'Dove siamo e contatti', description: 'Trova la nostra sede e le informazioni di contatto', icon: <LocationMarkerIcon />, component: (props) => <DoveSiamoSection {...props} /> },
        { id: 'risorse', title: 'Libri e Collegamenti', description: 'Link a piattaforme digitali, libri di testo e risorse utili', icon: <LibraryIcon />, component: (props) => <RisorseSection {...props} /> },
        { id: 'registro', title: 'Registro', description: 'Accedi al registro e calcola la tua media', icon: <ClipboardListIcon />, component: (props) => <RegistroSection {...props} /> },
        { id: 'studio', title: 'Lezioni', description: 'Crea piani di lezione e trova collegamenti interdisciplinari con l\'AI', icon: <PencilIcon />, component: (props) => <StudioSection {...props} /> },
        { id: 'verifica', title: 'Verifica', description: 'Simula una verifica con domande generate da AI', icon: <DocumentTextIcon />, component: (props) => <VerificaSection {...props} /> },
        { id: 'regolamento', title: 'Regolamento d\'Istituto', description: 'Poni una domanda sul regolamento scolastico', icon: <ShieldCheckIcon />, component: (props) => <RegolamentoSection {...props} /> },
        { id: 'organizzazione', title: 'Gestione Tempo', description: 'Pianifica la giornata con AI e usa il timer per lo studio', icon: <ClockIcon />, component: (props) => <OrganizzazioneSection {...props} /> },
        { id: 'cibo', title: 'Cibo', description: 'Idee per le tue merende e snack', icon: <AppleIcon />, component: (props) => <CiboSection {...props} /> },
        { id: 'info', title: 'Informazioni e FAQ', description: "La storia dell'app e risposte alle domande comuni", icon: <QuestionMarkCircleIcon />, component: (props) => <InformazioniSection {...props} /> },
    ];

    const ActiveSectionComponent = sections.find(s => s.id === activeSectionId)?.component;

    return (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 min-h-screen text-slate-800 font-sans">
            <main className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
                <Header />
                
                {ActiveSectionComponent ? (
                    <ActiveSectionComponent onBack={handleBack} />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        {sections.map(section => (
                            <SectionCard
                                key={section.id}
                                icon={section.icon}
                                title={section.title}
                                description={section.description}
                                onClick={() => setActiveSectionId(section.id)}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
