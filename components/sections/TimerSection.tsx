
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ContentArea from '../ContentArea';

const TimerSection: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    // Setup state
    const [totalDuration, setTotalDuration] = useState('45');
    const [breakCount, setBreakCount] = useState('1');
    const [breakDuration, setBreakDuration] = useState('5');
    
    // Timer state
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
                console.error("Web Audio API is not supported in this browser");
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

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
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

        if (isNaN(totalMins) || isNaN(breaks) || isNaN(breakMins) || totalMins <= 0 || breaks < 0 || breakMins <= 0) {
            setError('Inserisci valori validi e positivi.');
            return;
        }

        const totalBreakTime = breaks * breakMins;
        if (totalBreakTime >= totalMins) {
            setError('Il tempo totale deve essere maggiore del tempo totale delle pause.');
            return;
        }

        const workSessionsCount = breaks + 1;
        const totalWorkMins = totalMins - totalBreakTime;
        const workSessionMins = totalWorkMins / workSessionsCount;
        
        const workSessionSeconds = Math.floor(workSessionMins * 60);
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
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
    };

    const handleReset = () => {
        setIsActive(false);
        setIsPaused(true);
        setSessions([]);
        setCurrentSessionIndex(0);
        setTimeLeft(0);
        setTotalDuration('45');
        setBreakCount('1');
        setBreakDuration('5');
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const currentSession = sessions[currentSessionIndex];
    const progress = currentSession ? ((currentSession.originalDuration - timeLeft) / currentSession.originalDuration) * 100 : 0;
    
    const renderSetup = () => (
        <div className="bg-slate-100 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-slate-800 mb-3">Imposta il tuo Timer</h3>
            <p className="mb-4 text-slate-600">Organizza le tue sessioni di studio o lavoro con pause programmate.</p>
            
            <div className="space-y-4 mb-6">
                <div>
                    <label className="block font-semibold mb-1">Tempo totale (minuti)</label>
                    <input type="number" value={totalDuration} onChange={e => setTotalDuration(e.target.value)} className="p-2 border border-slate-300 rounded-md w-full" min="1" />
                </div>
                 <div>
                    <label className="block font-semibold mb-1">Quante pause?</label>
                    <input type="number" value={breakCount} onChange={e => setBreakCount(e.target.value)} className="p-2 border border-slate-300 rounded-md w-full" min="0" />
                </div>
                 <div>
                    <label className="block font-semibold mb-1">Durata di ogni pausa (minuti)</label>
                    <input type="number" value={breakDuration} onChange={e => setBreakDuration(e.target.value)} className="p-2 border border-slate-300 rounded-md w-full" min="1" />
                </div>
            </div>

            <button onClick={handleStart} className="bg-green-500 text-white font-bold py-3 px-6 rounded-full w-full transition-transform duration-200 hover:scale-105">
                Avvia Timer
            </button>
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>
    );
    
    const renderTimer = () => {
        if (!currentSession) return renderFinished();
        
        const isWork = currentSession.type === 'work';
        const sessionName = isWork ? 'Sessione di Studio' : 'Pausa';
        const workSessionNumber = Math.floor(currentSessionIndex / 2) + 1;
        const totalWorkSessions = Math.ceil(sessions.length / 2);
        
        return (
            <div className="bg-slate-100 p-6 rounded-xl text-center">
                 <h3 className={`text-2xl font-bold ${isWork ? 'text-blue-600' : 'text-green-600'}`}>
                    {sessionName} {isWork && `(${workSessionNumber}/${totalWorkSessions})`}
                </h3>
                <div className="my-8">
                    <div className="relative w-48 h-48 mx-auto">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle className="text-slate-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                            <circle 
                                className={isWork ? 'text-blue-500' : 'text-green-500'}
                                strokeWidth="8" 
                                strokeDasharray="283"
                                strokeDashoffset={283 - (progress / 100) * 283}
                                strokeLinecap="round"
                                stroke="currentColor" 
                                fill="transparent" 
                                r="45" cx="50" cy="50"
                                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                            />
                        </svg>
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                            <span className="text-5xl font-mono font-bold text-slate-800">{formatTime(timeLeft)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-4">
                    <button onClick={handlePauseResume} className="bg-yellow-500 text-white font-bold py-3 px-8 rounded-full transition-transform duration-200 hover:scale-105">
                        {isPaused ? 'Riprendi' : 'Pausa'}
                    </button>
                    <button onClick={handleReset} className="bg-red-500 text-white font-bold py-3 px-8 rounded-full transition-transform duration-200 hover:scale-105">
                        Resetta
                    </button>
                </div>
            </div>
        );
    }
    
    const renderFinished = () => (
        <div className="bg-slate-100 p-6 rounded-xl text-center">
             <h3 className="text-2xl font-bold text-green-600 mb-4">🎉 Sessione Completata!</h3>
             <p className="mb-6 text-slate-700">Ottimo lavoro! Hai completato tutte le tue sessioni.</p>
             <button onClick={handleReset} className="bg-blue-500 text-white font-bold py-3 px-6 rounded-full transition-transform duration-200 hover:scale-105">
                Imposta un nuovo timer
            </button>
        </div>
    );

    return (
        <ContentArea title="Timer di Studio" onBack={onBack}>
            {!isActive ? renderSetup() : renderTimer()}
        </ContentArea>
    );
};

export default TimerSection;
