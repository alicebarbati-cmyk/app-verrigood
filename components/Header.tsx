
import React, { useState, useEffect } from 'react';

const allQuotes = [
    "Il successo non è definitivo, il fallimento non è fatale: ciò che conta è il coraggio di continuare. - Winston Churchill",
    "Credi in te stesso e in tutto ciò che sei. Sappi che c'è qualcosa dentro di te che è più grande di qualsiasi ostacolo. - Christian D. Larson",
    "Non aspettare. Il tempo non sarà mai giusto. - Napoleon Hill",
    "L'unico modo per fare un ottimo lavoro è amare quello che fai. - Steve Jobs",
    "La differenza tra ordinario e straordinario è quel piccolo extra. - Jimmy Johnson",
    "La tua educazione è un abito che nessuno può toglierti. - B.B. King",
    "Non ho fallito. Ho solo trovato 10.000 modi che non funzionano. - Thomas A. Edison",
    "Il futuro appartiene a coloro che credono nella bellezza dei propri sogni. - Eleanor Roosevelt",
    "Studia non per sapere di più, ma per sapere meglio. - Seneca",
    "Ogni risultato inizia con la decisione di provare.",
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

const Header: React.FC = () => {
    const [currentQuote, setCurrentQuote] = useState('');

    const generateNewQuote = () => {
        const randomIndex = Math.floor(Math.random() * allQuotes.length);
        setCurrentQuote(allQuotes[randomIndex]);
    };

    useEffect(() => {
        generateNewQuote();
    }, []);

    return (
        <header className="text-center bg-white/95 p-8 rounded-3xl mb-8 shadow-xl">
            <div className="w-20 h-20 mx-auto mb-5 bg-blue-500 rounded-full flex items-center justify-center text-4xl shadow-lg">
                🏫
            </div>
            <h1 className="text-4xl font-extrabold text-slate-800 mb-2">
                Verrigood
            </h1>
            <p className="text-lg text-slate-600 mb-6">
                Verrigood: un'unica app, infinite possibilità
            </p>

            <div className="bg-indigo-50/80 p-5 rounded-2xl border-l-4 border-indigo-500 max-w-2xl mx-auto shadow-sm animate-fade-in">
                <p className="italic text-slate-700 text-sm md:text-base mb-3 leading-relaxed">
                    "{currentQuote}"
                </p>
                <button 
                    onClick={generateNewQuote}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-widest transition-colors flex items-center justify-center mx-auto"
                >
                    <span className="mr-1">✨</span> Nuova Frase
                </button>
            </div>
        </header>
    );
};

export default Header;
