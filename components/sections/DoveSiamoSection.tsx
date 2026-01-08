import React from 'react';
import ContentArea from '../ContentArea';

interface DoveSiamoSectionProps {
    onBack: () => void;
}

const FeatureListItem: React.FC<{ title: string, content: string }> = ({ title, content }) => (
    <li className="bg-slate-100 p-4 rounded-lg border-l-4 border-blue-500 mb-3">
        <strong>{title}:</strong> {content}
    </li>
);

const LinkItem: React.FC<{ href: string; title: string; description: string; }> = ({ href, title, description }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block bg-green-50 p-4 rounded-lg border-l-4 border-green-500 mb-3 transition-transform hover:scale-[1.02] hover:shadow-md"
    >
        <h4 className="font-bold text-slate-800">{title}</h4>
        <p className="text-sm text-slate-600">{description}</p>
    </a>
);

const DoveSiamoSection: React.FC<DoveSiamoSectionProps> = ({ onBack }) => {
    return (
        <ContentArea title="Dove siamo e contatti" onBack={onBack}>
            <ul className="list-none p-0">
                <FeatureListItem title="Indirizzo" content="Via Lattanzio, 38 - 20137 Milano" />
                <FeatureListItem title="Tel. 1" content="+39 02 5511536" />
                <FeatureListItem title="Tel. 2" content="+39 02 5511590" />
                <FeatureListItem title="Email" content="miis081008@istruzione.it" />
                <FeatureListItem title="PEC" content="miis081008@pec.istruzione.it" />
                <FeatureListItem title="C.F." content="80096170156" />
            </ul>

            <h3 className="text-2xl font-bold text-slate-800 mb-4 mt-8 border-t pt-6">Raggiungici</h3>
             <div className="list-none p-0">
               <LinkItem 
                   href="https://www.google.com/maps/place/IISS+%22Pietro+Verri%22+di+Milano+-+Liceo+Linguistico+e+Istituto+Tecnico+Economico/@45.4513434,9.2137256,17z/data=!4m20!1m13!4m12!1m3!2m2!1d9.2161074!2d45.4514299!1m6!1m2!1s0x4786c42f4b76dd6b:0xa59e598a39aeb7a5!2sIISS+%22Pietro+Verri%22+di+Milano+-+Liceo+Linguistico+e+Tecnico+Economico,+Via+Lattanzio,+38,+20137+Milano+MI!2m2!1d9.2160582!2d45.4512812!3e3!3m5!1s0x4786c42f4b76dd6b:0xa59e598a39aeb7a5!8m2!3d45.4512812!4d9.2160582!16s%2Fg%2F1w0j31yb?authuser=5&entry=ttu&g_ep=EgoyMDI1MTExMi4wIKXMDSoASAFQAw%3D%3D"
                   title='IISS "Pietro Verri" di Milano - Google Maps'
                   description="Visualizza la nostra posizione e ottieni indicazioni stradali."
               />
               <LinkItem 
                   href="https://giromilano.atm.it/#/home/"
                   title="GiroMilano ATM, Azienda Trasporti Milanesi"
                   description="Calcola il percorso con i mezzi pubblici di Milano."
               />
            </div>

        </ContentArea>
    );
};

export default DoveSiamoSection;