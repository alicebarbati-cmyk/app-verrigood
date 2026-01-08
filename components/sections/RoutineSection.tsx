
import React, { useState } from 'react';
import ContentArea from '../ContentArea';
import type { RoutineSlot } from '../../types';
import { generateRoutine } from '../../services/geminiService';
import { ClockIcon } from '../icons';

interface RoutineSectionProps {
    onBack: () => void;
}

const RoutinePlanner: React.FC = () => {
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
        <div className="bg-green-50 p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-3">📅 Crea la Tua Routine di Studio con AI</h3>
            <p className="mb-4 text-slate-600">Pianifica la tua giornata di studio in modo efficace! L'AI creerà un piano ottimizzato per te.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                 <div>
                    <label className="block font-semibold mb-1">Inizio studio</label>
                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="p-2 border border-slate-300 rounded-md w-full" />
                </div>
                 <div>
                    <label className="block font-semibold mb-1">Fine studio</label>
                    <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="p-2 border border-slate-300 rounded-md w-full" />
                </div>
            </div>
            <div className="mb-4">
                 <label className="block font-semibold mb-1">Cosa devi fare oggi? (separa con virgole)</label>
                 <textarea value={tasks} onChange={(e) => setTasks(e.target.value)} className="p-2 border border-slate-300 rounded-md w-full h-20" placeholder="Es: matematica, storia, inglese..."></textarea>
            </div>
             <div className="mb-4">
                 <label className="block font-semibold mb-1">Impegni fissati (opzionale)</label>
                 <textarea value={commitments} onChange={(e) => setCommitments(e.target.value)} className="p-2 border border-slate-300 rounded-md w-full h-16" placeholder="Es: 16:00-17:00 calcio..."></textarea>
            </div>

            <button onClick={handleGenerateRoutine} disabled={isLoading} className="bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-transform duration-200 hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed w-full">
                {isLoading ? 'Creazione in corso...' : 'Crea la Mia Routine'}
            </button>

            {error && <p className="text-red-500 mt-4">{error}</p>}
            
            {routine && (
                <div className="mt-6 animate-fade-in">
                    <h4 className="text-lg font-bold text-slate-800 mb-3">📋 La Tua Routine Personalizzata</h4>
                    <div className="space-y-2">
                        {routine.map((slot, index) => (
                            <div key={index} className={`p-3 rounded-lg border-l-4 ${getSlotColor(slot.type)}`}>
                                <p className="font-bold text-slate-700">{slot.start} - {slot.end}</p>
                                <p className="text-slate-600">{slot.activity}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const RoutineSection: React.FC<RoutineSectionProps> = ({ onBack }) => {
    return (
        <ContentArea title="Routine Scolastica" onBack={onBack}>
             <p className="mb-6">Organizza la tua giornata scolastica con orari e attività programmate in modo intelligente.</p>
             <RoutinePlanner />
        </ContentArea>
    );
};

export default RoutineSection;
