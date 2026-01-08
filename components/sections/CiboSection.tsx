
import React, { useState } from 'react';
import ContentArea from '../ContentArea';

interface CiboSectionProps {
    onBack: () => void;
}

const CiboSection: React.FC<CiboSectionProps> = ({ onBack }) => {
    const [merenda, setMerenda] = useState('');
    const [barItem, setBarItem] = useState('');

    const merende = [
        "🍫 Barretta integrale", "🍫 Barretta al cioccolato", "🥪 Panino alla nutella",
        "🥪 Panino al prosciutto", "🍎 Frutta fresca di stagione", "🥜 Frutta secca",
        "🍟 Patatine", "🍘 Gallette di riso", "🍪 Cracker", "🥨 Taralli", "🍪 Biscotti",
        "🥐 Brioche", "🧁 Crostatina", "🥖 Grissini", "🧃 Succo di frutta",
        "🥪 Panino al salame", "🥪 Panino alla marmellata"
    ];

    const barItems = [
        "🥙 Piadina cotto e fontina", "🥙 Kebab", "🥪 Panino prosciutto e formaggio",
        "☕ Caffè", "🥛 Cappuccino", "🥐 Brioche al cioccolato", "🥐 Brioche alla marmellata",
        "🥐 Brioche alla crema", "🥪 Panino al salame", "🍗 Panino con cotoletta e ketchup",
        "🍗 Panino con cotoletta e maionese", "🍬 Caramelle", "🍵 Thè", "🍕 Pizza",
        "🧃 Succo di frutta"
    ];
    
    const generateMerenda = () => {
        const randomMerenda = merende[Math.floor(Math.random() * merende.length)];
        setMerenda(randomMerenda);
    };

    const generateBarItem = () => {
        const randomItem = barItems[Math.floor(Math.random() * barItems.length)];
        setBarItem(randomItem);
    };

    return (
        <ContentArea title="Cibo" onBack={onBack}>
            <p className="mb-6">Trova ispirazione per le tue merende!</p>
            
            <div className="bg-slate-100 p-6 rounded-xl mb-6">
                <h3 className="text-xl font-bold text-slate-800 mb-3">🍎 Generatore di Merende</h3>
                <p className="mb-4 text-slate-600">Non sai cosa portare per merenda? Clicca il pulsante per un'idea!</p>
                <button onClick={generateMerenda} className="bg-green-500 text-white font-bold py-2 px-6 rounded-full transition-transform duration-200 hover:scale-105">
                    Genera Merenda
                </button>
                {merenda && (
                    <div className="mt-4 bg-white p-4 rounded-lg border-l-4 border-green-500 font-semibold animate-fade-in">
                        {merenda}
                    </div>
                )}
            </div>

            <div className="bg-amber-100 p-6 rounded-xl mb-6">
                <h3 className="text-xl font-bold text-slate-800 mb-3">☕ Cosa Prendere al Bar</h3>
                <p className="mb-4 text-slate-600">Indeciso su cosa ordinare al bar della scuola? Lascia che ti aiutiamo!</p>
                <button onClick={generateBarItem} className="bg-amber-500 text-white font-bold py-2 px-6 rounded-full transition-transform duration-200 hover:scale-105">
                    Suggerisci Snack
                </button>
                {barItem && (
                    <div className="mt-4 bg-white p-4 rounded-lg border-l-4 border-amber-500 font-semibold animate-fade-in">
                        {barItem}
                    </div>
                )}
            </div>
        </ContentArea>
    );
};

export default CiboSection;
