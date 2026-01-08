
import React, { useState } from 'react';
import ContentArea from '../ContentArea';

interface MotivazioneSectionProps {
    onBack: () => void;
}

const studentQuotes = [
    "Il successo non è definitivo, il fallimento non è fatale: ciò che conta è il coraggio di continuare. - Winston Churchill",
    "Credi in te stesso e in tutto ciò che sei. Sappi che c'è qualcosa dentro di te che è più grande di qualsiasi ostacolo. - Christian D. Larson",
    "Non aspettare. Il tempo non sarà mai giusto. - Napoleon Hill",
    "L'unico modo per fare un ottimo lavoro è amare quello che fai. - Steve Jobs",
    "La differenza tra ordinario e straordinario è quel piccolo extra. - Jimmy Johnson",
    "La tua educazione è un abito che nessuno può toglierti. - B.B. King",
    "Non ho fallito. Ho solo trovato 10.000 modi che non funzionano. - Thomas A. Edison",
    "Il futuro appartiene a coloro che credono nella bellezza dei propri sogni. - Eleanor Roosevelt",
    "Studia non per sapere di più, ma per sapere meglio. - Seneca",
    "Ogni risultato inizia con la decisione di provare."
];

const teacherQuotes = [
    "L'insegnamento è l'arte di accendere la curiosità. - Anatole France",
    "Un buon insegnante può ispirare la speranza, accendere l'immaginazione e infondere l'amore per l'apprendimento. - Brad Henry",
    "Coloro che sanno, fanno. Coloro che capiscono, insegnano. - Aristotele",
    "Il compito del bravo insegnante è quello di stimolare persone apparentemente ordinarie a uno sforzo insolito. - K. Patricia Cross",
    "Insegnare è toccare una vita per sempre.",
    "Il miglior insegnante è colui che suggerisce piuttosto che dogmatizzare, e ispira nel suo ascoltatore il desiderio di insegnare a se stesso. - Edward Bulwer-Lytton",
    "L'educazione è l'arma più potente che puoi usare per cambiare il mondo. - Nelson Mandela",
    "Un insegnante che ama imparare guadagna il diritto e la capacità di aiutare gli altri a imparare.",
    "Essere un insegnante è plasmare il futuro.",
    "L'insegnamento crea tutte le altre professioni."
];

const MotivazioneSection: React.FC<MotivazioneSectionProps> = ({ onBack }) => {
    const [quote, setQuote] = useState('');
    const [quoteType, setQuoteType] = useState<'student' | 'teacher' | null>(null);

    const generateQuote = (type: 'student' | 'teacher') => {
        const quotes = type === 'student' ? studentQuotes : teacherQuotes;
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(randomQuote);
        setQuoteType(type);
    };

    return (
        <ContentArea title="Motivazione" onBack={onBack}>
            <p className="mb-6">A volte basta una piccola spinta per ritrovare la carica. Genera una frase motivazionale per te!</p>
            
            <div className="bg-slate-100 p-6 rounded-xl text-center">
                <h3 className="text-xl font-bold text-slate-800 mb-4">💡 Generatore di Frasi Motivazionali</h3>
                
                <div className="flex justify-center gap-4 mb-6">
                    <button 
                        onClick={() => generateQuote('student')} 
                        className="bg-blue-500 text-white font-bold py-2 px-6 rounded-full transition-transform duration-200 hover:scale-105"
                    >
                        Per Studenti
                    </button>
                    <button 
                        onClick={() => generateQuote('teacher')}
                        className="bg-green-500 text-white font-bold py-2 px-6 rounded-full transition-transform duration-200 hover:scale-105"
                    >
                        Per Professori
                    </button>
                </div>

                {quote && (
                    <div className={`mt-4 bg-white p-6 rounded-lg border-l-4 ${quoteType === 'student' ? 'border-blue-500' : 'border-green-500'} font-semibold text-lg italic animate-fade-in`}>
                        "{quote}"
                    </div>
                )}
            </div>
        </ContentArea>
    );
};

export default MotivazioneSection;
