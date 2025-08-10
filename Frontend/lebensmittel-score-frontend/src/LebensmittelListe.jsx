
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAlleProdukte, getProduktSeite, getAlleKategorien, getAlleMarken, getGefilterteProdukte, getPreisRange } from './Clients/ProduktClient';
import { useProductComparison } from './hooks/ProduktVergleich';

// ERWEITERTE Multi-Zutaten Eingabe Komponente
function MultiZutatenInput({ value, onChange, label }) {
    const [inputValue, setInputValue] = useState('');
    const [zutatenListe, setZutatenListe] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const inputRef = useRef(null);

    // Häufige Zutaten für Vorschläge
    const haeufieZutaten = [
        'Milch', 'MILCH', 'MAGERMILCHPULVER', 'MILCHEIWEISS',
        'Weizen', 'WEIZEN', 'WEIZENMEHL', 'HARTWEIZENGRIESS', 'HARTWEIZENGRIEß',
        'Ei', 'EI', 'EIER', 'EIGELBPULVER',
        'Soja', 'SOJA', 'SOJAMEHL',
        'Nüsse', 'NÜSSE', 'SCHALENFRÜCHTE', 'ERDNÜSSE',
        'Zucker', 'Salz', 'SPEISESALZ', 'Speisesalz',
        'Palmöl', 'Sonnenblumenöl', 'Rapsöl',
        'Konservierungsstoff', 'Antioxidationsmittel',
        'Säuerungsmittel', 'Emulgator',
        'Wasser', 'Alkohol', 'Ethylalkohol',
        'Schweinefleisch', 'Dextrose', 'Gewürze'
    ];

    useEffect(() => {
        if (value) {
            const zutaten = value.split(',').map(z => z.trim()).filter(z => z.length > 0);
            setZutatenListe(zutaten);
        } else {
            setZutatenListe([]);
        }
    }, [value]);

    useEffect(() => {
        if (inputValue.trim().length >= 2) {
            const filtered = haeufieZutaten.filter(zutat =>
                zutat.toLowerCase().includes(inputValue.toLowerCase()) &&
                !zutatenListe.includes(zutat)
            ).slice(0, 8);
            setFilteredOptions(filtered);
            setShowDropdown(filtered.length > 0);
        } else {
            setFilteredOptions([]);
            setShowDropdown(false);
        }
    }, [inputValue, zutatenListe]);

    const addZutat = (zutat) => {
        if (zutat.trim() && !zutatenListe.includes(zutat.trim())) {
            const neueZutaten = [...zutatenListe, zutat.trim()];
            setZutatenListe(neueZutaten);
            onChange(neueZutaten.join(', '));
            setInputValue('');
            setShowDropdown(false);
        }
    };

    const removeZutat = (index) => {
        const neueZutaten = zutatenListe.filter((_, i) => i !== index);
        setZutatenListe(neueZutaten);
        onChange(neueZutaten.join(', '));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addZutat(inputValue);
        }
    };

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-slate-700 mb-2">
                {label}
            </label>

            {zutatenListe.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {zutatenListe.map((zutat, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs
                                                     font-medium bg-blue-100 text-blue-800 border border-blue-200">
                            {zutat}
                            <button
                                onClick={() => removeZutat(index)}
                                className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}

            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => {
                        if (filteredOptions.length > 0) {
                            setShowDropdown(true);
                        }
                    }}
                    onBlur={() => {
                        setTimeout(() => {
                            setShowDropdown(false);
                        }, 150);
                    }}
                    placeholder="Zutat hinzufügen... (Enter oder Komma zum Hinzufügen)"
                    className="w-full px-4 py-3 pr-10 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white
                             transition-all duration-200 text-sm"
                />

                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </div>
            </div>

            {showDropdown && filteredOptions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg
                               backdrop-blur-xl max-h-60 overflow-y-auto">
                    {filteredOptions.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => addZutat(option)}
                            className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors text-slate-900
                                     first:rounded-t-xl last:rounded-b-xl text-sm"
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}

            <div className="mt-2 text-xs text-slate-500">
                💡 Tipp: Mehrere Zutaten mit Komma trennen oder Enter drücken. Alle Zutaten müssen enthalten sein.
            </div>
        </div>
    );
}

// Simple Autocomplete
function SimpleAutocomplete({ value, onChange, options, placeholder, label }) {
    const [inputValue, setInputValue] = useState('');
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    useEffect(() => {
        if (inputValue.trim().length >= 1) {
            const filtered = options.filter(option =>
                option.toLowerCase().includes(inputValue.toLowerCase())
            ).slice(0, 8);
            setFilteredOptions(filtered);
            setShowDropdown(filtered.length > 0);
        } else {
            setFilteredOptions([]);
            setShowDropdown(false);
        }
    }, [inputValue, options]);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleOptionClick = (option) => {
        setInputValue(option);
        onChange(option);
        setShowDropdown(false);
        inputRef.current?.blur();
    };

    const handleFocus = () => {
        if (filteredOptions.length > 0) {
            setShowDropdown(true);
        }
    };

    const handleBlur = () => {
        setTimeout(() => {
            setShowDropdown(false);
        }, 150);
    };

    const clearInput = () => {
        setInputValue('');
        onChange('');
        setShowDropdown(false);
        inputRef.current?.focus();
    };

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-slate-700 mb-2">
                {label}
            </label>

            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 pr-10 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white
                             transition-all duration-200 text-sm"
                />

                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {inputValue ? (
                        <button
                            onClick={clearInput}
                            className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                            type="button"
                        >
                            <svg className="w-4 h-4 text-slate-400 hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    ) : (
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    )}
                </div>
            </div>

            {showDropdown && filteredOptions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg
                               backdrop-blur-xl max-h-60 overflow-y-auto">
                    {filteredOptions.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => handleOptionClick(option)}
                            className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors text-slate-900
                                     first:rounded-t-xl last:rounded-b-xl"
                        >
                            {option}
                        </button>
                    ))}

                    {filteredOptions.length < options.length && (
                        <div className="px-4 py-2 text-xs text-slate-500 bg-slate-50 border-t border-slate-100 rounded-b-xl">
                            {filteredOptions.length} von {options.length} angezeigt
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// NEUE Produktkarte mit Vergleichsfeature
function ProductCard({ produkt, onDetailsClick }) {
    const { addToComparison, comparisonList, canAddMore } = useProductComparison();

    const isInComparison = comparisonList.find(p => p.id === produkt.id);

    const handleAddToComparison = (e) => {
        e.stopPropagation(); // Verhindert das Öffnen der Details
        addToComparison(produkt);
    };

    return (
        <div
            onClick={() => onDetailsClick(produkt.id)}
            className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl p-4
                       hover:bg-white hover:border-slate-300 transition-all duration-200
                       cursor-pointer shadow-sm hover:shadow-md group relative"
        >
            {/* Produktbild */}
            <div className="aspect-square mb-4 bg-slate-50 rounded-lg overflow-hidden">
                <img
                    src={produkt.bildUrl}
                    alt={produkt.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
            </div>

            {/* Produktinfo */}
            <div className="space-y-2">
                <h3 className="font-medium text-slate-900 line-clamp-2 leading-tight text-sm">
                    {produkt.name}
                </h3>

                <p className="text-xs text-slate-600">{produkt.marke}</p>

                {/* Preis und Vergleich Button */}
                <div className="flex items-center justify-between pt-2">
                    <span className="font-bold text-lg text-blue-600">
                        {produkt.preis}€
                    </span>

                    {/* Vergleich Button */}
                    <button
                        onClick={handleAddToComparison}
                        disabled={isInComparison || !canAddMore}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                            isInComparison
                                ? 'bg-green-100 text-green-800 cursor-default'
                                : canAddMore
                                    ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                    : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        }`}
                        title={
                            isInComparison
                                ? 'Bereits im Vergleich'
                                : !canAddMore
                                    ? 'Maximum von 5 Produkten erreicht'
                                    : 'Zum Vergleich hinzufügen'
                        }
                    >
                        {isInComparison ? '✓ Im Vergleich' : 'Vergleichen'}
                    </button>
                </div>

                {/* Kategorie */}
                <div className="pt-1">
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                        {produkt.kategorie?.split(' > ').pop() || 'Unbekannt'}
                    </span>
                </div>

                {/* Nährwerte Preview */}
                <div className="pt-2 text-xs text-slate-500 space-y-1">
                    {produkt.energieKcal && (
                        <div>⚡ {produkt.energieKcal}</div>
                    )}
                    {(produkt.fett || produkt.kohlenhydrate || produkt.eiweiss) && (
                        <div className="flex gap-3">
                            {produkt.fett && <span>🧈 {produkt.fett}</span>}
                            {produkt.kohlenhydrate && <span>🍞 {produkt.kohlenhydrate}</span>}
                            {produkt.eiweiss && <span>🥩 {produkt.eiweiss}</span>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Hauptkomponente
export default function LebensmittelListe() {
    const navigate = useNavigate();
    const [produkte, setProdukte] = useState([]);
    const [kategorien, setKategorien] = useState([]);
    const [marken, setMarken] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filter States
    const [selectedKategorie, setSelectedKategorie] = useState('');
    const [selectedMarke, setSelectedMarke] = useState('');
    const [selectedZutaten, setSelectedZutaten] = useState('');
    const [minPreis, setMinPreis] = useState('');
    const [maxPreis, setMaxPreis] = useState('');

    // Filter UI State
    const [showFilters, setShowFilters] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 20;

    // Preis Range
    const [preisRange, setPreisRange] = useState({ min: 0, max: 100 });

    // Vergleichsfeature
    const { comparisonList } = useProductComparison();

    // Computed: Check if any filters are active
    const hasActiveFilters = selectedKategorie || selectedMarke || selectedZutaten || minPreis || maxPreis;

    useEffect(() => {
        loadKategorien();
        loadMarken();
        loadPreisRange();
        loadProdukte();
    }, []);

    useEffect(() => {
        setCurrentPage(0);
        loadProdukte();
    }, [selectedKategorie, selectedMarke, selectedZutaten, minPreis, maxPreis]);

    useEffect(() => {
        loadProdukte();
    }, [currentPage]);

    const loadKategorien = async () => {
        try {
            const data = await getAlleKategorien();
            setKategorien(data);
        } catch (error) {
            console.error('Fehler beim Laden der Kategorien:', error);
        }
    };

    const loadMarken = async () => {
        try {
            const data = await getAlleMarken();
            setMarken(data);
        } catch (error) {
            console.error('Fehler beim Laden der Marken:', error);
        }
    };

    const loadPreisRange = async () => {
        try {
            const data = await getPreisRange();
            setPreisRange(data);
        } catch (error) {
            console.error('Fehler beim Laden der Preis-Range:', error);
        }
    };

    const loadProdukte = async () => {
        setLoading(true);
        try {
            let data;

            if (hasActiveFilters) {
                console.log('🔍 Lade gefilterte Produkte...');
                console.log('🧪 Zutaten Filter:', selectedZutaten);

                data = await getGefilterteProdukte(
                    selectedKategorie || null,
                    selectedMarke || null,
                    minPreis ? parseFloat(minPreis) : null,
                    maxPreis ? parseFloat(maxPreis) : null,
                    selectedZutaten || null,
                    currentPage,
                    pageSize
                );
            } else {
                data = await getProduktSeite(currentPage, pageSize);
            }

            setProdukte(data.content || []);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0);
        } catch (error) {
            console.error('Fehler beim Laden der Produkte:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetFilters = () => {
        setSelectedKategorie('');
        setSelectedMarke('');
        setSelectedZutaten('');
        setMinPreis('');
        setMaxPreis('');
        setCurrentPage(0);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-thin text-slate-900 mb-2">
                            Lebensmittel<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Katalog</span>
                        </h1>
                        <p className="text-slate-600 font-light">
                            Durchsuche {totalElements.toLocaleString()} Produkte
                            {comparisonList.length > 0 && (
                                <span className="ml-4 text-blue-600 font-medium">
                                    • {comparisonList.length} im Vergleich
                                </span>
                            )}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        {comparisonList.length > 0 && (
                            <button
                                onClick={() => navigate('/vergleich')}
                                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600
                                         transition-all duration-200 shadow-sm font-medium relative"
                            >
                                Vergleich anzeigen
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {comparisonList.length}
                                </span>
                            </button>
                        )}

                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-slate-200
                                       rounded-xl hover:bg-white transition-all duration-200
                                       text-slate-700 hover:text-slate-900 shadow-sm"
                        >
                            ← Zurück zur Suche
                        </button>
                    </div>
                </div>

                {/* Filter Toggle Button */}
                <div className="mb-6">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center justify-between w-full p-4 bg-white/80 backdrop-blur-sm
                                 border border-slate-200 rounded-xl hover:bg-white transition-all duration-200
                                 text-slate-700 hover:text-slate-900 shadow-sm"
                    >
                        <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            <span className="font-medium">Filter & Suche</span>
                            {hasActiveFilters && (
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                    Aktiv
                                </span>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            {hasActiveFilters && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        resetFilters();
                                    }}
                                    className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200
                                             rounded-full transition-colors text-slate-700 hover:text-slate-900"
                                >
                                    Filter zurücksetzen
                                </button>
                            )}

                            <svg
                                className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </button>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="mb-8 p-6 bg-white/80 backdrop-blur-sm border border-slate-200
                                   rounded-xl shadow-sm space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Kategorie Filter */}
                            <SimpleAutocomplete
                                value={selectedKategorie}
                                onChange={setSelectedKategorie}
                                options={kategorien}
                                placeholder="Kategorie wählen..."
                                label="Kategorie"
                            />

                            {/* Marken Filter */}
                            <SimpleAutocomplete
                                value={selectedMarke}
                                onChange={setSelectedMarke}
                                options={marken}
                                placeholder="Marke wählen..."
                                label="Marke"
                            />

                            {/* Preis Min */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Min. Preis (€)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min={preisRange.min}
                                    max={preisRange.max}
                                    value={minPreis}
                                    onChange={(e) => setMinPreis(e.target.value)}
                                    placeholder={`Ab ${preisRange.min}€`}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm
                                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white
                                             transition-all duration-200 text-sm"
                                />
                            </div>

                            {/* Preis Max */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Max. Preis (€)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min={preisRange.min}
                                    max={preisRange.max}
                                    value={maxPreis}
                                    onChange={(e) => setMaxPreis(e.target.value)}
                                    placeholder={`Bis ${preisRange.max}€`}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm
                                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white
                                             transition-all duration-200 text-sm"
                                />
                            </div>
                        </div>

                        {/* Multi-Zutaten Filter - Full Width */}
                        <div className="pt-4 border-t border-slate-200">
                            <MultiZutatenInput
                                value={selectedZutaten}
                                onChange={setSelectedZutaten}
                                label="Zutaten Filter (Erweiterte Suche)"
                            />
                        </div>
                    </div>
                )}

                {/* Results Summary */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="text-sm text-slate-600">
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                Lade Produkte...
                            </span>
                        ) : (
                            <>
                                {totalElements.toLocaleString()} Produkte gefunden
                                {currentPage > 0 && ` • Seite ${currentPage + 1} von ${totalPages}`}
                                {hasActiveFilters && ' • Gefiltert'}
                            </>
                        )}
                    </div>

                    {/* Pagination Info */}
                    {totalPages > 1 && (
                        <div className="text-sm text-slate-500">
                            Zeige {(currentPage * pageSize) + 1} - {Math.min((currentPage + 1) * pageSize, totalElements)} von {totalElements.toLocaleString()}
                        </div>
                    )}
                </div>

                {/* Produktgrid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {produkte.map(produkt => (
                        <ProductCard
                            key={produkt.id}
                            produkt={produkt}
                            onDetailsClick={(id) => navigate(`/produkt/${id}`)}
                        />
                    ))}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-600 font-medium">Lade Produkte...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && produkte.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Keine Produkte gefunden</h3>
                        <p className="text-slate-600 mb-4">
                            {hasActiveFilters
                                ? 'Versuchen Sie andere Suchkriterien oder setzen Sie die Filter zurück.'
                                : 'Es konnten keine Produkte geladen werden.'
                            }
                        </p>
                        {hasActiveFilters && (
                            <button
                                onClick={resetFilters}
                                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600
                                         transition-all duration-200 shadow-sm font-medium"
                            >
                                Filter zurücksetzen
                            </button>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && !loading && (
                    <div className="flex items-center justify-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(0)}
                            disabled={currentPage === 0}
                            className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200
                                     bg-white/80 backdrop-blur-sm hover:bg-white transition-colors
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Erste
                        </button>

                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 0}
                            className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200
                                     bg-white/80 backdrop-blur-sm hover:bg-white transition-colors
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Zurück
                        </button>

                        <span className="px-4 py-2 text-sm font-medium text-slate-700">
                            Seite {currentPage + 1} von {totalPages}
                        </span>

                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage >= totalPages - 1}
                            className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200
                                     bg-white/80 backdrop-blur-sm hover:bg-white transition-colors
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Weiter
                        </button>

                        <button
                            onClick={() => setCurrentPage(totalPages - 1)}
                            disabled={currentPage >= totalPages - 1}
                            className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200
                                     bg-white/80 backdrop-blur-sm hover:bg-white transition-colors
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Letzte
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}