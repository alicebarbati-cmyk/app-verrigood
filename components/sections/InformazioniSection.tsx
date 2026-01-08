
import React, { useState } from 'react';
import ContentArea from '../ContentArea';

interface InformazioniSectionProps {
    onBack: () => void;
}

const faqs = [
    {
        question: "Tutte le nozioni relative agli argomenti scolastici presenti in questa app sono vere?",
        answer: "Le nozioni sono quelle in possesso dell'IA quindi potrebbero essere inesatte, non aggiornate o approssimative. D'altronde per tutto ciò che trovi online è necessario avere senso critico."
    },
    {
        question: "Tutti i prodotti suggeriti posso trovarli al bar?",
        answer: "Certo! Il generatore è basato su un elenco dei prodotti che è possibile reperire nel bar della scuola."
    },
    {
        question: "Il regolamento d'istituto su cui si basa l'app è aggiornato?",
        answer: "Certo! Il regolamento che è stato inserito in questa app è aggiornato al 10/11/2025"
    },
    {
        question: "Perchè dovrei utilizzare questa app?",
        answer: "Per non privarti della possibilità di sfruttare al meglio l'IA per ottenere il massimo risultato con il minore sforzo"
    }
];

interface FaqItemProps {
    faq: { question: string; answer: string };
    isOpen: boolean;
    onClick: () => void;
}

const FaqItem: React.FC<FaqItemProps> = ({ faq, isOpen, onClick }) => {
    return (
        <div className="border-b border-slate-200 last:border-b-0">
            <button
                onClick={onClick}
                className="w-full text-left flex justify-between items-center p-5 hover:bg-slate-50 focus:outline-none transition-colors"
                aria-expanded={isOpen}
            >
                <span className="font-semibold text-slate-800 text-md">{faq.question}</span>
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>
            <div 
                className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                    <div className="p-5 pt-0 text-slate-700">
                        {faq.answer}
                    </div>
                </div>
            </div>
        </div>
    );
};

const InformazioniSection: React.FC<InformazioniSectionProps> = ({ onBack }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <ContentArea title="Informazioni e FAQ" onBack={onBack}>
            <div className="space-y-8">
                {/* Sezione Nascita App */}
                <section>
                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                        <span className="mr-2">🚀</span> La Nascita del Progetto
                    </h3>
                    <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                        <p className="text-slate-700 leading-relaxed">
                            Questa app nasce in occasione del progetto scolastico: <strong>“La nostra scuola in codice”</strong> ed è stata creata dopo un'analisi delle esigenze di studenti e professori del nostro istituto. 
                            <br /><br />
                            <strong>Verrigood</strong> racchiude al suo interno diverse funzioni e ha lo scopo di rendere la vita scolastica più facile, veloce e divertente, integrando strumenti moderni come l'intelligenza artificiale per il supporto allo studio.
                        </p>
                    </div>
                </section>

                <hr className="border-slate-200" />

                {/* Sezione FAQ */}
                <section>
                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                        <span className="mr-2">❓</span> Domande Frequenti
                    </h3>
                    <p className="mb-4 text-slate-600">Trova risposte alle domande più comuni sull'app e sulla scuola.</p>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
                        {faqs.map((faq, index) => (
                            <FaqItem
                                key={index}
                                faq={faq}
                                isOpen={openIndex === index}
                                onClick={() => handleToggle(index)}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </ContentArea>
    );
};

export default InformazioniSection;
