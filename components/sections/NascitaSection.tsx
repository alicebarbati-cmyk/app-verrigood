import React from 'react';
import ContentArea from '../ContentArea';

interface NascitaSectionProps {
    onBack: () => void;
}

const NascitaSection: React.FC<NascitaSectionProps> = ({ onBack }) => {
    return (
        <ContentArea title="Nascita dell'App" onBack={onBack}>
            <div className="bg-slate-100 p-6 rounded-xl">
                <p className="text-lg text-slate-700 leading-relaxed">
                    Questa app nasce in occasione del progetto scolastico: “La nostra scuola in codice” ed è stata creata dopo un'analisi delle esigenze di studenti e professori del nostro istituto. Verrigood racchiude al suo interno diverse funzioni e ha lo scopo di rendere la vita scolastica più facile, veloce e divertente.
                </p>
            </div>
        </ContentArea>
    );
};

export default NascitaSection;