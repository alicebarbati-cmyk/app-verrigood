
import React from 'react';
import ContentArea from '../ContentArea';

interface StoriaSectionProps {
    onBack: () => void;
}

const FeatureListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="bg-slate-100 p-4 rounded-lg border-l-4 border-blue-500 mb-3">{children}</li>
);

const StoriaSection: React.FC<StoriaSectionProps> = ({ onBack }) => {
    return (
        <ContentArea title="Storia della Scuola" onBack={onBack}>
            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">Fondazione e struttura scolastica</h3>
                    <ul className="list-none p-0 space-y-3">
                        <FeatureListItem>L’Istituto è stato inaugurato nel 1923.</FeatureListItem>
                        <FeatureListItem>È un istituto di istruzione secondaria superiore (“IISS”) con due principali indirizzi: Liceo Linguistico e Tecnico Economico.</FeatureListItem>
                        <FeatureListItem><strong>Sede:</strong> Via Lattanzio, 38 – Milano.</FeatureListItem>
                        <FeatureListItem>L’edificio scolastico è un complesso moderno su più piani, con laboratori, palestra, biblioteca e aula magna.</FeatureListItem>
                    </ul>
                </div>
                
                <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">Presidi storici</h3>
                    <div className="bg-slate-100 p-4 rounded-lg">
                        <p>Dal sito ufficiale si ricava la lista dei presidi nel corso degli anni: ad esempio, il primo preside (1923–1925) è stato il Prof. Saul Piazza; poi Andrea Franzoni (1925–1946), Gaetano D’Amico (1946–1970), e altri fino all’attuale (Prof.ssa Susanna Musumeci).</p>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">Intitolazione</h3>
                     <ul className="list-none p-0 space-y-3">
                        <FeatureListItem>La scuola è intitolata a Pietro Verri (1728–1797), un importante filosofo, economista e intellettuale dell’Illuminismo milanese.</FeatureListItem>
                        <FeatureListItem>Verri partecipò alla fondazione dell’Accademia dei Pugni e fu tra i promotori del periodico Il Caffè.</FeatureListItem>
                        <FeatureListItem>Fu anche attivo politicamente: divenne membro del Supremo Consiglio dell’Economia sotto il governo austriaco di Milano.</FeatureListItem>
                    </ul>
                </div>
                
                <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">Evoluzione dei percorsi formativi</h3>
                    <ul className="list-none p-0 space-y-3">
                        <FeatureListItem>Nel tempo, la scuola ha adattato i suoi indirizzi per rispondere ai cambiamenti economici: l’antico corso per ragionieri è diventato l’attuale “Tecnico Economico”, con specializzazioni come Amministrazione, Finanza e Marketing, Relazioni Internazionali per il Marketing, e Sistemi Informativi Aziendali.</FeatureListItem>
                        <FeatureListItem>Dal 2011 è attivo anche il Liceo Linguistico, con combinazioni di lingue straniere (inglese, francese, spagnolo, tedesco).</FeatureListItem>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">Missione educativa e offerta formativa</h3>
                    <ul className="list-none p-0 space-y-3">
                        <FeatureListItem>Secondo il Piano Triennale dell’Offerta Formativa (PTOF) 2022-2025, la scuola pone l’accento su inclusione, innovazione, competenze digitali e cittadinanza attiva.</FeatureListItem>
                        <FeatureListItem>Organizzazione scolastica ben strutturata: collegio docenti, consigli di classe, dipartimenti, figure di progetto.</FeatureListItem>
                    </ul>
                </div>
            </div>
        </ContentArea>
    );
};

export default StoriaSection;
