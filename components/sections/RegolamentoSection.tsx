
import React, { useState } from 'react';
import ContentArea from '../ContentArea';
import { answerRegulationQuestion } from '../../services/geminiService';

interface RegolamentoSectionProps {
    onBack: () => void;
}

const RegolamentoSection: React.FC<RegolamentoSectionProps> = ({ onBack }) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAsk = async () => {
        if (!question.trim()) {
            setError('Per favore, inserisci una domanda.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnswer('');
        try {
            const result = await answerRegulationQuestion(question);
            setAnswer(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ContentArea title="Regolamento d'Istituto" onBack={onBack}>
            <div className="bg-slate-100 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-slate-800 mb-3">💬 Chiedi all'Assistente AI</h3>
                <p className="mb-4 text-slate-600">
                    Hai un dubbio sul regolamento della scuola? Scrivi la tua domanda qui sotto e l'intelligenza artificiale ti risponderà basandosi sul documento ufficiale.
                </p>

                <div className="mb-4">
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Es: Cosa succede se uso il cellulare in classe?"
                        className="p-3 border border-slate-300 rounded-md w-full h-24"
                        disabled={isLoading}
                    />
                </div>

                <button 
                    onClick={handleAsk} 
                    disabled={isLoading} 
                    className="bg-blue-600 text-white font-bold py-3 px-6 rounded-full w-full transition-transform duration-200 hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Sto cercando la risposta...' : 'Chiedi'}
                </button>

                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

                {answer && (
                    <div className="mt-6 animate-fade-in">
                        <h4 className="text-lg font-bold text-slate-800 mb-3"> Risposta:</h4>
                        <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500 whitespace-pre-wrap">
                            <p className="text-slate-700">{answer}</p>
                        </div>
                    </div>
                )}
            </div>
        </ContentArea>
    );
};

export default RegolamentoSection;
