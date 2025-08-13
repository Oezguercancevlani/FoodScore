import React from 'react';
import ScoreBadge from './components/ScoreBadge.jsx';
import { useProductComparison } from './hooks/ProduktVergleich';

const ProductComparison = () => {
    const {
        comparisonList,
        comparisonData,
        loading,
        error,
        removeFromComparison,
        clearComparison
    } = useProductComparison();

    if (comparisonList.length === 0) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Produktvergleich</h2>
                    <p className="text-gray-600 mb-4">
                        Fügen Sie Produkte zum Vergleich hinzu, indem Sie auf "Vergleichen" klicken
                    </p>
                    <div className="text-6xl mb-4"></div>
                    <p className="text-sm text-gray-500">
                        Sie können bis zu 5 Produkte gleichzeitig vergleichen
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                    Produktvergleich ({comparisonList.length} Produkte)
                </h2>
                <button
                    onClick={clearComparison}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                    Alle entfernen
                </button>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {/* Produkt-Karten Übersicht */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
                {comparisonList.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onRemove={removeFromComparison}
                    />
                ))}
            </div>

            {/* Loading */}
            {loading && (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Vergleiche Produkte...</p>
                </div>
            )}

            {/* Vergleichstabelle */}
            {comparisonData && !loading && (
                <ComparisonTable
                    products={comparisonData.produkte}
                    analysis={comparisonData.vergleichsanalyse}
                />
            )}
        </div>
    );
};

const ProductCard = ({ product, onRemove }) => {
    return (
        <div className="border rounded-lg p-4 relative bg-white shadow-sm hover:shadow-md transition-shadow">
            <button
                onClick={() => onRemove(product.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-100"
                title="Entfernen"
            >
                ×
            </button>

            {product.bildUrl && (
                <img
                    src={product.bildUrl}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded mb-3"
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
            )}

            <h3 className="font-semibold text-sm mb-2 pr-8 leading-tight">
                {product.name}
            </h3>
            <p className="text-gray-600 text-xs mb-2">{product.marke}</p>
            <p className="text-gray-500 text-xs mb-2">{product.kategorie}</p>
            {product.preis && (
                <p className="font-bold text-green-600">{product.preis} €</p>
            )}
        </div>
    );
};

const ComparisonTable = ({ products, analysis }) => {
    const nutritionFields = [
        { key: 'energieKcal', label: 'Kalorien', unit: 'kcal', analysisKey: 'kalorien' },
        { key: 'fett', label: 'Fett', unit: 'g', analysisKey: 'fett' },
        { key: 'gesaettigteFettsaueren', label: 'Gesättigte Fettsäuren', unit: 'g', analysisKey: 'gesaettigteFettsaueren' },
        { key: 'kohlenhydrate', label: 'Kohlenhydrate', unit: 'g', analysisKey: 'kohlenhydrate' },
        { key: 'zucker', label: 'Zucker', unit: 'g', analysisKey: 'zucker' },
        { key: 'eiweiss', label: 'Eiweiß', unit: 'g', analysisKey: 'eiweiss' },
        { key: 'salz', label: 'Salz', unit: 'g', analysisKey: 'salz' }
    ];

    const getBestValueId = (field) => {
        // Für Kalorien, Fett, Zucker, Salz ist niedriger besser
        const lowerIsBetter = ['energieKcal', 'fett', 'gesaettigteFettsaueren', 'zucker', 'salz'];
        const analysisData = analysis?.naehrwerte?.[field.analysisKey];

        if (!analysisData) return null;

        return lowerIsBetter.includes(field.key)
            ? analysisData.minProduktId
            : analysisData.maxProduktId;
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
                <h3 className="text-xl font-bold text-gray-800">Detaillierter Vergleich</h3>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Eigenschaft
                        </th>
                        {products.map(product => (
                            <th key={product.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-48">
                                <div className="flex flex-col">
                                    <div className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                        {product.name}
                                    </div>
                                    <div className="text-gray-600 font-normal normal-case">
                                        {product.marke}
                                    </div>
                                </div>
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {/* Preis */}
                    <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Preis
                        </td>
                        {products.map(product => {
                            const isLowest = analysis?.preise?.guenstigsteId === product.id;
                            return (
                                <td key={product.id} className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                    isLowest ? 'bg-green-100 text-green-800' : 'text-gray-900'
                                }`}>
                                    {product.preis ? `${product.preis} €` : '-'}
                                    {isLowest && <span className="ml-2 text-xs">Günstigster</span>}
                                </td>
                            );
                        })}
                    </tr>

                    {/* Score (Qualitätsbewertung) */}
                    <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Score
                        </td>
                        {products.map((product) => {
                            const isBest = analysis?.scores?.besteScoreId === product.id;
                            return (
                                <td
                                    key={`score-${product.id}`}
                                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                                        isBest ? 'bg-green-100 font-bold text-green-800' : 'text-gray-900'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <ScoreBadge value={product.wertungsScore} />
                                        {isBest && product.wertungsScore != null && (
                                            <span className="text-xs">Bester</span>
                                        )}
                                    </div>
                                </td>
                            );
                        })}
                    </tr>


                    {/* Nährwerte */}
                    {nutritionFields.map(field => (
                        <tr key={field.key} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {field.label}
                            </td>
                            {products.map(product => {
                                const isBest = getBestValueId(field) === product.id;
                                const value = product[field.key];

                                return (
                                    <td key={product.id} className={`px-6 py-4 whitespace-nowrap text-sm ${
                                        isBest ? 'bg-green-100 font-bold text-green-800' : 'text-gray-900'
                                    }`}>
                                        {value || '-'}
                                        {isBest && value && <span className="ml-2 text-xs"> Bester</span>}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}

                    {/* Kategorie */}
                    <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                             Kategorie
                        </td>
                        {products.map(product => (
                            <td key={product.id} className="px-6 py-4 text-sm text-gray-900">
                                <div className="max-w-48 truncate" title={product.kategorie}>
                                    {product.kategorie || '-'}
                                </div>
                            </td>
                        ))}
                    </tr>

                    {/* EAN */}
                    <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            🔢 EAN
                        </td>
                        {products.map(product => (
                            <td key={product.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                                {product.ean || '-'}
                            </td>
                        ))}
                    </tr>
                    </tbody>
                </table>
            </div>

            {/* Analyse-Zusammenfassung */}
            {analysis && (
                <div className="px-6 py-4 bg-gray-50 border-t">
                    <h4 className="font-semibold mb-2">Zusammenfassung:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        {analysis.preise && (
                            <div>
                                <span className="font-medium"> Preisrange:</span> {analysis.preise.minPreis}€ - {analysis.preise.maxPreis}€
                            </div>
                        )}
                        {analysis.kategorien && (
                            <div>
                                <span className="font-medium">🏷 Kategorien:</span> {analysis.kategorien.alleSameKategorie ? 'Alle gleich' : 'Verschiedene'}
                            </div>
                        )}
                        {/* ⬇️ NEU: Durchschnittlicher Score */}
                        {analysis.scores && (
                            <div>
                                <span className="font-medium">Ø Score:</span> {analysis.scores.durchschnitt} Punkte
                            </div>
                        )}
                        <div>
                            <span className="font-medium"> Produkte:</span> {products.length} verglichen
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductComparison;