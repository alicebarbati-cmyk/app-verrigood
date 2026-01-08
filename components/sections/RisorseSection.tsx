
import React from 'react';
import ContentArea from '../ContentArea';

interface RisorseSectionProps {
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

interface PlatformCardProps {
    icon: string;
    title: string;
    description: string;
    link: string;
    bgColor: string;
}

const PlatformCard: React.FC<PlatformCardProps> = ({ icon, title, description, link, bgColor }) => (
    <div className="bg-white p-5 rounded-xl text-center shadow-md transition-transform hover:scale-105 border border-slate-100">
        <div className="text-4xl mb-3">{icon}</div>
        <h4 className="text-lg font-bold text-slate-800 mb-2">{title}</h4>
        <p className="text-slate-600 text-sm mb-4 h-10">{description}</p>
        <a href={link} target="_blank" rel="noopener noreferrer" className={`${bgColor} text-white py-2 px-5 rounded-full text-sm font-bold inline-block`}>
            Accedi
        </a>
    </div>
);

const RisorseSection: React.FC<RisorseSectionProps> = ({ onBack }) => {
    const generalLinks = [
        { 
            href: 'https://youtu.be/UWuPak4bBCQ?si=D5-nlGlRj4nw-QaE', 
            title: 'Canzone della Scuola', 
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

    const bookPlatforms = [
        { 
            icon: "📖",
            title: "myZanichelli",
            description: "Accedi ai contenuti digitali Zanichelli",
            link: "https://my.zanichelli.it/",
            bgColor: "bg-red-500 hover:bg-red-600"
        },
        { 
            icon: "🎓",
            title: "HUB Scuola",
            description: "Piattaforma Mondadori Education",
            link: "https://www.hubscuola.it/login",
            bgColor: "bg-blue-500 hover:bg-blue-600"
        },
        { 
            icon: "📱",
            title: "My Place - Sanoma",
            description: "Contenuti digitali Sanoma Italia",
            link: "https://login.sanoma.it/",
            bgColor: "bg-green-600 hover:bg-green-700"
        },
        { 
            icon: "🔵",
            title: "Pearson",
            description: "Piattaforma digitale Pearson",
            link: "https://login.pearson.com/v1/piapi/iesui/signin",
            bgColor: "bg-purple-500 hover:bg-purple-600"
        }
    ];

    return (
        <ContentArea title="Libri e Collegamenti" onBack={onBack}>
            <div className="space-y-10">
                <section>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
                        <span className="mr-2">📚</span> Libri di Testo Digitali
                    </h3>
                    <p className="mb-6 text-slate-600">Accedi alle piattaforme per consultare i tuoi libri in formato digitale.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {bookPlatforms.map((platform, idx) => (
                            <PlatformCard key={idx} {...platform} />
                        ))}
                    </div>
                </section>

                <hr className="border-slate-200" />

                <section>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
                        <span className="mr-2">🔗</span> Collegamenti Utili
                    </h3>
                    <p className="mb-6 text-slate-600">Risorse esterne, canali social e siti istituzionali.</p>
                    <div className="space-y-3">
                        {generalLinks.map((link, idx) => (
                            <LinkItem key={idx} {...link} />
                        ))}
                    </div>
                </section>
            </div>
        </ContentArea>
    );
};

export default RisorseSection;
