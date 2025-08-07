import { useState, useEffect } from "react";
import { sucheProdukte } from "./Clients/ProduktClient";
import { useNavigate } from "react-router-dom";
import "./index.css"
import FliegendeEmojis from "./FliegendeEmojis"

export default function Suche() {
    const navigate = useNavigate();
    const [eingabe, setEingabe] = useState("");
    const [vorschlaege, setVorschlaege] = useState([]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (eingabe.trim().length >= 1) {
                sucheProdukte(eingabe).then(setVorschlaege);
            } else {
                setVorschlaege([]);
            }
        }, 100);

        return () => clearTimeout(timeout);
    }, [eingabe]);

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 text-black px-4">
            <FliegendeEmojis />

            <div className="w-full max-w-xl">

                {/* Title */}
                <div className="text-center mb-12">
                    <h1 className="text-6xl font-thin text-slate-900 mb-4 tracking-tight">
                        Food<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Score</span>
                    </h1>
                    <p className="text-lg text-slate-600 font-light">
                        Entdecke die Nährwerte deiner Lieblings-Lebensmittel
                    </p>
                </div>

                {/* Search Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg overflow-hidden">

                    {/* Search Input */}
                    <div className="p-6">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-slate-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={eingabe}
                                onChange={(e) => setEingabe(e.target.value)}
                                placeholder="Suche nach Produktnamen…"
                                className="flex-1 text-lg bg-transparent border-none outline-none placeholder-slate-400 text-slate-900 focus:placeholder-slate-300"
                            />
                        </div>
                    </div>

                    {/* Search Results */}
                    {vorschlaege.length > 0 && (
                        <div className="border-t border-slate-100 max-h-80 overflow-y-auto">
                            <div className="p-2">
                                {vorschlaege.map((p) => (
                                    <div
                                        key={p.id}
                                        className="flex items-center justify-between p-4 hover:bg-slate-50/80
                                                 rounded-xl cursor-pointer transition-all duration-200 group"
                                        onClick={() => navigate(`/produkt/${p.id}`)}
                                    >
                                        <div className="flex-1">
                                            <div className="font-medium text-slate-900 group-hover:text-blue-600
                                                          transition-colors mb-1">
                                                {p.name}
                                            </div>
                                            <div className="text-sm text-slate-500">
                                                {p.marke}
                                            </div>
                                        </div>

                                        <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-500
                                                       transition-colors ml-4"
                                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}