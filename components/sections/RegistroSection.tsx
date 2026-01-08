import React, { useState } from 'react';
import ContentArea from '../ContentArea';

interface RegistroSectionProps {
    onBack: () => void;
}

const GradeCalculator: React.FC = () => {
    const [numGrades, setNumGrades] = useState<number>(3);
    const [grades, setGrades] = useState<string[]>(Array(3).fill(''));
    const [average, setAverage] = useState<number | null>(null);

    const handleNumGradesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const count = Math.max(1, Math.min(20, parseInt(e.target.value, 10) || 1));
        setNumGrades(count);
        setGrades(Array(count).fill(''));
        setAverage(null);
    };

    const handleGradeChange = (index: number, value: string) => {
        const newGrades = [...grades];
        newGrades[index] = value;
        setGrades(newGrades);
    };

    const calculateAverage = () => {
        const validGrades = grades
            .map(g => parseFloat(g))
            .filter(g => !isNaN(g) && g >= 1 && g <= 10);
        
        if (validGrades.length !== numGrades) {
            alert('Per favore inserisci tutti i voti (da 1 a 10)!');
            return;
        }

        const sum = validGrades.reduce((acc, grade) => acc + grade, 0);
        setAverage(sum / validGrades.length);
    };
    
    const getAverageColor = () => {
        if (average === null) return 'text-slate-800';
        if (average >= 8) return 'text-green-500';
        if (average >= 7) return 'text-yellow-500';
        if (average >= 6) return 'text-orange-500';
        return 'text-red-500';
    };

    return (
        <div className="bg-blue-50 p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-3">📊 Calcolatore Media Voti</h3>
            <p className="mb-4 text-slate-600">Calcola facilmente la tua media scolastica inserendo i tuoi voti!</p>
            
            <div className="mb-4">
                <label className="block font-semibold mb-2">Quanti voti vuoi inserire?</label>
                <input 
                    type="number"
                    value={numGrades}
                    onChange={handleNumGradesChange}
                    className="p-2 border border-slate-300 rounded-md w-24"
                    min="1"
                    max="20"
                />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {grades.map((grade, index) => (
                    <div key={index}>
                        <label className="block font-semibold mb-1 text-sm">Voto {index + 1}</label>
                        <input
                            type="number"
                            value={grade}
                            onChange={(e) => handleGradeChange(index, e.target.value)}
                            className="p-2 border border-slate-300 rounded-md w-full"
                            placeholder="es. 7.5"
                            min="1"
                            max="10"
                            step="0.25"
                        />
                    </div>
                ))}
            </div>
            
            <button onClick={calculateAverage} className="bg-blue-500 text-white font-bold py-2 px-6 rounded-full transition-transform duration-200 hover:scale-105">
                Calcola Media
            </button>

            {average !== null && (
                <div className="mt-4 bg-white p-4 rounded-lg border-l-4 border-blue-500 animate-fade-in">
                    <h4 className="text-lg font-bold">🎯 La Tua Media</h4>
                    <p className={`text-4xl font-extrabold my-2 ${getAverageColor()}`}>{average.toFixed(2)}</p>
                </div>
            )}
        </div>
    );
}

const RegistroSection: React.FC<RegistroSectionProps> = ({ onBack }) => {
    return (
        <ContentArea title="Registro Elettronico" onBack={onBack}>
            <p className="mb-6">Accedi al registro elettronico per consultare voti, assenze e comunicazioni.</p>
            
            <div className="bg-indigo-100 p-6 rounded-xl text-center mb-8">
                 <h3 className="text-xl font-bold text-slate-800 mb-3">🔗 Accesso Registro</h3>
                 <a href="https://scuoladigitale.axioscloud.it/Pages/SD/SD_Login.aspx" target="_blank" rel="noopener noreferrer" className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-full inline-block transition-transform duration-200 hover:scale-105">
                     📚 Axios | Scuola Digitale | Login
                 </a>
                 <p className="mt-3 text-slate-600 text-sm">Clicca per accedere al registro elettronico ufficiale</p>
            </div>
            
            <GradeCalculator />

        </ContentArea>
    );
};

export default RegistroSection;