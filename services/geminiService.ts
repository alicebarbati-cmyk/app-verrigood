
import { GoogleGenAI, Type } from "@google/genai";
import type { Flashcard, QuizQuestion, RoutineSlot, LessonPlan, InterdisciplinaryConnection } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFlashcards = async (topic: string): Promise<Flashcard[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
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
        const jsonText = response.text.trim();
        const flashcards: Flashcard[] = JSON.parse(jsonText);
        return flashcards;
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
    }[questionType];

    const difficultyIta = {
        'easy': 'facile',
        'medium': 'medio',
        'hard': 'difficile'
    }[difficulty];

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
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
        
        const jsonText = response.text.trim();
        const quiz: QuizQuestion[] = JSON.parse(jsonText);
        return quiz;
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
    }[questionType];

    const difficultyIta = {
        'easy': 'facile',
        'medium': 'medio',
        'hard': 'difficile'
    }[difficulty];

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
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
        
        const jsonText = response.text.trim();
        const testQuestions: QuizQuestion[] = JSON.parse(jsonText);
        return testQuestions;
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
            model: "gemini-2.5-flash",
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

        const jsonText = response.text.trim();
        const routine: RoutineSlot[] = JSON.parse(jsonText);
        return routine;
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
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
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

        const jsonText = response.text.trim();
        const lessonPlan: LessonPlan = JSON.parse(jsonText);
        return lessonPlan;
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
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
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

        const jsonText = response.text.trim();
        const connections: InterdisciplinaryConnection[] = JSON.parse(jsonText);
        return connections;
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
TITOLO I - CODICE DI COMPORTAMENTO 
diritti e doveri degli studenti 
DIRITTI 
1. 
2. 
3. 
4. 
5. 
6. 
7. 
8. 
9. 
10. 
La scuola garantisce il diritto allo studio. 
Ogni studente ha il diritto di esprimere le proprie convinzioni, nel rispetto degli altri, e di richiedere il rispetto 
della propria dignità da parte di tutte le componenti scolastiche. 
Lo studente ho diritto ad una valutazione trasparente, i cui criteri siano stati esplicitati alla classe, e tempestiva 
(come da documento di valutazione). 
Ogni studente ha il diritto di fare comunicazioni alle classi o raccogliere firme per motivi sociali, didattici o inerenti 
gli organi collegiali. A tal fine è necessario fare richiesta di autorizzazione alla presidenza con 3 giorni di anticipo 
sull’iniziativa. Il permesso scritto della presidenza di entrare nelle altre classi/rimanere fuori dalla propria va 
esibito al docente della propria classe e delle classi visitate. 
È consentita ai membri di tutte le componenti scolastiche l’affissione di manifesti e giornali murali all’interno 
della scuola, in appositi spazi e nel rispetto delle leggi che regolano la stampa, firmati in calce e vistati dalla 
Presidenza per presa visione. È vietata l’affissione di manifesti di partito o inerenti a campagne elettorali. 
Ogni classe può chiedere un’assemblea di classe della durata di due ore una volta al mese, durante l’orario 
scolastico, ad eccezione dei mesi di maggio e giugno. Detta richiesta va formulata sull’apposito modulo siglato dal 
docente o dai docenti cedenti l’ora e inoltrata alla presidenza con almeno 3 giorni di anticipo. La richiesta deve 
essere corredata dal previsto ordine del giorno. Durante l’assemblea viene redatto un verbale da consegnare in 
presidenza. Il DS e/o i docenti possono assistere alle assemblee. 
Il comitato studentesco può chiedere un’assemblea di istituto della durata di due ore una volta al mese, durante 
l’orario scolastico. Detta richiesta va formulata sull’apposito modulo e inoltrata alla presidenza con almeno una 
settimana di anticipo. La richiesta deve essere corredata dal previsto ordine del giorno. Durante l’assemblea viene 
redatto un verbale da consegnare in presidenza. Il DS e/o i docenti possono assistere alle assemblee. 
Il comitato studentesco può formulare proposte al collegio docenti e al consiglio di istituto, organizzare attività 
culturali (previa delibera del consiglio di istituto), esprimere pareri relativamente a iniziative culturali organizzate 
dalla scuola, nominare un membro effettivo e un supplente nell’organo di garanzia. 
Per riunioni del Comitato o per gruppi di studio in orario extrascolastico, gli studenti possono liberamente 
utilizzare gli spazi allestiti al piano del bar/parcheggio oppure possono prenotare on line l’aula “peer education”. 
La famiglia dello studente può chiedere al docente tramite il proprio figlio di prendere visione degli elaborati. Il 
docente può decidere se consegnare copia cartacea/digitale o se consegnare l’originale, indicando il tempo tassativo 
di riconsegna: in caso di mancata restituzione/smarrimento è prevista sanzione per lo studente e compilazione di 
apposita modulistica da parte del genitore. 
DOVERI - a scuola 
11. 
12. 
13. 
14. 
15. 
16. 
17. 
18. 
19. 
È richiesto un comportamento educato e rispettoso delle persone e delle cose. Non va disturbato o impedito 
il regolare svolgimento delle lezioni. 
È vietato allontanarsi durante l’orario scolastico se non con autorizzazione della Presidenza. 
È obbligatorio avere con sé ed esibire, se richiesto dal personale docente e non docente, un documento di 
identità. 
È obbligatorio accettare gli interventi di tutto il personale docente e non docente, identificarsi e ottemperare alle 
richieste. 
È richiesto un linguaggio controllato: non sono accettabili turpiloquio, toni alterati e insolenti. 
È richiesto un abbigliamento decoroso ed adeguato al contesto di studio e lavoro. 
È vietato fumare (cfr Titolo VI). 
È obbligatorio utilizzare i bagni del piano e corridoio/atrio in cui è ubicata la propria aula. La permanenza nei 
locali va limitata al tempo di fruizione del servizio: gli alunni non si fermano a chiacchierare nello spazio comune 
ed entrano tassativamente uno alla volta negli spazi chiusi. 
Pagina 3 di 13 
Gli studenti che non si avvalgono dell’insegnamento IRC e optano per lo “studio individuale” devono trascorrere 
IISS “PIETRO VERRI” 
TECNICO ECONOMICO E LICEO LINGUISTICO 
Via Lattanzio 38, Milano MIIS081008 internet: www.verri.edu.it 
REGOLAMENTO di ISTITUTO 
Approvato l’8 settembre 2025 
l’ora negli spazi allestiti del piano bar/parcheggio. 
20. 
È obbligatorio, in caso di emergenza, uscire seguendo i percorsi indicati sulle piantine esposte ad ogni piano e 
rispettando l’ordine di evacuazione dato con le modalità indicate nell’apposito documento “Piano di emergenza” 
pubblicato nel sito istituzionale e presentato agli alunni in apposite riunioni con il DS/RSPP. 
DOVERI - in aula 
21. 
22. 
23. 
24. 
25. 
26. 
È necessario curare la pulizia dell’aula, utilizzando i cestini e non lasciando nulla sotto i banchi o sul pavimento. 
Le classi che all’uscita lasciassero l’aula in disordine dovranno pulirla il giorno successivo. 
È fatto tassativo divieto di lasciare oggetti di qualunque tipo (compresi libri, quaderni e fogli) nelle aule al termine 
di ogni giornata di lezione. 
È vietato lasciare valori incustoditi nella giacca, nello zaino, sotto il banco, negli spogliatoi: cellulare, smart watch, 
portafoglio, denaro/documenti personali, altri oggetti. La scuola non risponde di furti, smarrimenti e/o 
danneggiamenti. 
Le classi che abbandonano la propria aula per recarsi in palestra o nei laboratori devono far chiudere a chiave la 
propria aula da uno dei collaboratori scolastici presenti sul piano. 
È necessario ottenere l’autorizzazione del docente per l’uscita dall’aula durante le lezioni; essa è consentita a 
non più di un alunno per volta; gli studenti dovranno rientrare in classe il più sollecitamente possibile, senza 
sostare negli atrii, nei corridoi, nei servizi ed assolutamente non sulle scale di emergenza. Al cambio d’ora lo 
studente deve chiedere permesso d’uscita al docente entrante. 
È obbligatorio giustificare come un ritardo l’ammissione in aula dopo un’uscita prolungata non autorizzata. 
DOVERI - durante le lezioni 
27. 
28. 
29. 
È necessario procurarsi e portare con sé il materiale per seguire le lezioni, così come richiesto dai docenti, e 
partecipare attivamente, senza disturbare. 
Didattica a distanza (in caso di): gli studenti sono tenuti a seguire le attività didattiche a distanza previste nel 
loro orario scolastico. Le attività devono avvenire a telecamera accesa e secondo le indicazioni del docente. Lo 
studente è tenuto a collegarsi all’orario stabilito; ritardi ed assenze devono essere giustificati dai genitori o dagli 
stessi studenti se maggiorenni. 
È 
obbligatoria 
la 
partecipazione 
alle 
attività 
didattiche 
deliberate 
dal 
cdc 
(uscite/mostre/spettacoli/conferenze…); chi non partecipa deve giustificare. Durante uscite, viaggi e stage vanno 
rispettati gli specifici regolamenti. 
30. 
31. 
32. 
33. 
34. 
35. 
È richiesto il rispetto del regolamento anche per le attività di PCTO, che sono parte integrante della didattica. 
È vietato utilizzare i telefoni cellulari, gli auricolari e gli smart watch dall’inizio al termine delle lezioni, compresi 
gli intervalli (cfr Circolare MIM 3392 16/6/25): vanno tenuti SPENTI. E’ responsabilità dello studente la custodia. 
E’ vietato utilizzare tablet e/o altri device personali, se non previsti da PDP o PEI. 
Non è consentito consumare cibi/bevande durante le lezioni. 
Non è consentito introdurre alcolici a scuola. 
Non è consentito introdurre sostanze stupefacenti a scuola. 
Pagina 4 di 13 
IISS “PIETRO VERRI” 
TECNICO ECONOMICO E LICEO LINGUISTICO 
Via Lattanzio 38, Milano MIIS081008 internet: www.verri.edu.it 
REGOLAMENTO di ISTITUTO 
Approvato l’8 settembre 2025 
TITOLO II - RISPETTO E REGOLAMENTAZIONE DEGLI SPAZI 
1. Nelle aule, nelle palestre, nei laboratori, negli spazi comuni ed in genere in tutta l’area dell’edificio scolastico è 
richiesto un comportamento corretto e rispettoso. 
2. I regolamenti dei singoli laboratori, delle palestre e della biblioteca, in tali spazi affissi, integrano il presente 
regolamento e debbono essere rispettati da tutti gli utenti. 
3. Sono richiesti ordine, silenzio negli spostamenti di intere classi dalle aule ai laboratori o alle palestre in modo 
da non disturbare le lezioni; sarà cura degli insegnanti, coadiuvati dai non docenti, provvedere a che ciò 
avvenga in loro presenza e sotto il loro controllo. 
4. Di eventuali danni sono chiamati a rispondere in solido coloro che li hanno provocati. In mancanza di 
individuazione dei responsabili il danno è addebitabile all’intera classe, a più classi o a tutti gli studenti 
dell’istituto, previa delibera in quest’ultimo caso del consiglio d’istituto, che potrà anche quantificare una cifra 
“una tantum” per i danni causati dagli studenti stessi. 
5. Gli studenti possono di norma trascorrere gli intervalli nel giardino prospiciente il bar; la parte del campo 
sportivo è utilizzabile solo dalle classi sorvegliate dal loro docente di scienze motorie; gli studenti devono 
restare nello spazio di pertinenza del Verri, senza superare la prima grata orizzontale di separazione 
dall’Einstein, per non disturbare le lezioni dell’altra scuola, che ha orari differenti; ad ogni classe è richiesto di 
segnalare al DS un addetto al decoro ed alla pulizia, da inserire a rotazione in un planning settimanale 
predisposto dal DS stesso a garanzia della salvaguardia del giardino. 
6. È vietato l’ingresso a persone estranee all’istituto senza specifica autorizzazione da parte del dirigente 
scolastico (o suoi delegati). Chiunque entri deve identificarsi con documento. 
7. Il parcheggio delle autovetture nel cortile interno dell’Istituto è riservato esclusivamente ai docenti ed al 
personale A.T.A. I veicoli non debbono essere parcheggiati in modo da ostruire le uscite di sicurezza 
d’emergenza: in ogni caso dovranno essere posteggiati entro le linee tracciate al suolo. I fruitori comunicano 
previamente modello e numero di targa del veicolo al DS, che li autorizza. 
8. Il parcheggio delle biciclette è previsto sotto il portico d’accesso al piano terra. 
9. Il parcheggio dei motocicli è previsto in apposita area, in corrispondenza del portico della palestra, 
raggiungibile attraverso il passo carraio, percorrendo un corridoio lastricato sulla sinistra dell’edificio scolastico. 
10. Il parcheggio dei monopattini è previsto all’interno dello spazio delimitato dalla cancellata d’ingresso (a sinistra 
di chi entra a scuola). E’ fatto divieto di introdurli negli spazi comuni della scuola e di portarli nelle aule. 
11. Non essendo i parcheggi specificamente custoditi, né controllati a distanza mediante telecamere, l’Istituto non 
risponde comunque, in nessun caso, di eventuali furti o danneggiamenti; qualora venga individuato il 
responsabile di uno di tali atti, l’intervento dell’Istituto sarà limitato alla erogazione di una sanzione disciplinare 
nei suoi confronti, restando a carico del danneggiato adire le consuete vie per ottenere il rimborso del danno. 
12. Al fine di ridurre il rischio di accesso di estranei all’interno dei cortili dell’Istituto, il cancello del passo carraio 
verrà chiuso dopo l’inizio delle lezioni e sarà aperto solo all’orario di uscita delle classi. Gli studenti non devono 
utilizzare questo passo carraio come entrata pedonale nell’istituto. 
13. L’uso dell’ascensore è riservato al personale; viene consentito agli alunni solo per documentati motivi di salute, 
per limitati periodi di tempo e previa richiesta dei genitori alla presidenza. 
Pagina 5 di 13 
IISS “PIETRO VERRI” 
TECNICO ECONOMICO E LICEO LINGUISTICO 
Via Lattanzio 38, Milano MIIS081008 internet: www.verri.edu.it 
REGOLAMENTO di ISTITUTO 
Approvato l’8 settembre 2025 
TITOLO III - ORARIO: ingressi, uscite, giustificazioni 
1. 
2. 
3. 
4. 
5. 
6. 
7. 
8. 
9. 
10. 
Il rispetto dell’orario è un obbligo per tutti. 
L’orario delle lezioni è stabilito dal Consiglio di Istituto tenendo conto delle norme ministeriali, delle necessità 
didattiche e di quelle degli studenti e delle loro famiglie 
I genitori/tutori degli studenti residenti o domiciliati in comuni diversi da Milano, per motivi documentati legati 
agli orari dei mezzi di trasporto extraurbani, potranno richiedere alla Presidenza, allegando orario dei mezzi di 
trasporto utilizzati, un permesso permanente che autorizzi lo studente, entro i termini specificati nel permesso 
stesso, a ritardare l’entrata e/o ad anticipare l’uscita per un massimo di 10 minuti. Tale permesso sarà inserito 
nel Registro di Classe. 
E’ consentito ingresso in ritardo di un’ora, ovvero alle 8.55. Solo in casi eccezionali, comprovati da adeguata 
documentazione (visite mediche, appuntamenti per rilascio documenti, sciopero o guasti dei mezzi di 
trasporto…) consegnata al docente presente in aula all’orario di ingresso a scuola dell’alunno, è consentito 
l’accesso con un ritardo maggiore. 
Il tetto massimo di ritardi (non eccezionali) è di 5 a quadrimestre. Superato tale tetto, saranno previste 
ripercussioni automatiche sul voto di condotta. 
È consentita l’uscita in anticipo di un’ora rispetto all’orario della classe previsto per quel giorno. Solo in casi 
eccezionali, comprovati da adeguata documentazione (visite mediche, appuntamenti per rilascio documenti…) 
è consentita un’uscita in altri orari della mattina: in quel caso il genitore/tutore deve caricare la richiesta di 
uscita anticipata nel registro elettronico, il docente la approva acquisendola come giustificata, e l’alunno 
mostra il giustificativo al docente presente all’orario di uscita o si impegna a portarlo la mattina successiva. 
Il tetto massimo di uscite anticipate è di 5 a quadrimestre (salvo motivi medici o di richiesta documenti). 
Superato tale tetto, l’uscita non sarà consentita. 
Le giustificazioni di assenze e ritardi vanno portate il primo giorno utile e comunque tempestivamente; al 2° 
giorno di ritardo nel giustificare, l’alunno non sarà ammesso a scuola. Si accettano solo giustificazioni nel 
Registro elettronico. 
Tutti gli studenti, che provino un malessere, devono sempre avvertire il docente, che attuerà la procedura 
prevista nel protocollo di sicurezza generale e NON chiamare direttamente le famiglie. Gli studenti MINORENNI 
NON saranno autorizzati ad uscire dalla scuola se non accompagnati da un familiare o da un maggiorenne 
delegato dalla famiglia a inizio anno scolastico; gli studenti MAGGIORENNI potranno lasciare autonomamente 
l’istituto dopo telefonata da parte della segreteria di avviso alla famiglia. 
Le eventuali uscite per il freddo saranno autorizzate dalla Presidenza, secondo norma di legge. 
Pagina 6 di 13 
IISS “PIETRO VERRI” 
TECNICO ECONOMICO E LICEO LINGUISTICO 
Via Lattanzio 38, Milano MIIS081008 internet: www.verri.edu.it 
REGOLAMENTO di ISTITUTO 
Approvato l’8 settembre 2025 
TITOLO IV - USO DELLE TECNOLOGIE 
1. 
2. 
3. 
4. 
5. 
6. 
7. 
8. 
La scuola comunica con le famiglie, con gli studenti, e con il personale attraverso il sito e il registro 
elettronico. Ai sensi dell’art.11 del D. Lgs. n. 150/2009, il sito istituzionale svolge le funzioni di albo pubblico. 
Nelle sue diverse sezioni la scuola pubblica le informazioni concernenti ogni aspetto dell’organizzazione, gli 
indicatori relativi agli andamenti gestionali e all’utilizzo delle risorse per il perseguimento delle funzioni 
istituzionali, i risultati dell’attività di misurazione e valutazione svolta dagli organi competenti, allo scopo di 
favorire forme diffuse di controllo del rispetto dei principi di buon andamento e imparzialità. È fatto obbligo 
per tutte le componenti della scuola di consultare il sito e il registro con assiduità e continuità. 
Il docente può chiedere agli studenti di poggiare sulla cattedra telefoni e smart watch durante le prove di 
verifica. 
È vietato effettuare e/o diffondere registrazioni e riprese audio/foto/video, se non espressamente 
autorizzate dai docenti come parte integrante della loro attività didattica. Si richiama l’attenzione degli 
studenti, dei docenti e delle famiglie sulle possibili conseguenze di eventuali riprese audio/video o fotografie 
effettuate all’interno degli ambienti scolastici e successivamente diffuse: tali azioni possono configurare, nei 
casi più gravi, gli estremi di veri e propri reati. 
L’accesso e l’utilizzo di Internet mediante qualsiasi dispositivo della scuola è normato dalla P.U.A. (politica di 
utilizzo accettabile della rete) di istituto, che è parte integrante di questo regolamento. E’ TASSATIVAMENTE 
vietato agli studenti connettersi tramite dispositivi personali alla rete wifi della scuola; anche tale 
comportamento può configurare, nei casi più gravi, gli estremi di un vero e proprio reato. 
L’utilizzo delle LIM e dei MONITOR TOUCH è strettamente vincolato alla presenza di un docente responsabile, 
in nessun caso devono essere utilizzati durante l’intervallo. Al termine delle lezioni la LIM dovrà essere spenta 
ed il PC dovrà essere posto nell’apposito armadio di classe. I rappresentanti degli studenti hanno la 
responsabilità di ritirare le chiavi all’inizio della mattina e riconsegnarle in uscita. 
Per l’utilizzo dei PC, si rimanda ai regolamenti dei singoli laboratori. 
Ogni studente ed ogni classe hanno un indirizzo @verri.edu.it: è cura dello studente ricordare, custodire e non 
diffondere la pw, nonché controllare la casella mail per prendere visione di comunicazioni dei docenti, facendo 
attenzione ad utilizzare uno stile comunicativo formale, consono al rapporto docente-discente. 
In caso di Didattica a Distanza, lo studente utilizzerà gli strumenti scelti dal Collegio dei Docenti con puntualità 
e correttezza, sia nelle lezioni che nelle verifiche. 
Pagina 7 di 13 
IISS “PIETRO VERRI” 
TECNICO ECONOMICO E LICEO LINGUISTICO 
Via Lattanzio 38, Milano MIIS081008 internet: www.verri.edu.it 
REGOLAMENTO di ISTITUTO 
Approvato l’8 settembre 2025 
TITOLO V - BULLISMO E CYBERBULLISMO 
Codice interno per la prevenzione ed il contrasto 
PREMESSE 
L’IISS VERRI recepisce quanto previsto: - 
dalla LEGGE 29 Maggio 2017, n. 71; - - 
dalle LINEE DI ORIENTAMENTO per la prevenzione e il contrasto dei fenomeni di Bullismo e Cyberbullismo” 
prot. n. 18 del 13 gennaio 2021; 
dalla LEGGE 17 maggio 2024, n. 70 (“Disposizioni e delega al Governo in materia di prevenzione e contrasto del 
bullismo e del cyberbullismo”), che all’art. 1 recita: “La presente legge e' volta a prevenire e contrastare i 
fenomeni del bullismo e del cyberbullismo in tutte le loro manifestazioni, in particolare con azioni di carattere 
preventivo e con una strategia di attenzione e tutela nei confronti dei minori, sia nella posizione di vittime sia 
in quella di responsabili di illeciti, privilegiando azioni di carattere formativo ed educativo e assicurando 
l'attuazione degli interventi, senza distinzione di eta', nell'ambito delle istituzioni scolastiche…, e nei riguardi 
dei soggetti esercenti la responsabilita' genitoriale, cui incombe l'obbligo di orientare i figli al corretto utilizzo 
delle tecnologie e di presidiarne l'uso”. 
Per BULLISMO si intendono l'aggressione o la molestia reiterate, da parte di una singola persona o di un gruppo di 
persone, in danno di un minore o di un gruppo di minori, idonee a provocare sentimenti di ansia, di timore, di isolamento 
o di emarginazione, attraverso atti o comportamenti vessatori, pressioni o violenze fisiche o psicologiche, istigazione al 
suicidio o all'autolesionismo, minacce o ricatti, furti o danneggiamenti, offese o derisioni” 
Sono dunque da considerarsi tipologie persecutorie qualificate come BULLISMO: 
a. la violenza fisica, psicologica o l’intimidazione del gruppo, specie se reiterata; 
b. l'intenzione di nuocere; 
c. l'isolamento della vittima. 
In aggiunta al bullismo in "presenza" (con spazio temporale preciso), la rapida diffusione delle tecnologie può 
determinare anche il bullismo online o CYBERBULLISMO effettuato attraverso posta elettronica, social network, chat, 
blog, forum ecc. In accordo alle “Linee di orientamento per la prevenzione e il contrasto del cyberbullismo” del MIUR, 
ottobre 2017, e a quanto stabilito dalla legge del 29 Maggio 2017 n. 71, si definisce CYBERBULLISMO "qualunque forma 
di pressione, aggressione, molestia, ricatto, ingiuria, denigrazione, diffamazione, furto d'identità, alterazione, 
acquisizione illecita, manipolazione, trattamento illecito di dati personali in danno di minorenni, realizzata per via 
telematica, nonché la diffusione di contenuti on-line aventi ad oggetto anche uno o più componenti della famiglia del 
minore il cui scopo intenzionale e predominante sia quello di isolare un minore o un gruppo di minori o uno ponendo in 
atto un serio abuso, un attacco dannoso ,o la loro messa in ridicolo." 
Rientrano nel CYBERBULLISMO: 
a. Flaming: litigi online nei quali si fa uso di un linguaggio violento e volgare. 
b. Harassment: molestie attuate attraverso l’invio ripetuto di linguaggi offensivi. 
c. Cyberstalking: invio ripetuto di messaggi che includono esplicite minacce fisiche, al punto che la vittima arriva a 
temere per la propria incolumità. 
d. Denigrazione: pubblicazione all’interno di comunità virtuali, quali newsgroup, blog, forum di discussione, 
messaggistica immediata, siti internet, ecc. di pettegolezzi e commenti crudeli, calunniosi e denigratori. 
e. Outing estorto: registrazione delle confidenze, raccolte all’interno di un ambiente privato, creando un clima di 
fiducia e poi inserite integralmente in un blog pubblico. 
Pagina 8 di 13 
IISS “PIETRO VERRI” 
TECNICO ECONOMICO E LICEO LINGUISTICO 
Via Lattanzio 38, Milano MIIS081008 internet: www.verri.edu.it 
REGOLAMENTO di ISTITUTO 
Approvato l’8 settembre 2025 
f. Impersonificazione: insinuazione all’interno dell’account di un’altra persona con l’obiettivo di inviare dal 
medesimo, messaggi ingiuriosi che screditino la vittima. 
g. Esclusione: estromissione intenzionale dall’attività online. 
h. Sexting: invio di messaggi via smartphone ed Internet, corredati da immagini a sfondo sessuale. 
1. Viene istituito un TAVOLO PERMANENTE DI MONITORAGGIO del quale fanno parte il Dirigente Scolastico, 2 
rappresentanti degli studenti, 3 degli insegnanti, 1 delle famiglie (ed eventualmente esperti di settore). 
2. Viene costituito un TEAM ANTIBULLISMO di cui fanno parte il Dirigente Scolastico e 2/3 docenti. 
3. La scuola si impegna a porre progressivamente in essere le condizioni per assicurare l'emersione di episodi 
riconducibili ai fenomeni del bullismo e del cyberbullismo, di situazioni di uso o abuso di alcool o di sostanze 
stupefacenti e di forme di dipendenza, e chiede alle famiglie di collaborare. 
4. In caso di episodi di bullismo o cyberbullismo, la scuola prevede sanzioni in un’ottica di giustizia riparativa e 
forme di supporto alle vittime. 
5. Salvo che il fatto costituisca reato, il dirigente scolastico applica le procedure previste dalle Linee di 
orientamento 2021, informa tempestivamente i genitori dei minori e promuove adeguate iniziative di carattere 
educativo nei riguardi dei minori medesimi, anche con l'eventuale coinvolgimento del gruppo costituente la 
classe in percorsi di mediazione scolastica. 
6. Nei casi più gravi ovvero se si tratti di condotte reiterate e, comunque, quando le iniziative di carattere 
educativo adottate dall'istituzione scolastica non abbiano prodotto esito positivo, il dirigente scolastico 
riferisce alle autorità competenti. 
Pagina 9 di 13 
IISS “PIETRO VERRI” 
TECNICO ECONOMICO E LICEO LINGUISTICO 
Via Lattanzio 38, Milano MIIS081008 internet: www.verri.edu.it 
REGOLAMENTO di ISTITUTO 
Approvato l’8 settembre 2025 
TITOLO VI - DIVIETO DI FUMO 
La scuola è impegnata a far sì che gli allievi acquisiscano comportamenti e stili di vita maturi e responsabili, finalizzati al 
benessere e improntati al rispetto della qualità della vita, dell’educazione alla convivenza civile e alla legalità. Pertanto 
si prefigge di: 
● fare della scuola un ambiente “sano”, basato sul rispetto della persona e della legalità e che faciliti negli allievi 
scelte consapevoli orientate alla salute propria ed altrui 
● prevenire l’abitudine al fumo 
● incoraggiare i fumatori a smettere di fumare o almeno a ridurre il numero giornaliero delle sigarette 
● garantire un ambiente di lavoro salubre, conformemente alle norme vigenti in materia di sicurezza sul lavoro 
● proteggere i non fumatori dai danni del fumo passivo 
● promuovere iniziative informative/educative sul tema 
● favorire la collaborazione sinergica con le famiglie e il territorio, condividendo con genitori ed istituzioni 
obiettivi, strategie e azioni di informazione e sensibilizzazione 
Il regolamento del Verri fa proprio il D.L. 104/2013 e successive modificazioni, che stabilisce il divieto di fumo (sigari, 
sigarette, sigarette elettroniche) a scuola. Nello specifico: 
 il divieto di fumo di sigari e sigarette è esteso anche alle aree all'aperto di pertinenza (cortile, portico, 
parcheggio…).
  l’utilizzo delle sigarette elettroniche è vietato nei locali chiusi.
 Il divieto interessa tutto il personale scolastico, gli alunni e si estende ai genitori e visitatori eventuali che si trovino nelle 
aree di cui sopra: così come stabilito dall’art. 7 L. 584/1975, modificato dall’art. 52 comma 20 della L. 28/12/2001 n. 
448, dalla L. 311/04 art.189 e dall’art. 10 L 689/1981, dall’art. 96 D. Lgs. 507/1999, infatti, i trasgressori sono soggetti 
alla sanzione amministrativa del pagamento di una somma da € 27,5 a € 275,00. La misura della sanzione è raddoppiata 
qualora la violazione sia commessa in presenza di una donna in evidente stato di gravidanza o in presenza di lattanti o 
bambini fino a dodici anni. Si ricorda che, poiché al personale dell’Istituto è vietata la riscossione diretta della sanzione 
amministrativa, il pagamento deve essere effettuato, come previsto dal punto 10 dell’Accordo Stato Regioni del 
16/12/04, presso la Tesoreria provinciale, oppure in banca o presso gli Uffici postali, utilizzando il modello F23 (Agenzia 
delle Entrate ) con codice tributo 131T, oppure presso gli uffici postali, con bollettino di c/c postale intestato alla 
tesoreria provinciale (Causale: Infrazione divieto di fumo – IISS VERRI – Milano). I trasgressori dovranno consegnare 
copia della ricevuta, comprovante l’avvenuto pagamento, presso la segreteria onde evitare l’inoltro del rapporto al 
Prefetto territorialmente competente. 
Per gli alunni sorpresi a fumare a scuola: 
 si procederà a segnalare immediatamente ai genitori l’infrazione della norma tramite nota nel registro 
elettronico.
  in aggiunta alle sanzioni pecuniarie previste, sarà comminata una sanzione disciplinare.
 Pagina 10 di 13 
IISS “PIETRO VERRI” 
TECNICO ECONOMICO E LICEO LINGUISTICO 
Via Lattanzio 38, Milano MIIS081008 internet: www.verri.edu.it 
REGOLAMENTO di ISTITUTO 
Approvato l’8 settembre 2025 
TITOLO VII - PROVVEDIMENTI DISCIPLINARI 
Le sanzioni disciplinari sono individuali, eventuali sanzioni collettive vanno considerate a tutti gli effetti un insieme di 
note individuali (ovviamente per tutti gli studenti della classe, esclusi gli assenti). 
Possono essere sanzionati anche fatti o comportamenti che – pur avvenendo fuori della scuola – siano riconducibili alla 
vita scolastica (esempio: lite all’uscita di scuola, davanti alla fermata del bus; insulti sui social network) o danneggiano 
l’immagine dell’Istituto. 
Le sanzioni previste sono le seguenti: 
a) richiamo verbale (irrogata dal docente). 
b) nota scritta, annotata sul registro di classe (irrogata da un docente, anche su segnalazione del personale ATA o di altri 
docenti). 
c) ammonizione scritta del Dirigente scolastico: al raggiungimento di tre note scritte inerenti un comportamento non 
corretto o anche in caso di un’unica nota riferita ad un episodio di grave scorrettezza, il coordinatore di classe chiederà 
al Dirigente l’irrogazione di ammonizione scritta, che viene comunicata in forma scritta alla famiglia. 
d) allontanamento dalla comunità scolastica, regolamentato dall’art. 4 dello Statuto delle studentesse e degli studenti 
della scuola secondaria e dalla Legge 150, 1/9/2024 (Valditara): - l’allontanamento, fino ad un massimo di 2 giorni, comporta il coinvolgimento della studentessa e dello studente in 
attività di approfondimento sulle conseguenze dei comportamenti che hanno determinato il provvedimento 
disciplinare (verifica orale); - l’allontanamento dalla scuola di durata superiore a 2 giorni comporta lo svolgimento, da parte della studentessa e 
dello studente, di attività di cittadinanza solidale presso strutture convenzionate con le istituzioni scolastiche. 
Contro la sanzione disciplinare dell’allontanamento dalla comunità scolastica è ammessa impugnazione tramite ricorso 
da parte di chiunque vi abbia interesse come disciplinato dall’art. 5 dello Statuto delle studentesse e degli studenti 
della scuola secondaria. 
REGOLAMENTO DI DISCIPLINA 
INFRAZIONI 
CHI SANZIONA 
SANZIONI 
Mancata riconsegna della verifica (Titolo I, 
art.10) 
Dirigente 
Mancata esibizione del documento di 
identità (Titolo I, art.12) 
Docente 
Ammonizione scritta 
Richiamo verbale, nota scritta se reiterato 
Mancata accettazione dell’intervento di un 
adulto e rifiuto a identificarsi (Titolo I, art. 
13) 
Dirigente 
Ammonizione scritta 
Abbigliamento non decoroso e inadeguato 
(Titolo I, art. 15) 
Docente 
Dirigente 
Richiamo verbale 
Se reiterato nota scritta e comunicazione 
telefonica alla famiglia 
Uso di bagni di altro piano (Titolo I, art.17) 
Docente su 
segnalazione 
del personale 
ATA 
Richiamo verbale 
Se reiterato nota scritta 
Assenze e ritardi non giustificati dopo 2 
giorni (Titolo III, art. 8) 
Docente 1°ora 
+ 
Vicepresidenza 
Comunicazione alla famiglia tramite nota a 
registro 
Non ammissione a scuola 
Ritardi dopo 5 volte a quadrimestre (Titolo 
III, art. 5) 
Coordinatore 
di classe + 
Vicepresidenza 
Da 6 a 8 ritardi: voto massimo in condotta 8 
Da 9 a 14 ritardi: voto massimo in condotta 7 
Oltre 14 ritardi: voto massimo in condotta 6 
Pagina 11 di 13 
IISS “PIETRO VERRI” 
TECNICO ECONOMICO E LICEO LINGUISTICO 
Via Lattanzio 38, Milano MIIS081008 internet: www.verri.edu.it 
REGOLAMENTO di ISTITUTO 
Approvato l’8 settembre 2025 
Pagina 12 di 13 
 
 
Uscita da scuola senza permesso (Titolo I, 
art. 11) CdC Sospensione 1-5gg 
Uscita dall’aula senza permesso (Titolo I, 
art. 24) 
Docente 
Dirigente 
Nota scritta 
Se reiterato, ammonizione 
Comportamento in aula negligente e 
disinteressato (Titolo I, art. 26) 
 
Docente 
Comunicazione alla famiglia tramite nota a 
registro + segnalazione al cdc come parametro per 
il voto di condotta + eventuale Ammonizione 
Comportamento in aula che disturbi o 
impedisca il regolare svolgimento delle 
lezioni (Titolo I, art. 10) 
Docente 
Dirigente 
CdC 
Nota scritta 
Se reiterato, ammonizione 
Sospensione 1-15gg 
Uso cellulare o altro materiale 
elettronico (Titolo I, art. 30; Titolo IV art 2) 
Docente 
Dirigente 
1° volta: Nota + Ammonizione  
Ogni reiterazione: Sospensione 1 gg SENZA 
CONVOCAZIONE CdC 
Uso cellulare/ auricolari/smart watch 
durante le verifiche (Titolo IV) Dirigente Sospensione 2 gg SENZA CONVOCAZIONE CdC 
Uso improprio della LIM (Titolo IV) Docente Nota 
 
Mancato rispetto della P.U.A (Titolo IV) 
Docente 
 
CdC 
Comunicazione alla famiglia tramite nota 
Ammonizione 
Sospensione 2 gg 
 
Bullismo (Titolo V) 
CdC 
Dirigente 
CdI 
Comunicazione alla famiglia tramite nota 
Sospensione da 5 a 15 gg 
Denuncia alle autorità competenti 
Sospensione +15gg 
 
Cyberbullismo (Titolo V) 
CdC 
Dirigente 
CdI 
Comunicazione alla famiglia tramite nota 
Sospensione da 5 a 15 gg 
Denuncia alle autorità competenti 
Sospensione +15gg 
Comportamenti COLPOSI che costituiscano 
pericolo per l’incolumità altrui (es: lancio di 
oggetti, …) (Titolo I; Titolo V) 
CdC Comunicazione alla famiglia tramite nota 
Sospensione 2-5 gg 
Comportamenti DOLOSI che costituiscano 
pericolo per l’incolumità altrui (es: lancio di 
oggetti, violenza fisica, violenza psicologica 
…) (Titolo I; Titolo V) 
 
Atto grave e/o reiterato 
CdC 
 
 
CdI 
Dirigente 
Comunicazione alla famiglia tramite nota 
Sospensione 6-15 gg 
 
 
Sospensione +15gg 
Denuncia alle autorità competenti 
Ricorso alla violenza verbale: toni alterati, 
insolenti, turpiloquio, bestemmie (Titolo I, 
art. 13) 
Docente 
CdC 
Dirigente 
Comunicazione alla famiglia tramite nota 
Ammonizione o Sospensione (a seconda della 
gravità) 
 
Ricorso alla violenza verbale: insulti, 
minacce (Titolo I, art. 13; Titolo V) 
Docente 
CdC 
CdI 
Dirigente 
Comunicazione alla famiglia tramite nota 
Sospensione 5-15gg 
Sospensione +15gg 
Denuncia alle autorità competenti 
 
Furto (con individuazione del responsabile) 
(Titolo I) 
CdC 
 
CdI 
Dirigente 
Comunicazione alla famiglia 
Sospensione 15gg 
Risarcimento del danno 
Sospensione +15gg 
Denuncia alle autorità competenti 
Violazione norme di sicurezza (Titolo I, art. 
19; Titolo II) 
Docente 
CdC 
Dirigente 
Comunicazione alla famiglia 
Ammonizione o Sospensione (a seconda della 
gravità) 5-15 gg 
 
IISS “PIETRO VERRI” 
TECNICO ECONOMICO E LICEO LINGUISTICO 
Via Lattanzio 38, Milano MIIS081008 internet: www.verri.edu.it 
REGOLAMENTO di ISTITUTO 
Approvato l’8 settembre 2025 
Violazione divieto antifumo (Titolo VI) 
Docente 
Dirigente/Ref. 
Ist. 
CdC 
Comunicazione alla famiglia  
Multa 
Sospensione 1-3 gg 
Falsificazione firma, alterazione voto 
verifica 
Dirigente 
CdC 
Comunicazione alla famiglia 
Sospensione 3-15 gg 
Introduzione di alcolici e/o assunzione a 
scuola (Titolo I, art. 33) 
Docente 
CdC 
Comunicazione alla famiglia 
Sospensione 1-3 gg 
Introduzione di sostanze stupefacenti e/o 
assunzione a scuola (Titolo I, art. 34) 
Docente 
CdC 
Comunicazione alla famiglia 
Sospensione 5-10 gg 
Introduzione di sostanze stupefacenti per 
uso non personale - spaccio (Titolo I, art. 
34) 
Docente 
CdC 
Dirigente 
Comunicazione alla famiglia 
Sospensione 15 gg 
Comunicazione all’autorità giudiziaria 
Mancato rispetto di spazi e arredi (Titolo II, 
art. 4) 
Docente 
CdC 
Dirigente 
Comunicazione alla famiglia 
Ammonizione o Sospensione (a seconda della 
gravità) 5 gg 
Pulizia e, se non possibile, risarcimento del danno
`;

export const answerRegulationQuestion = async (question: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: question,
            config: {
                systemInstruction: `Sei un assistente esperto del regolamento d'istituto dell'IISS "Pietro Verri". Rispondi alla domanda dell'utente basandoti ESCLUSIVAMENTE sul testo del regolamento fornito. Se la risposta non è presente nel testo, dichiara in modo chiaro che l'informazione non è disponibile nel documento. Non inventare informazioni. Sii preciso e cita gli articoli o i titoli se pertinenti. Ecco il testo del regolamento:\n\n${REGULATION_TEXT}`
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error answering regulation question:", error);
        throw new Error("Failed to get an answer. Please try again.");
    }
};