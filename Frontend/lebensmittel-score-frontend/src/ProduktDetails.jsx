
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProduktDetails() {
    const { id } = useParams();
    const [produkt, setProdukt] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8080/produkte/${id}`)
            .then(res => setProdukt(res.data));
    }, [id]);

    if (!produkt) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Produkt wird geladen...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header mit Back Button */}
            <div className="bg-white/70 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 
                                 hover:bg-white hover:border-slate-300 transition-all duration-200 
                                 flex items-center justify-center group"
                    >
                        <svg className="w-5 h-5 text-slate-700 group-hover:text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-2xl font-thin text-slate-900">Produktdetails</h1>
                        <p className="text-sm text-slate-600 font-light">{produkt.marke}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                
                {/* Haupt-Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg overflow-hidden mb-6">
                    
                    {/* Product Header */}
                    <div className="p-6 border-b border-slate-100">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h2 className="text-2xl font-semibold text-slate-900 mb-2">{produkt.name}</h2>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-700 font-medium">
                                        {produkt.kategorie}
                                    </span>
                                    <span className="text-slate-500">EAN: {produkt.ean}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-blue-600 mb-1">{produkt.preis}€</div>
                                <div className="text-sm text-slate-500">pro Stück</div>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="grid md:grid-cols-2 gap-8 p-6">
                        
                        {/* Bild */}
                        <div className="space-y-4">
                            <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                                <img
                                    src={produkt.bildUrl}
                                    alt={produkt.name}
                                    className="w-full max-h-80 object-contain rounded-lg"
                                />
                            </div>
                            
                            {/* Quelle */}
                            <div className="text-center">
                                <a 
                                    href={produkt.quelleUrl} 
                                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 
                                             bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors
                                             border border-blue-200"
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    Zur Originalquelle
                                </a>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-6">
                            
                            {/* Zutaten */}
                            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100">
                                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    Zutaten
                                </h3>
                                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                                    {produkt.zutaten}
                                </p>
                            </div>

                            {/* Nährwerte */}
                            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100">
                                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    Nährwerte pro 100g/ml
                                </h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="bg-white rounded-lg p-3 border border-slate-100">
                                        <div className="text-slate-500 text-xs mb-1">Energie</div>
                                        <div className="font-semibold text-slate-900">
                                            {produkt.energieKcal} <span className="text-xs text-slate-500">({produkt.energieKj})</span>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 border border-slate-100">
                                        <div className="text-slate-500 text-xs mb-1">Fett</div>
                                        <div className="font-semibold text-slate-900">{produkt.fett}</div>
                                        <div className="text-xs text-slate-600">davon gesättigt: {produkt.gesaettigteFettsaueren}</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 border border-slate-100">
                                        <div className="text-slate-500 text-xs mb-1">Kohlenhydrate</div>
                                        <div className="font-semibold text-slate-900">{produkt.kohlenhydrate}</div>
                                        <div className="text-xs text-slate-600">davon Zucker: {produkt.zucker}</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 border border-slate-100">
                                        <div className="text-slate-500 text-xs mb-1">Eiweiß</div>
                                        <div className="font-semibold text-slate-900">{produkt.eiweiss}</div>
                                        <div className="text-xs text-slate-600">Salz: {produkt.salz}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Future Features */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    Kommt bald
                                </h3>
                                <p className="text-sm text-blue-700 italic">
                                    🏆 Nutri-Score • 🔍 Ähnliche Produkte • 📊 Produktvergleich
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}