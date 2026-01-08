
import React, { useState } from 'react';
import ContentArea from '../ContentArea';
import { generateLessonPlan, generateInterdisciplinaryConnections } from '../../services/geminiService';
import type { LessonPlan, InterdisciplinaryConnection } from '../../types';

interface StudioSectionProps {
    onBack: () => void;
}

const LessonGenerator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [duration, setDuration] = useState('45');
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    
    const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic || !duration) {
            setError('Per favore, inserisci argomento e durata.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setLessonPlan(null);

        try {
            const result = await generateLessonPlan(topic, parseInt(duration, 10), difficulty);
            setLessonPlan(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const formatLessonForDownload = (): string => {
        if (!lessonPlan) return '';
        
        let text = `PIANO DI LEZIONE\n`;
        text += `====================================\n\n`;
        text += `ARGOMENTO: ${lessonPlan.title}\n\n`;
        text += `OBIETTIVO: ${lessonPlan.objective}\n\n`;
        text += `MATERIALI:\n${lessonPlan.materials.map(m => `- ${m}`).join('\n')}\n\n`;
        text += `------------------------------------\n`;
        text += `SVOLGIMENTO DELLA LEZIONE\n`;
        text += `------------------------------------\n\n`;

        lessonPlan.sections.forEach(section => {
            text += `SEZIONE: ${section.title} (${section.duration} min)\n`;
            text += `ATTIVITÀ: ${section.content}\n\n`;
        });
        
        text += `------------------------------------\n`;
        text += `VALUTAZIONE / COMPITI\n`;
        text += `------------------------------------\n\n`;
        text += `${lessonPlan.assessment}\n`;

        return text;
    };

    const handleDownload = () => {
        if (!lessonPlan) return;
        const text = formatLessonForDownload();
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const sanitizedTopic = topic.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        link.download = `lezione_${sanitizedTopic}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    
    const renderSetup = () => (
        <>
            <div className="mb-4">
                <label className="block font-semibold mb-1">Argomento della Lezione:</label>
                <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Es: Il ciclo dell'acqua, L'Illuminismo..."
                    className="p-3 border border-slate-300 rounded-md w-full"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block font-semibold mb-1 text-sm">Durata (minuti)</label>
                    <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="p-2 border border-slate-300 rounded-md w-full" min="10" max="120" />
                </div>
                <div>
                    <label className="block font-semibold mb-1 text-sm">Difficoltà</label>
                    <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)} className="p-2 border border-slate-300 rounded-md w-full bg-white">
                        <option value="easy">Base</option>
                        <option value="medium">Intermedia</option>
                        <option value="hard">Avanzata</option>
                    </select>
                </div>
            </div>
            <button onClick={handleGenerate} disabled={isLoading} className="bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-transform duration-200 hover:scale-105 w-full disabled:bg-slate-400">
                {isLoading ? 'Creazione lezione in corso...' : 'Crea Lezione'}
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </>
    );

    const renderLessonPlan = () => (
        <div>
            <h4 className="text-2xl font-bold text-slate-800 mb-4">{lessonPlan.title}</h4>
            
            <div className="space-x-2 mb-6">
                <button onClick={handleDownload} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-full text-sm">
                    📥 Scarica Lezione
                </button>
                <button onClick={() => { setLessonPlan(null); setTopic(''); }} className="bg-slate-500 text-white font-semibold py-2 px-4 rounded-full text-sm">
                    Crea un'altra
                </button>
            </div>

            <div className="space-y-4 text-left">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h5 className="font-bold">🎯 Obiettivo</h5>
                    <p>{lessonPlan.objective}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h5 className="font-bold">🛠️ Materiali</h5>
                    <ul className="list-disc pl-5">{lessonPlan.materials.map((m, i) => <li key={i}>{m}</li>)}</ul>
                </div>
                {lessonPlan.sections.map((section, i) => (
                    <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                        <h5 className="font-bold flex justify-between">
                            <span>{section.title}</span>
                            <span className="font-normal text-slate-500">{section.duration} min</span>
                        </h5>
                        <p className="whitespace-pre-wrap">{section.content}</p>
                    </div>
                ))}
                 <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h5 className="font-bold">📝 Valutazione / Compiti</h5>
                    <p>{lessonPlan.assessment}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-green-50 p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-3">👨‍🏫 Generatore di Lezioni per Docenti</h3>
            <p className="mb-4 text-slate-600">Risparmia tempo sulla pianificazione! Inserisci un argomento e l'AI creerà una traccia di lezione strutturata.</p>
            {lessonPlan ? renderLessonPlan() : renderSetup()}
        </div>
    );
};

const InterdisciplinaryConnectionsGenerator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [startingSubject, setStartingSubject] = useState('');
    const [connections, setConnections] = useState<InterdisciplinaryConnection[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic || !startingSubject) {
            setError('Per favore, inserisci sia l\'argomento che la materia di partenza.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setConnections(null);

        try {
            const result = await generateInterdisciplinaryConnections(topic, startingSubject);
            setConnections(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderSetup = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block font-semibold mb-1">Argomento:</label>
                    <input 
                        type="text" 
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Es: La Rivoluzione Industriale"
                        className="p-3 border border-slate-300 rounded-md w-full"
                    />
                </div>
                <div>
                    <label className="block font-semibold mb-1">Materia di partenza:</label>
                    <input 
                        type="text" 
                        value={startingSubject}
                        onChange={(e) => setStartingSubject(e.target.value)}
                        placeholder="Es: Storia"
                        className="p-3 border border-slate-300 rounded-md w-full"
                    />
                </div>
            </div>
            <button onClick={handleGenerate} disabled={isLoading} className="bg-purple-600 text-white font-bold py-3 px-6 rounded-full transition-transform duration-200 hover:scale-105 w-full disabled:bg-slate-400">
                {isLoading ? 'Ricerca in corso...' : 'Genera Collegamenti'}
            </button>
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </>
    );

    const renderConnections = () => (
        <div>
            <h4 className="text-xl font-bold text-slate-800 mb-4">Collegamenti per "{topic}"</h4>
            <button onClick={() => { setConnections(null); setTopic(''); setStartingSubject(''); }} className="bg-slate-500 text-white font-semibold py-2 px-4 rounded-full text-sm mb-6">
                Crea un altro
            </button>

            <div className="space-y-3">
                {connections.map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
                        <h5 className="font-bold text-purple-800">{item.subject}</h5>
                        <p className="text-slate-700">{item.connection}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="bg-purple-50 p-6 rounded-2xl mt-8">
            <h3 className="text-xl font-bold text-slate-800 mb-3">🔗 Generatore di Collegamenti Interdisciplinari</h3>
            <p className="mb-4 text-slate-600">Trova collegamenti tra materie diverse partendo da un argomento. Utile per tesine, esami orali o per esplorare nuove prospettive.</p>
            {connections ? renderConnections() : renderSetup()}
        </div>
    );
};

const StudioSection: React.FC<StudioSectionProps> = ({ onBack }) => {
    return (
        <ContentArea title="Lezioni" onBack={onBack}>
            <p className="mb-6">Materiali didattici, guide e risorse per supportare il tuo percorso di apprendimento e insegnamento.</p>
            <LessonGenerator />
            <InterdisciplinaryConnectionsGenerator />
        </ContentArea>
    );
};

export default StudioSection;
