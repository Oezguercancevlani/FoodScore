
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useProductComparison } from './hooks/ProduktVergleich';

export default function ProduktDetails() {
    const { id } = useParams();
    const [produkt, setProdukt] = useState(null);
    const navigate = useNavigate();

    // Vergleich Hook
    const { addToComparison, comparisonList, canAddMore } = useProductComparison();

    const isInComparison = comparisonList.find(p => p.id === parseInt(id));

    // Funktion zum Bestimmen der Score-Farbe
    const getScoreColor = (score) => {
        if (score === null || score === undefined) return 'bg-gray-300 text-gray-600';

        const roundedScore = Math.round(score);
        if (roundedScore >= 0 && roundedScore <= 20) return 'bg-red-500 text-white';
        if (roundedScore > 20 && roundedScore <= 40) return 'bg-orange-500 text-white';
        if (roundedScore > 40 && roundedScore <= 60) return 'bg-yellow-500 text-white';
        if (roundedScore > 60 && roundedScore <= 80) return 'bg-green-400 text-white';
        if (roundedScore > 80 && roundedScore <= 100) return 'bg-green-600 text-white';
        return 'bg-gray-300 text-gray-600';
    };

    // Funktion zum Bestimmen der Score-Beschreibung
    const getScoreDescription = (score) => {
        if (score === null || score === undefined) return 'Nicht bewertet';

        const roundedScore = Math.round(score);
        if (roundedScore >= 0 && roundedScore <= 20) return 'Sehr schlecht';
        if (roundedScore > 20 && roundedScore <= 40) return 'Schlecht';
        if (roundedScore > 40 && roundedScore <= 60) return 'Mittelmäßig';
        if (roundedScore > 60 && roundedScore <= 80) return 'Gut';
        if (roundedScore > 80 && roundedScore <= 100) return 'Sehr gut';
        return 'Unbekannt';
    };

    useEffect(() => {
        axios.get(`http://localhost:8080/produkte/${id}`)
            .then(res => setProdukt(res.data))
            .catch(err => {
                console.error('Fehler beim Laden des Produkts:', err);
                // Optional: Fehlerbehandlung für nicht gefundene Produkte
            });
    }, [id]);

    const handleAddToComparison = () => {
        if (produkt) {
            addToComparison(produkt);
        }
    };

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
            {/* Header mit Back Button und Vergleich Button */}
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

                    <div className="flex-1">
                        <h1 className="text-2xl font-thin text-slate-900">Produktdetails</h1>
                        <p className="text-sm text-slate-600 font-light">{produkt.marke}</p>
                    </div>

                    {/* NEUER Vergleich Button im Header */}
                    <div className="flex items-center gap-3">
                        {/* Vergleich-Status Info */}
                        {comparisonList.length > 0 && (
                            <button
                                onClick={() => navigate('/vergleich')}
                                className="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg border border-blue-200
                                         hover:bg-blue-100 transition-all duration-200 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Vergleich ({comparisonList.length})
                            </button>
                        )}

                        {/* Hauptvergleich Button */}
                        <button
                            onClick={handleAddToComparison}
                            disabled={isInComparison || !canAddMore}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                                isInComparison
                                    ? 'bg-green-100 text-green-800 cursor-default border border-green-200'
                                    : canAddMore
                                        ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            title={
                                isInComparison
                                    ? 'Bereits im Vergleich'
                                    : !canAddMore
                                        ? 'Maximum von 5 Produkten erreicht'
                                        : 'Zum Vergleich hinzufügen'
                            }
                        >
                            {isInComparison ? (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Im Vergleich
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Vergleichen
                                </>
                            )}
                        </button>
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
                                        {produkt.kategorie?.split(' > ').pop() || produkt.kategorie}
                                    </span>
                                    <span className="text-slate-500">EAN: {produkt.ean}</span>
                                </div>
                            </div>
                            <div className="text-right flex items-start gap-4">
                                <div>
                                    <div className="text-3xl font-bold text-blue-600 mb-1">{produkt.preis}€</div>
                                    <div className="text-sm text-slate-500">pro Stück</div>
                                </div>

                                {/* Score Display */}
                                <div className="flex flex-col items-center">
                                    <div className={`px-4 py-2 rounded-xl font-bold text-lg shadow-sm ${getScoreColor(produkt.wertungsScore)}`}>
                                        {produkt.wertungsScore !== null && produkt.wertungsScore !== undefined
                                            ? Math.round(produkt.wertungsScore)
                                            : '--'
                                        }
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1 text-center">
                                        {getScoreDescription(produkt.wertungsScore)}
                                    </div>
                                </div>
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
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>

                            {/* Score-Details Card */}
                            {produkt.wertungsScore !== null && produkt.wertungsScore !== undefined && (
                                <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Qualitätsbewertung
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-600">Score:</span>
                                            <div className={`px-3 py-1 rounded-lg font-semibold ${getScoreColor(produkt.wertungsScore)}`}>
                                                {Math.round(produkt.wertungsScore)}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-600">Bewertung:</span>
                                            <span className="font-medium text-slate-800">{getScoreDescription(produkt.wertungsScore)}</span>
                                        </div>

                                        {/* Score-Skala Visualisierung */}
                                        <div className="mt-4">
                                            <div className="text-xs text-slate-500 mb-2">Bewertungsskala</div>
                                            <div className="flex rounded-lg overflow-hidden h-2">
                                                <div className="bg-red-500 flex-1"></div>
                                                <div className="bg-orange-500 flex-1"></div>
                                                <div className="bg-yellow-500 flex-1"></div>
                                                <div className="bg-green-400 flex-1"></div>
                                                <div className="bg-green-600 flex-1"></div>
                                            </div>
                                            <div className="flex justify-between text-xs text-slate-400 mt-1">
                                                <span>0</span>
                                                <span>20</span>
                                                <span>40</span>
                                                <span>60</span>
                                                <span>80</span>
                                                <span>100</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

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

                            {/* Vergleichs-Info Card */}
                            {isInComparison && (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-green-800 mb-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="font-medium">Im Vergleich</span>
                                    </div>
                                    <p className="text-sm text-green-700">
                                        Dieses Produkt wurde zu Ihrem Vergleich hinzugefügt.
                                    </p>
                                    <button
                                        onClick={() => navigate('/vergleich')}
                                        className="mt-2 text-sm bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded-lg transition-colors"
                                    >
                                        Vergleich anzeigen
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Produktinformationen */}
                        <div className="space-y-6">
                            {/* Nährwerte */}
                            <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    Nährwerte
                                </h3>

                                <div className="space-y-3">
                                    {produkt.energieKcal && (
                                        <div className="flex justify-between py-2 border-b border-slate-100">
                                            <span className="text-slate-600">Energie (kcal):</span>
                                            <span className="font-medium">{produkt.energieKcal}</span>
                                        </div>
                                    )}
                                    {produkt.energieKj && (
                                        <div className="flex justify-between py-2 border-b border-slate-100">
                                            <span className="text-slate-600">Energie (kJ):</span>
                                            <span className="font-medium">{produkt.energieKj}</span>
                                        </div>
                                    )}
                                    {produkt.fett && (
                                        <div className="flex justify-between py-2 border-b border-slate-100">
                                            <span className="text-slate-600">Fett:</span>
                                            <span className="font-medium">{produkt.fett}</span>
                                        </div>
                                    )}
                                    {produkt.gesaettigteFettsaueren && (
                                        <div className="flex justify-between py-2 border-b border-slate-100">
                                            <span className="text-slate-600 text-sm pl-4">davon gesättigte Fettsäuren:</span>
                                            <span className="font-medium">{produkt.gesaettigteFettsaueren}</span>
                                        </div>
                                    )}
                                    {produkt.kohlenhydrate && (
                                        <div className="flex justify-between py-2 border-b border-slate-100">
                                            <span className="text-slate-600">Kohlenhydrate:</span>
                                            <span className="font-medium">{produkt.kohlenhydrate}</span>
                                        </div>
                                    )}
                                    {produkt.zucker && (
                                        <div className="flex justify-between py-2 border-b border-slate-100">
                                            <span className="text-slate-600 text-sm pl-4">davon Zucker:</span>
                                            <span className="font-medium">{produkt.zucker}</span>
                                        </div>
                                    )}
                                    {produkt.eiweiss && (
                                        <div className="flex justify-between py-2 border-b border-slate-100">
                                            <span className="text-slate-600">Eiweiß:</span>
                                            <span className="font-medium">{produkt.eiweiss}</span>
                                        </div>
                                    )}
                                    {produkt.salz && (
                                        <div className="flex justify-between py-2">
                                            <span className="text-slate-600">Salz:</span>
                                            <span className="font-medium">{produkt.salz}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Zutaten */}
                            {produkt.zutaten && (
                                <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        Zutaten
                                    </h3>
                                    <p className="text-slate-700 leading-relaxed text-sm">
                                        {produkt.zutaten}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}