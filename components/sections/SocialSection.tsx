import React from 'react';
import ContentArea from '../ContentArea';

interface SocialSectionProps {
    onBack: () => void;
}

interface LinkItemProps {
    href: string;
    title: string;
    description: string;
}

const LinkItem: React.FC<LinkItemProps> = ({ href, title, description }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block bg-slate-100 p-4 rounded-lg border-l-4 border-blue-500 mb-3 transition-colors hover:bg-blue-50 hover:border-blue-600"
    >
        <h4 className="font-bold text-slate-800">{title}</h4>
        <p className="text-sm text-slate-600">{description}</p>
    </a>
);


const SocialSection: React.FC<SocialSectionProps> = ({ onBack }) => {
    const links = [
        { 
            href: 'https://youtu.be/UWuPak4bBCQ?si=D5-nlGlRj4nw-QaE', 
            title: 'canzone della scuola', 
            description: 'Guarda il nostro video di presentazione su YouTube.' 
        },
        { 
            href: 'https://youtube.com/@iisspietroverrimilano?si=IJtNhk5n_qdCOIAQ', 
            title: 'Canale YouTube IISS Pietro Verri', 
            description: 'Il canale YouTube ufficiale con video di eventi e lezioni.' 
        },
        { 
            href: 'https://www.verri.edu.it/', 
            title: 'Sito Web Scuola (verri.edu.it)', 
            description: 'Link diretto al sito ufficiale dell\'istituto Pietro Verri.'
        },
        { 
            href: 'https://www.istruzione.it/pagoinrete/', 
            title: "Cos'è Pago In Rete | Ministero dell'Istruzione", 
            description: 'Il servizio del Ministero per i pagamenti telematici delle tasse scolastiche.' 
        },
    ];

    return (
        <ContentArea title="Collegamenti utili" onBack={onBack}>
            <p className="mb-6">Accedi a risorse, piattaforme e siti web importanti per la vita scolastica.</p>
            <div className="list-none p-0">
                {links.map(link => (
                    <LinkItem key={link.title} {...link} />
                ))}
            </div>
        </ContentArea>
    );
};

export default SocialSection;