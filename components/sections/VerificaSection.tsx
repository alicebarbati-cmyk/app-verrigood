
import React, { useState } from 'react';
import ContentArea from '../ContentArea';
import type { QuizQuestion } from '../../types';
import { generateQuiz, generateTestQuestions } from '../../services/geminiService';

interface VerificaSectionProps {
    onBack: () => void;
}

const VerificaSection: React.FC<VerificaSectionProps> = ({ onBack }) => {
    const [mode, setMode] = useState<'selection' | 'quiz' | 'generator'>('selection');

    // Shared state
    const [topic, setTopic] = useState('');
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Customization state
    const [numQuestions, setNumQuestions] = useState(5);
    const [questionType, setQuestionType] = useState<'multiple' | 'open' | 'mixed'>('mixed');
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    
    // Quiz mode state
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [userAnswers, setUserAnswers] = useState<(number | string | null)[]>([]);
    const [quizGameState, setQuizGameState] = useState<'playing' | 'finished'>('playing');
    
    // Generator mode state
    const [copySuccess, setCopySuccess] = useState('');

    const resetState = () => {
        setTopic('');
        setQuestions([]);
        setIsLoading(false);
        setError(null);
        setCurrentQuestionIdx(0);
        setUserAnswers([]);
        setQuizGameState('playing');
        setCopySuccess('');
        setNumQuestions(5);
        setQuestionType('mixed');
        setDifficulty('medium');
    };
    
    const handleBackToSelection = () => {
        resetState();
        setMode('selection');
    };

    // --- QUIZ LOGIC ---
    const handleGenerateQuiz = async () => {
        if (!topic) {
            setError('Per favore, inserisci un argomento.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const quiz = await generateQuiz(topic, numQuestions, questionType, difficulty);
            if(quiz.length === 0) {
                 setError('Nessun quiz generato. Prova un argomento diverso.');
            } else {
                setQuestions(quiz);
                setUserAnswers(Array(quiz.length).fill(null));
                setCurrentQuestionIdx(0);
                setQuizGameState('playing');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswer = (answer: number | string) => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIdx] = answer;
        setUserAnswers(newAnswers);
    };
    
    const nextQuestion = () => {
        if (currentQuestionIdx < questions.length - 1) {
            setCurrentQuestionIdx(currentQuestionIdx + 1);
        } else {
            setQuizGameState('finished');
        }
    };

    const calculateScore = () => {
        let score = 0;
        questions.forEach((q, i) => {
            if (q.type === 'multiple' && q.correct !== undefined && userAnswers[i] === q.correct) {
                score++;
            }
        });
        return score;
    };

    // --- GENERATOR LOGIC ---
    const handleGenerateTest = async () => {
        if (!topic) {
            setError('Per favore, inserisci un argomento.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setCopySuccess('');
        try {
            const testQuestions = await generateTestQuestions(topic, numQuestions, questionType, difficulty);
            if(testQuestions.length === 0) {
                 setError('Nessuna domanda generata. Prova un argomento diverso.');
            } else {
                setQuestions(testQuestions);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const formatQuestionsForCopy = (): string => {
        let text = `VERIFICA SU: ${topic.toUpperCase()}\n\n`;
        text += `Difficoltà: ${difficulty}\n`;
        text += `Tipologia: ${questionType}\n`;
        text += "------------------------------------\n\n";
        
        questions.forEach((q, i) => {
            text += `DOMANDA ${i + 1}: ${q.question}\n`;
            if (q.type === 'multiple' && q.options) {
                q.options.forEach((opt, idx) => {
                    text += `  ${String.fromCharCode(65 + idx)}) ${opt}\n`;
                });
                text += `\nRISPOSTA CORRETTA: ${String.fromCharCode(65 + q.correct!)}\n`;
            } else if (q.answer) {
                 text += `\nRISPOSTA SUGGERITA: ${q.answer}\n`;
            }
            text += "\n------------------------------------\n\n";
        });
        return text;
    };

    const handleCopy = () => {
        const textToCopy = formatQuestionsForCopy();
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopySuccess('Copiato negli appunti!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Errore nella copia.');
        });
    };
    

    // --- RENDER FUNCTIONS ---
    
    const renderSelection = () => (
        <div className="bg-blue-50 p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Scegli la modalità</h3>
            <p className="mb-6 text-slate-600">Vuoi metterti alla prova o preparare materiale per una classe?</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div onClick={() => { setMode('quiz'); setNumQuestions(5); }} className="bg-white p-6 rounded-xl shadow-md cursor-pointer transition-transform hover:scale-105 border-2 border-transparent hover:border-blue-500">
                    <h4 className="font-bold text-lg mb-2 text-slate-800">🎯 Svolgi un Quiz</h4>
                    <p className="text-sm text-slate-600">Fai un quiz interattivo su un argomento a tua scelta con valutazione automatica.</p>
                </div>
                <div onClick={() => { setMode('generator'); setNumQuestions(10); }} className="bg-white p-6 rounded-xl shadow-md cursor-pointer transition-transform hover:scale-105 border-2 border-transparent hover:border-green-500">
                    <h4 className="font-bold text-lg mb-2 text-slate-800">📋 Crea una Verifica</h4>
                    <p className="text-sm text-slate-600">Genera domande per una verifica da sottoporre agli alunni, pronte da copiare.</p>
                </div>
            </div>
        </div>
    );

    const renderSetupOptions = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
                <label className="block font-semibold mb-1 text-sm">N. di Domande</label>
                <input type="number" value={numQuestions} onChange={(e) => setNumQuestions(Math.max(1, parseInt(e.target.value) || 1))} className="p-2 border border-slate-300 rounded-md w-full" min="1" max="20" />
            </div>
            <div>
                <label className="block font-semibold mb-1 text-sm">Tipologia</label>
                <select value={questionType} onChange={(e) => setQuestionType(e.target.value as any)} className="p-2 border border-slate-300 rounded-md w-full bg-white">
                    <option value="mixed">Miste</option>
                    <option value="multiple">Risposta Multipla</option>
                    <option value="open">Domande Aperte</option>
                </select>
            </div>
             <div>
                <label className="block font-semibold mb-1 text-sm">Difficoltà</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)} className="p-2 border border-slate-300 rounded-md w-full bg-white">
                    <option value="easy">Facile</option>
                    <option value="medium">Media</option>
                    <option value="hard">Difficile</option>
                </select>
            </div>
        </div>
    );


    const renderQuiz = () => {
        if (questions.length === 0) { // Setup screen for quiz
            return (
                <div className="bg-blue-50 p-6 rounded-2xl">
                    <button onClick={handleBackToSelection} className="text-sm text-blue-600 mb-4 hover:underline">‹ Torna alla selezione</button>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">Imposta il tuo Quiz</h3>
                    <div className="mb-4">
                        <label className="block font-semibold mb-1">Su quale argomento vuoi fare il quiz?</label>
                        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Es: Seconda Guerra Mondiale..." className="p-3 border border-slate-300 rounded-md w-full" />
                    </div>
                    {renderSetupOptions()}
                    <button onClick={handleGenerateQuiz} disabled={isLoading} className="bg-blue-500 text-white font-bold py-3 px-6 rounded-full transition-transform duration-200 hover:scale-105 w-full disabled:bg-slate-400">
                        {isLoading ? 'Generazione Quiz...' : 'Inizia Quiz'}
                    </button>
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                </div>
            );
        }

        if (quizGameState === 'finished') {
            const score = calculateScore();
            const multipleChoiceQuestions = questions.filter(q => q.type === 'multiple').length;
            return (
                <div className="text-center bg-blue-50 p-6 rounded-2xl">
                    <h4 className="text-2xl font-bold mb-4">📊 Risultati della Verifica</h4>
                    {multipleChoiceQuestions > 0 && 
                        <p className="text-3xl font-bold mb-4">Hai risposto correttamente a {score} su {multipleChoiceQuestions} domande a scelta multipla.</p>
                    }
                    <div className="text-left space-y-4 max-h-96 overflow-y-auto p-4 bg-slate-100 rounded-lg my-4">
                        {questions.map((q, i) => (
                            <div key={i} className={`p-3 bg-white rounded-lg shadow-sm border-l-4 ${q.type === 'multiple' && userAnswers[i] === q.correct ? 'border-green-500' : 'border-red-400'}`}>
                                <p className="font-bold">{i + 1}. {q.question}</p>
                                <p className="text-sm text-blue-700">La tua risposta: {q.type === 'multiple' ? q.options?.[userAnswers[i] as number] ?? 'Non data' : userAnswers[i] ?? 'Non data'}</p>
                                {q.type === 'multiple' && q.correct !== undefined && <p className="text-sm text-green-700 font-semibold">Risposta corretta: {q.options?.[q.correct]}</p>}
                                {(q.type === 'open' || q.type === 'definition') && <p className="text-sm text-green-700 font-semibold">Risposta suggerita: {q.answer}</p>}
                            </div>
                        ))}
                    </div>
                    <button onClick={handleBackToSelection} className="mt-6 bg-blue-500 text-white font-bold py-3 px-6 rounded-full transition-transform duration-200 hover:scale-105">
                        Fai un'altra verifica
                    </button>
                </div>
            );
        }

        const q = questions[currentQuestionIdx];
        return (
            <div className="bg-blue-50 p-6 rounded-2xl">
                <p className="text-center font-semibold mb-4">Domanda {currentQuestionIdx + 1} di {questions.length}</p>
                <div className="bg-white p-6 rounded-xl shadow-md mb-4">
                    <p className="text-lg font-bold mb-4">{q.question}</p>
                    {q.type === 'multiple' && q.options && (
                        <div className="space-y-2">
                            {q.options.map((option, index) => (
                                <button key={index} onClick={() => handleAnswer(index)} className={`block w-full text-left p-3 rounded-lg border-2 ${userAnswers[currentQuestionIdx] === index ? 'bg-blue-200 border-blue-500' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'}`}>
                                    {option}
                                </button>
                            ))}
                        </div>
                    )}
                    {(q.type === 'open' || q.type === 'definition') && (
                        <textarea value={(userAnswers[currentQuestionIdx] as string) || ''} onChange={(e) => handleAnswer(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md h-24" placeholder="Scrivi la tua risposta..." />
                    )}
                </div>
                <button onClick={nextQuestion} className="mt-4 bg-green-500 text-white font-bold py-3 px-6 rounded-full w-full transition-transform duration-200 hover:scale-105">
                    {currentQuestionIdx < questions.length - 1 ? 'Prossima Domanda' : 'Termina Verifica'}
                </button>
            </div>
        );
    };

    const renderGenerator = () => (
        <div className="bg-green-50 p-6 rounded-2xl">
             <button onClick={handleBackToSelection} className="text-sm text-green-600 mb-4 hover:underline">‹ Torna alla selezione</button>
             <h3 className="text-xl font-bold text-slate-800 mb-3">Crea una Verifica</h3>
             {!questions.length ? (
                <>
                    <div className="mb-4">
                        <label className="block font-semibold mb-1">Su quale argomento vuoi creare la verifica?</label>
                        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Es: Dante Alighieri..." className="p-3 border border-slate-300 rounded-md w-full" />
                    </div>
                    {renderSetupOptions()}
                    <button onClick={handleGenerateTest} disabled={isLoading} className="bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-transform duration-200 hover:scale-105 w-full disabled:bg-slate-400">
                        {isLoading ? 'Generazione in corso...' : 'Crea Verifica'}
                    </button>
                </>
             ) : (
                <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">Verifica Generata su: {topic}</h4>
                    <div className="space-x-2 mb-4">
                        <button onClick={handleCopy} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-full text-sm">
                            {copySuccess ? copySuccess : '📋 Copia Testo'}
                        </button>
                         <button onClick={() => { setQuestions([]); setTopic(''); }} className="bg-slate-500 text-white font-semibold py-2 px-4 rounded-full text-sm">
                            Crea un'altra
                        </button>
                    </div>
                    <div className="text-left space-y-4 max-h-96 overflow-y-auto p-4 bg-slate-100 rounded-lg">
                        {questions.map((q, i) => (
                            <div key={i} className="p-3 bg-white rounded-lg shadow-sm">
                                <p className="font-bold">{i + 1}. {q.question}</p>
                                {q.type === 'multiple' && q.options && <ul className="list-disc pl-5 mt-1 text-sm">{q.options.map(opt => <li key={opt}>{opt}</li>)}</ul>}
                                <p className="text-sm text-green-700 font-semibold mt-2">Risposta: {q.type === 'multiple' && q.correct !== undefined ? q.options?.[q.correct] : q.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
             )}
             {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
    
    const renderContent = () => {
        switch(mode) {
            case 'quiz': return renderQuiz();
            case 'generator': return renderGenerator();
            default: return renderSelection();
        }
    };

    return (
        <ContentArea title="Verifiche" onBack={onBack}>
            {renderContent()}
        </ContentArea>
    );
};

export default VerificaSection;
