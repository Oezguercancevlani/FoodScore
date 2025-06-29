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
        <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-100 to-gray-200 text-black px-4">
            <FliegendeEmojis />
            <div className="w-full max-w-xl bg-white rounded-3xl p-10 border border-gray-300 shadow-[0_20px_40px_rgba(0,0,0,0.12)]">
                <h1 className="text-5xl font-light text-center mb-8 text-gray-800">
                    FoodScore
                </h1>

                <div className="w-full relative">
                    <input
                        type="text"
                        value={eingabe}
                        onChange={(e) => setEingabe(e.target.value)}
                        placeholder="Suche nach Produktnamen…"
                        className="w-full border border-gray-300 focus:border-indigo-400 focus:ring-indigo-300 focus:ring-2 text-black px-5 py-3 rounded-lg shadow-sm transition-all"
                    />

                    {vorschlaege.length > 0 && (
                        <ul className="absolute left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                            {vorschlaege.map((p) => (
                                <li
                                    key={p.id}
                                    className="px-5 py-2 hover:bg-indigo-100 border-b border-gray-100 last:border-none transition-colors"
                                    onClick={() => navigate(`/produkt/${p.id}`)}
                                    style={{cursor: "pointer"}}
                                >
                                    <span className="font-medium text-gray-900">{p.name}</span>{" "}
                                    <span className="text-gray-500">– {p.marke}</span>
                                </li>

                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );

}