import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ZutatenListe() {
    const [zutaten, setZutaten] = useState([]);
    const [filteredZutaten, setFilteredZutaten] = useState([]);
    const [suchQuery, setSuchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({ anzahl: 0 });

    useEffect(() => {
        loadZutaten();
    }, []);

    useEffect(() => {
        if (suchQuery.trim() === '') {
            setFilteredZutaten(zutaten);
        } else {
            searchZutaten(suchQuery);
        }
    }, [suchQuery, zutaten]);

    const loadZutaten = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/score/dictionary');

            if (response.data && response.data.zutatenScores) {
                // Konvertiere zu Array für bessere Sortierung
                const zutatenArray = Object.entries(response.data.zutatenScores)
                    .map(([name, score]) => ({ name, score }))
                    .sort((a, b) => b.score - a.score); // Nach Score sortiert

                setZutaten(zutatenArray);
                setFilteredZutaten(zutatenArray);
                setStats({ anzahl: response.data.anzahlZutaten });
            }

            setLoading(false);
        } catch (err) {
            console.error('❌ Fehler beim Laden der Zutaten:', err);
            setError('Fehler beim Laden der Zutatenliste');
            setLoading(false);
        }
    };

    const searchZutaten = async (query) => {
        try {
            if (query.trim() === '') {
                setFilteredZutaten(zutaten);
                return;
            }

            const filtered = zutaten.filter(zutat =>
                zutat.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredZutaten(filtered);
        } catch (err) {
            console.error('❌ Fehler bei der Suche:', err);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
        if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        if (score >= 40) return 'text-orange-600 bg-orange-50 border-orange-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    const getScoreEmoji = (score) => {
        if (score >= 90) return '🌟';
        if (score >= 80) return '✅';
        if (score >= 60) return '👍';
        if (score >= 40) return '⚠️';
        return '❌';
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-slate-600">Lade Zutatenliste...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <p className="text-red-800">{error}</p>
                    <button
                        onClick={loadZutaten}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Erneut versuchen
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-thin text-slate-900 mb-4">
                    Zutaten<span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Dictionary</span>
                </h1>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                    Hier sehen Sie alle {stats.anzahl.toLocaleString('de-DE')} bewerteten Zutaten und deren Gesundheits-Score
                </p>
            </div>

            <div className="mb-8">
                <div className="relative max-w-md mx-auto">
                    <input
                        type="text"
                        placeholder="Zutat suchen..."
                        value={suchQuery}
                        onChange={(e) => setSuchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
                <p className="text-center text-sm text-slate-500 mt-2">
                    {filteredZutaten.length.toLocaleString('de-DE')} von {zutaten.length.toLocaleString('de-DE')} Zutaten
                </p>
            </div>

            <div className="mb-8 bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-medium text-slate-900 mb-4">Score-Bedeutung:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-xl">🌟</span>
                        <span className="text-sm text-green-600 font-medium">90-100: Ausgezeichnet</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-xl">✅</span>
                        <span className="text-sm text-green-600 font-medium">80-89: Sehr gut</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-xl">👍</span>
                        <span className="text-sm text-yellow-600 font-medium">60-79: Gut</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-xl">⚠️</span>
                        <span className="text-sm text-orange-600 font-medium">40-59: Mäßig</span>
                    </div>
                </div>
            </div>


            <div className="grid gap-3">
                {filteredZutaten.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-slate-500 text-lg">Keine Zutaten gefunden für "{suchQuery}"</p>
                    </div>
                ) : (
                    filteredZutaten.map((zutat, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-all duration-200"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">{getScoreEmoji(zutat.score)}</span>
                                    <span className="font-medium text-slate-900 capitalize">
                                        {zutat.name}
                                    </span>
                                </div>
                                <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getScoreColor(zutat.score)}`}>
                                    {zutat.score} Punkte
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>


            {filteredZutaten.length > 20 && (
                <div className="mt-8 text-center text-slate-500">
                    <p>Zeige {filteredZutaten.length.toLocaleString('de-DE')} Ergebnisse</p>
                </div>
            )}
        </div>
    );
}