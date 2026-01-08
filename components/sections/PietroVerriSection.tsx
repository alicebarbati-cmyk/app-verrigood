
import React from 'react';
import ContentArea from '../ContentArea';

interface PietroVerriSectionProps {
    onBack: () => void;
}

const FeatureListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="bg-slate-100 p-4 rounded-lg border-l-4 border-blue-500 mb-3">{children}</li>
);

const PietroVerriSection: React.FC<PietroVerriSectionProps> = ({ onBack }) => {
    return (
        <ContentArea title="Pietro Verri" onBack={onBack}>
            <p className="mb-6">Pietro Verri (1728-1797) è stato un economista, filosofo e scrittore italiano, figura di spicco dell'Illuminismo lombardo.</p>
            <ul className="list-none p-0">
                <FeatureListItem><strong>Economista:</strong> Pioniere degli studi economici in Italia</FeatureListItem>
                <FeatureListItem><strong>Illuminista:</strong> Promotore delle idee illuministiche in Lombardia</FeatureListItem>
                <FeatureListItem><strong>Scrittore:</strong> Autore di opere fondamentali come "Meditazioni sull'economia politica"</FeatureListItem>
                <FeatureListItem><strong>Riformatore:</strong> Sostenitore di riforme sociali ed economiche progressive</FeatureListItem>
            </ul>
        </ContentArea>
    );
};

export default PietroVerriSection;
