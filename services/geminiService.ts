
import { GoogleGenAI, Type } from "@google/genai";
import type { Flashcard, QuizQuestion, RoutineSlot, LessonPlan, InterdisciplinaryConnection } from '../types';

// Inizializzazione corretta come da linee guida
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFlashcards = async (topic: string): Promise<Flashcard[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Generate 5 flashcards for the topic: "${topic}". Focus on key concepts.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: {
                                type: Type.STRING,
                                description: "The question for the front of the flashcard."
                            },
                            answer: {
                                type: Type.STRING,
                                description: "The answer for the back of the flashcard."
                            }
                        },
                        required: ["question", "answer"]
                    }
                }
            }
        });
        const jsonText = response.text?.trim() || "[]";
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating flashcards:", error);
        throw new Error("Failed to generate flashcards. Please try again.");
    }
};

export const generateQuiz = async (topic: string, numQuestions: number, questionType: string, difficulty: string): Promise<QuizQuestion[]> => {
    const typeInstruction = {
        'multiple': 'solo domande a risposta multipla con 4 opzioni ciascuna',
        'open': 'solo domande a risposta aperta',
        'mixed': 'un mix di domande a risposta multipla (con 4 opzioni) e domande a risposta aperta'
    }[questionType as 'multiple' | 'open' | 'mixed'];

    const difficultyIta = {
        'easy': 'facile',
        'medium': 'medio',
        'hard': 'difficile'
    }[difficulty as 'easy' | 'medium' | 'hard'];

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Genera un quiz di ${numQuestions} domande in italiano per uno studente di scuola superiore sull'argomento: "${topic}". Il livello di difficoltà deve essere ${difficultyIta}. Il quiz deve contenere ${typeInstruction}.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            type: { type: Type.STRING, description: "Can be 'multiple' or 'open'."},
                            options: { 
                                type: Type.ARRAY, 
                                items: { type: Type.STRING },
                                description: "Array of 4 options for multiple choice questions."
                            },
                            correct: { 
                                type: Type.INTEGER,
                                description: "The 0-based index of the correct option for multiple choice questions."
                            },
                            answer: { 
                                type: Type.STRING,
                                description: "A suggested correct answer for open-ended questions."
                            }
                        },
                         required: ["question", "type"]
                    }
                }
            }
        });
        
        const jsonText = response.text?.trim() || "[]";
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating quiz:", error);
        throw new Error("Failed to generate quiz. Please try again.");
    }
};

export const generateTestQuestions = async (topic: string, numQuestions: number, questionType: string, difficulty: string): Promise<QuizQuestion[]> => {
     const typeInstruction = {
        'multiple': 'solo domande a risposta multipla con 4 opzioni ciascuna',
        'open': 'solo domande a risposta aperta e definizioni',
        'mixed': 'un mix di domande a risposta multipla (con 4 opzioni), domande a risposta aperta e definizioni'
    }[questionType as 'multiple' | 'open' | 'mixed'];

    const difficultyIta = {
        'easy': 'facile',
        'medium': 'medio',
        'hard': 'difficile'
    }[difficulty as 'easy' | 'medium' | 'hard'];

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Genera una verifica completa di ${numQuestions} domande in italiano per una classe di scuola superiore sull'argomento: "${topic}". Il livello di difficoltà deve essere ${difficultyIta}. La verifica deve contenere ${typeInstruction}. Per le domande a scelta multipla, fornisci l'indice della risposta corretta. Per le domande aperte e le definizioni, fornisci una chiave di risposta suggerita.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            type: { type: Type.STRING, description: "Can be 'multiple', 'open', or 'definition'."},
                            options: { 
                                type: Type.ARRAY, 
                                items: { type: Type.STRING },
                                description: "Array of 4 options for multiple choice questions."
                            },
                            correct: { 
                                type: Type.INTEGER,
                                description: "The 0-based index of the correct option for multiple choice questions."
                            },
                            answer: { 
                                type: Type.STRING,
                                description: "A suggested correct answer for open-ended or definition questions."
                            }
                        },
                         required: ["question", "type"]
                    }
                }
            }
        });
        
        const jsonText = response.text?.trim() || "[]";
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating test questions:", error);
        throw new Error("Failed to generate test questions. Please try again.");
    }
};

export const generateRoutine = async (startTime: string, endTime: string, tasks: string, commitments: string): Promise<RoutineSlot[]> => {
    try {
        const prompt = `
            Create a study schedule for a student.
            - Start time: ${startTime}
            - End time: ${endTime}
            - Tasks to complete: ${tasks}
            - Pre-existing commitments: ${commitments || 'None'}
            
            Plan out the study sessions for the tasks, allocating reasonable time for each. Include short breaks (10-15 minutes) between study blocks. Fit the plan around the fixed commitments.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            start: { type: Type.STRING, description: "Start time in HH:MM format." },
                            end: { type: Type.STRING, description: "End time in HH:MM format." },
                            activity: { type: Type.STRING, description: "Description of the activity." },
                            type: { type: Type.STRING, description: "Type of activity: 'study', 'break', or 'commitment'."}
                        },
                        required: ["start", "end", "activity", "type"]
                    }
                }
            }
        });

        const jsonText = response.text?.trim() || "[]";
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating routine:", error);
        throw new Error("Failed to generate routine. Please try again.");
    }
}

export const generateLessonPlan = async (topic: string, duration: number, difficulty: string): Promise<LessonPlan> => {
    const difficultyMap = {
        'easy': 'per principianti',
        'medium': 'di livello intermedio',
        'hard': 'per esperti/avanzato'
    };
    const difficultyIta = difficultyMap[difficulty as keyof typeof difficultyMap];

    try {
        const prompt = `
            Crea un piano di lezione dettagliato per una classe di scuola superiore sull'argomento: "${topic}".
            - Durata totale della lezione: ${duration} minuti.
            - Livello di difficoltà: ${difficultyIta}.
            
            La lezione deve essere strutturata con un obiettivo chiaro, materiali necessari, diverse sezioni (introduzione, attività principali, conclusione) con durate specifiche che sommate diano la durata totale, e una valutazione finale.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 2000 },
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "Titolo della lezione." },
                        objective: { type: Type.STRING, description: "Obiettivo di apprendimento principale." },
                        materials: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Elenco dei materiali necessari." },
                        sections: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING, description: "Titolo della sezione (es. Introduzione, Attività 1, Conclusione)." },
                                    content: { type: Type.STRING, description: "Descrizione dettagliata delle attività in questa sezione." },
                                    duration: { type: Type.INTEGER, description: "Durata in minuti di questa sezione." }
                                },
                                required: ["title", "content", "duration"]
                            }
                        },
                        assessment: { type: Type.STRING, description: "Metodo di valutazione o compito per casa." }
                    },
                    required: ["title", "objective", "materials", "sections", "assessment"]
                }
            }
        });

        const jsonText = response.text?.trim() || "{}";
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating lesson plan:", error);
        throw new Error("Impossibile generare il piano di lezione. Riprova.");
    }
};

export const generateInterdisciplinaryConnections = async (topic: string, subject: string): Promise<InterdisciplinaryConnection[]> => {
    try {
        const prompt = `
            Dato l'argomento "${topic}" studiato nell'ambito della materia "${subject}", genera 4-5 collegamenti interdisciplinari significativi con altre materie scolastiche di un liceo italiano (es. Storia, Filosofia, Letteratura, Arte, Scienze, Matematica, Fisica, Inglese).
            Per ogni collegamento, fornisci la materia e una breve ma chiara spiegazione del nesso.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 2000 },
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            subject: { type: Type.STRING, description: "La materia del collegamento (es. 'Storia dell'Arte')." },
                            connection: { type: Type.STRING, description: "La spiegazione del collegamento interdisciplinare." }
                        },
                        required: ["subject", "connection"]
                    }
                }
            }
        });

        const jsonText = response.text?.trim() || "[]";
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating interdisciplinary connections:", error);
        throw new Error("Impossibile generare i collegamenti. Riprova.");
    }
};

const REGULATION_TEXT = `
IISS “PIETRO VERRI” 
TECNICO ECONOMICO E LICEO LINGUISTICO 
Via Lattanzio 38, Milano MIIS081008 internet: www.verri.edu.it 
REGOLAMENTO di ISTITUTO 
Approvato l’8 settembre 2025 
[... Testo completo del regolamento ...]
`;

export const answerRegulationQuestion = async (question: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: question,
            config: {
                thinkingConfig: { thinkingBudget: 2000 },
                systemInstruction: `Sei un assistente esperto del regolamento d'istituto dell'IISS "Pietro Verri". Rispondi alla domanda dell'utente basandoti ESCLUSIVAMENTE sul testo del regolamento fornito. Se la risposta non è presente nel testo, dichiara in modo chiaro che l'informazione non è disponibile nel documento. Non inventare informazioni. Sii preciso e cita gli articoli o i titoli se pertinenti. Ecco il testo del regolamento:\n\n${REGULATION_TEXT}`
            }
        });
        return response.text || "Nessuna risposta disponibile.";
    } catch (error) {
        console.error("Error answering regulation question:", error);
        throw new Error("Failed to get an answer. Please try again.");
    }
};
