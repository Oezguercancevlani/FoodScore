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
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
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

                            {/* Vergleichs-Info Card */}
                            {isInComparison && (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-green-800 mb-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="font-medium">Im Vergleich</span>
                                    </div>
                                    <p className="text-sm text-green-700 mb-3">
                                        Dieses Produkt ist bereits in Ihrem Vergleich.
                                        Sie vergleichen derzeit {comparisonList.length} Produkt{comparisonList.length > 1 ? 'e' : ''}.
                                    </p>
                                    <button
                                        onClick={() => navigate('/vergleich')}
                                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg
                                                 hover:bg-green-700 transition-colors text-sm font-medium"
                                    >
                                        Vergleich anzeigen
                                    </button>
                                </div>
                            )}
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
                                    {produkt.zutaten || 'Keine Zutatenliste verfügbar'}
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
                                            {produkt.energieKcal || '-'}
                                            {produkt.energieKj && (
                                                <span className="text-xs text-slate-500 ml-1">({produkt.energieKj})</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 border border-slate-100">
                                        <div className="text-slate-500 text-xs mb-1">Fett</div>
                                        <div className="font-semibold text-slate-900">{produkt.fett || '-'}</div>
                                        {produkt.gesaettigteFettsaueren && (
                                            <div className="text-xs text-slate-600">davon gesättigt: {produkt.gesaettigteFettsaueren}</div>
                                        )}
                                    </div>
                                    <div className="bg-white rounded-lg p-3 border border-slate-100">
                                        <div className="text-slate-500 text-xs mb-1">Kohlenhydrate</div>
                                        <div className="font-semibold text-slate-900">{produkt.kohlenhydrate || '-'}</div>
                                        {produkt.zucker && (
                                            <div className="text-xs text-slate-600">davon Zucker: {produkt.zucker}</div>
                                        )}
                                    </div>
                                    <div className="bg-white rounded-lg p-3 border border-slate-100">
                                        <div className="text-slate-500 text-xs mb-1">Eiweiß</div>
                                        <div className="font-semibold text-slate-900">{produkt.eiweiss || '-'}</div>
                                        {produkt.salz && (
                                            <div className="text-xs text-slate-600">Salz: {produkt.salz}</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Vergleichs-Empfehlungen */}
                            {!isInComparison && comparisonList.length > 0 && (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        Vergleichsvorschlag
                                    </h3>
                                    <p className="text-sm text-blue-700 mb-3">
                                        Sie haben bereits {comparisonList.length} Produkt{comparisonList.length > 1 ? 'e' : ''} zum Vergleich hinzugefügt.
                                        Fügen Sie dieses Produkt hinzu, um die Unterschiede zu sehen.
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleAddToComparison}
                                            disabled={!canAddMore}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                                                     transition-colors text-sm font-medium disabled:opacity-50"
                                        >
                                            Hinzufügen
                                        </button>
                                        <button
                                            onClick={() => navigate('/vergleich')}
                                            className="px-4 py-2 bg-white text-blue-600 border border-blue-200
                                                     rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                                        >
                                            Vergleich anzeigen
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Future Features */}
                            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
                                <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    Kommt bald
                                </h3>
                                <p className="text-sm text-purple-700 italic">
                                    🏆 Nutri-Score • 🔍 Ähnliche Produkte • 📈 Preisverlauf • 💬 Bewertungen
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Zusätzliche Aktionen */}
                <div className="flex items-center justify-center gap-4 mt-8">
                    <button
                        onClick={() => navigate('/lebensmittel')}
                        className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-slate-200
                                 rounded-xl hover:bg-white transition-all duration-200
                                 text-slate-700 hover:text-slate-900 shadow-sm font-medium"
                    >
                        ← Zurück zur Liste
                    </button>

                    {comparisonList.length >= 2 && (
                        <button
                            onClick={() => navigate('/vergleich')}
                            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600
                                     transition-all duration-200 shadow-sm font-medium"
                        >
                            Produktvergleich anzeigen
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}