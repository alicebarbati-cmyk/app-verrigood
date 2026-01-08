
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ContentArea from '../ContentArea';
import type { RoutineSlot } from '../../types';
import { generateRoutine } from '../../services/geminiService';

interface OrganizzazioneSectionProps {
    onBack: () => void;
}

// --- SUB-COMPONENT: ROUTINE TOOL ---
const RoutineTool: React.FC = () => {
    const [startTime, setStartTime] = useState('15:00');
    const [endTime, setEndTime] = useState('19:00');
    const [tasks, setTasks] = useState('Compiti di matematica, ripassare storia, studiare inglese');
    const [commitments, setCommitments] = useState('16:00-17:00 allenamento calcio');
    const [routine, setRoutine] = useState<RoutineSlot[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateRoutine = async () => {
        if (!startTime || !endTime || !tasks) {
            setError('Per favore, compila orario di inizio, fine e le attività.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setRoutine(null);
        try {
            const result = await generateRoutine(startTime, endTime, tasks, commitments);
            setRoutine(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const getSlotColor = (type: RoutineSlot['type']) => {
        switch (type) {
            case 'study': return 'bg-blue-100 border-blue-500';
            case 'break': return 'bg-green-100 border-green-500';
            case 'commitment': return 'bg-yellow-100 border-yellow-500';
            default: return 'bg-slate-100 border-slate-500';
        }
    }

    return (
        <div className="bg-green-50/50 p-6 rounded-2xl animate-fade-in">
            <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center">
                <span className="mr-2">📅</span> Routine di Studio AI
            </h3>
            <p className="mb-6 text-slate-600">Pianifica la tua giornata di studio in modo efficace con l'aiuto dell'AI.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                 <div>
                    <label className="block font-semibold mb-1 text-sm">Inizio studio</label>
                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="p-2 border border-slate-300 rounded-md w-full" />
                </div>
                 <div>
                    <label className="block font-semibold mb-1 text-sm">Fine studio</label>
                    <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="p-2 border border-slate-300 rounded-md w-full" />
                </div>
            </div>
            <div className="mb-4">
                 <label className="block font-semibold mb-1 text-sm">Cosa devi fare oggi?</label>
                 <textarea value={tasks} onChange={(e) => setTasks(e.target.value)} className="p-2 border border-slate-300 rounded-md w-full h-20 text-sm" placeholder="Es: matematica, storia..."></textarea>
            </div>
             <div className="mb-4">
                 <label className="block font-semibold mb-1 text-sm">Impegni fissati (opzionale)</label>
                 <textarea value={commitments} onChange={(e) => setCommitments(e.target.value)} className="p-2 border border-slate-300 rounded-md w-full h-16 text-sm" placeholder="Es: 16:00-17:00 calcio..."></textarea>
            </div>

            <button onClick={handleGenerateRoutine} disabled={isLoading} className="bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-transform duration-200 hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed w-full shadow-lg">
                {isLoading ? 'Creazione in corso...' : 'Genera Piano di Studio'}
            </button>

            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            
            {routine && (
                <div className="mt-8 animate-fade-in">
                    <h4 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">📋 La Tua Giornata</h4>
                    <div className="space-y-3">
                        {routine.map((slot, index) => (
                            <div key={index} className={`p-4 rounded-xl border-l-4 shadow-sm transition-all hover:shadow-md ${getSlotColor(slot.type)}`}>
                                <div className="flex justify-between items-start">
                                    <span className="font-bold text-slate-700">{slot.start} - {slot.end}</span>
                                    <span className="text-xs uppercase font-bold tracking-tighter opacity-60">{slot.type}</span>
                                </div>
                                <p className="text-slate-600 mt-1">{slot.activity}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- SUB-COMPONENT: TIMER TOOL ---
const TimerTool: React.FC = () => {
    const [totalDuration, setTotalDuration] = useState('45');
    const [breakCount, setBreakCount] = useState('1');
    const [breakDuration, setBreakDuration] = useState('5');
    
    const [sessions, setSessions] = useState<{ type: 'work' | 'break'; duration: number; originalDuration: number; }[]>([]);
    const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const intervalRef = useRef<number | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    const playSound = useCallback(() => {
        if (!audioContextRef.current) {
            try {
                 audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            } catch (e) {
                return;
            }
        }
        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContextRef.current.currentTime);
        gainNode.gain.setValueAtTime(0.5, audioContextRef.current.currentTime);
        oscillator.start();
        oscillator.stop(audioContextRef.current.currentTime + 0.5);
    }, []);

    useEffect(() => {
        if (isActive && !isPaused) {
            intervalRef.current = window.setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isActive, isPaused]);

    useEffect(() => {
        if (timeLeft <= 0 && isActive) {
            playSound();
            if (currentSessionIndex < sessions.length - 1) {
                const nextIndex = currentSessionIndex + 1;
                setCurrentSessionIndex(nextIndex);
                setTimeLeft(sessions[nextIndex].duration);
            } else {
                setIsActive(false);
                setIsPaused(true);
            }
        }
    }, [timeLeft, isActive, currentSessionIndex, sessions, playSound]);

    const handleStart = () => {
        setError(null);
        const totalMins = parseInt(totalDuration, 10);
        const breaks = parseInt(breakCount, 10);
        const breakMins = parseInt(breakDuration, 10);

        if (isNaN(totalMins) || totalMins <= 0) {
            setError('Inserisci una durata valida.');
            return;
        }

        const workSessionsCount = breaks + 1;
        const totalBreakTime = breaks * breakMins;
        const totalWorkMins = totalMins - totalBreakTime;
        
        if (totalWorkMins <= 0) {
            setError('Il tempo delle pause supera il tempo totale!');
            return;
        }

        const workSessionSeconds = Math.floor((totalWorkMins / workSessionsCount) * 60);
        const breakSessionSeconds = breakMins * 60;

        const newSessions: { type: 'work' | 'break'; duration: number; originalDuration: number; }[] = [];
        for (let i = 0; i < workSessionsCount; i++) {
            newSessions.push({ type: 'work', duration: workSessionSeconds, originalDuration: workSessionSeconds });
            if (i < breaks) {
                newSessions.push({ type: 'break', duration: breakSessionSeconds, originalDuration: breakSessionSeconds });
            }
        }
        
        setSessions(newSessions);
        setCurrentSessionIndex(0);
        setTimeLeft(newSessions[0].duration);
        setIsActive(true);
        setIsPaused(false);
    };

    const handlePauseResume = () => {
        setIsPaused(!isPaused);
        if (audioContextRef.current?.state === 'suspended') audioContextRef.current.resume();
    };

    const handleReset = () => {
        setIsActive(false);
        setIsPaused(true);
        setSessions([]);
        setTimeLeft(0);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const currentSession = sessions[currentSessionIndex];
    const progress = currentSession ? ((currentSession.originalDuration - timeLeft) / currentSession.originalDuration) * 100 : 0;

    return (
        <div className="bg-slate-50 p-6 rounded-2xl animate-fade-in">
            <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center">
                <span className="mr-2">⏱️</span> Timer di Studio
            </h3>
            
            {!isActive ? (
                <div className="space-y-4">
                    <p className="text-slate-600 mb-4">Ottimizza la concentrazione con cicli di studio e pause.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block font-semibold mb-1 text-xs uppercase">Totale (min)</label>
                            <input type="number" value={totalDuration} onChange={e => setTotalDuration(e.target.value)} className="p-2 border border-slate-300 rounded-md w-full" />
                        </div>
                        <div>
                            <label className="block font-semibold mb-1 text-xs uppercase">N. Pause</label>
                            <input type="number" value={breakCount} onChange={e => setBreakCount(e.target.value)} className="p-2 border border-slate-300 rounded-md w-full" />
                        </div>
                        <div>
                            <label className="block font-semibold mb-1 text-xs uppercase">Pausa (min)</label>
                            <input type="number" value={breakDuration} onChange={e => setBreakDuration(e.target.value)} className="p-2 border border-slate-300 rounded-md w-full" />
                        </div>
                    </div>
                    <button onClick={handleStart} className="bg-blue-600 text-white font-bold py-3 px-6 rounded-full w-full transition-all hover:bg-blue-700 shadow-md">
                        Avvia Sessione
                    </button>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                </div>
            ) : (
                <div className="text-center">
                    <h4 className={`text-xl font-bold mb-4 ${currentSession.type === 'work' ? 'text-blue-600' : 'text-green-600'}`}>
                        {currentSession.type === 'work' ? '📖 Studio' : '☕ Pausa'} 
                        <span className="text-sm font-normal text-slate-400 ml-2">
                            ({Math.floor(currentSessionIndex / 2) + 1}/{Math.ceil(sessions.length / 2)})
                        </span>
                    </h4>
                    
                    <div className="relative w-40 h-40 mx-auto mb-6">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle className="text-slate-200" strokeWidth="6" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                            <circle 
                                className={currentSession.type === 'work' ? 'text-blue-500' : 'text-green-500'}
                                strokeWidth="6" strokeDasharray="283" strokeDashoffset={283 - (progress / 100) * 283}
                                strokeLinecap="round" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50"
                                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s linear' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-4xl font-mono font-bold text-slate-800">{formatTime(timeLeft)}</span>
                        </div>
                    </div>

                    <div className="flex justify-center gap-3">
                        <button onClick={handlePauseResume} className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-full text-sm">
                            {isPaused ? 'Riprendi' : 'Pausa'}
                        </button>
                        <button onClick={handleReset} className="bg-red-500 text-white font-bold py-2 px-6 rounded-full text-sm">
                            Interrompi
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- MAIN CONTAINER ---
const OrganizzazioneSection: React.FC<OrganizzazioneSectionProps> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<'routine' | 'timer'>('routine');

    return (
        <ContentArea title="Gestione Tempo" onBack={onBack}>
            <div className="flex justify-center mb-8">
                <div className="bg-slate-100 p-1 rounded-full flex shadow-inner">
                    <button 
                        onClick={() => setActiveTab('routine')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'routine' ? 'bg-white text-green-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Routine AI
                    </button>
                    <button 
                        onClick={() => setActiveTab('timer')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'timer' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Timer Studio
                    </button>
                </div>
            </div>

            {activeTab === 'routine' ? <RoutineTool /> : <TimerTool />}
        </ContentArea>
    );
};

export default OrganizzazioneSection;
