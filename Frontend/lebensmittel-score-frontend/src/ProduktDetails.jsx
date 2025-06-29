import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProduktDetails() {
    const { id } = useParams();
    const [produkt, setProdukt] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/produkte/${id}`)
            .then(res => setProdukt(res.data));
    }, [id]);

    if (!produkt) {
        return <div className="text-center p-10 text-gray-600">Lade...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200 flex justify-center items-center px-4">
            <div className="bg-white rounded-3xl shadow-xl max-w-3xl w-full p-10 border border-gray-200">
                <h1 className="text-4xl font-bold mb-2 text-gray-800">{produkt.name}</h1>
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 flex justify-center">
                        <img
                            src={produkt.bildUrl}
                            alt={produkt.name}
                            className="rounded-2xl max-h-64 object-contain border border-gray-100 shadow-md"
                        />
                    </div>
                    <div className="flex-1 space-y-2">
                        <div><span className="font-semibold">Marke:</span> {produkt.marke}</div>
                        <div><span className="font-semibold">Kategorie:</span> {produkt.kategorie}</div>
                        <div><span className="font-semibold">Preis:</span> {produkt.preis} €</div>
                        <div><span className="font-semibold">EAN:</span> {produkt.ean}</div>
                        <div><span className="font-semibold">Zutaten:</span><br /><span className="whitespace-pre-line text-sm">{produkt.zutaten}</span></div>
                        <div className="pt-2">
                            <div className="font-semibold">Nährwerte pro 100g/ml:</div>
                            <ul className="text-sm pl-4">
                                <li>Energie: {produkt.energieKj} ({produkt.energieKcal})</li>
                                <li>Fett: {produkt.fett}, davon gesättigte Fettsäuren: {produkt.gesaettigteFettsaueren}</li>
                                <li>Kohlenhydrate: {produkt.kohlenhydrate}, davon Zucker: {produkt.zucker}</li>
                                <li>Eiweiß: {produkt.eiweiss}, Salz: {produkt.salz}</li>
                            </ul>
                        </div>
                        <div className="mt-3 text-xs text-gray-500">
                            <a href={produkt.quelleUrl} className="underline" target="_blank" rel="noopener noreferrer">
                                Zur Originalquelle
                            </a>
                        </div>
                        <div className="mt-5 p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-700 text-sm italic">
                            {/* Platzhalter für Nutri-Score, ähnliche Produkte etc. */}
                            Nutri-Score, ähnliche Produkte & Vergleich: <b>Hier später mehr!</b>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
