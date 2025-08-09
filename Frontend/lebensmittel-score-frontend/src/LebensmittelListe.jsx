import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAlleProdukte, getProduktSeite, getAlleKategorien, getAlleMarken, getGefilterteProdukte, getPreisRange } from './Clients/ProduktClient';

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
        // Bei Änderung von außen
        if (value) {
            const zutaten = value.split(',').map(z => z.trim()).filter(z => z.length > 0);
            setZutatenListe(zutaten);
        } else {
            setZutatenListe([]);
        }
    }, [value]);

    useEffect(() => {
        // Vorschläge filtern
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

            {/* Zutat Tags */}
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

            {/* Eingabefeld */}
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

            {/* Dropdown mit Vorschlägen */}
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

            {/* Hilfetexte */}
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

            // Prüfen ob Filter aktiv sind
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
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-slate-200
                                   rounded-xl hover:bg-white transition-all duration-200
                                   text-slate-700 hover:text-slate-900 shadow-sm"
                    >
                        ← Zurück zur Suche
                    </button>
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
                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                                    {[selectedKategorie, selectedMarke, selectedZutaten, minPreis, maxPreis].filter(Boolean).length} aktiv
                                </span>
                            )}
                        </div>
                        <svg
                            className={`w-5 h-5 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>

                {/* Aufklappbare Filter Sektion */}
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    showFilters ? 'max-h-96 opacity-100 mb-8' : 'max-h-0 opacity-0'
                }`}>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-medium text-slate-900">Filter</h2>
                            <button
                                onClick={resetFilters}
                                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg
                                         hover:bg-slate-200 transition-colors text-sm"
                            >
                                Filter zurücksetzen
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Kategorie Filter */}
                            <SimpleAutocomplete
                                value={selectedKategorie}
                                onChange={setSelectedKategorie}
                                options={kategorien}
                                placeholder="Alle Kategorien"
                                label="Kategorie"
                            />

                            {/* Marke Filter */}
                            <SimpleAutocomplete
                                value={selectedMarke}
                                onChange={setSelectedMarke}
                                options={marken}
                                placeholder="Alle Marken"
                                label="Marke"
                            />

                            {/* Preis Filter */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Preisbereich (€)
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="number"
                                        value={minPreis}
                                        onChange={(e) => setMinPreis(e.target.value)}
                                        placeholder={`Min (${preisRange.min}€)`}
                                        min={preisRange.min}
                                        max={preisRange.max}
                                        step="0.01"
                                        className="px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm
                                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                    <input
                                        type="number"
                                        value={maxPreis}
                                        onChange={(e) => setMaxPreis(e.target.value)}
                                        placeholder={`Max (${preisRange.max}€)`}
                                        min={preisRange.min}
                                        max={preisRange.max}
                                        step="0.01"
                                        className="px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm
                                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Multi-Zutaten Filter */}
                        <div className="mt-6">
                            <MultiZutatenInput
                                value={selectedZutaten}
                                onChange={setSelectedZutaten}
                                label="🧪 Zutatenfilter (Multi-Suche)"
                            />
                        </div>
                    </div>
                </div>

                {/* Results Header */}
                {hasActiveFilters && (
                    <div className="mb-6 p-4 bg-blue-50/80 backdrop-blur-sm rounded-xl border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-blue-900">
                                    {loading ? 'Suche läuft...' : `${totalElements} Produkte gefunden`}
                                </h3>
                                <div className="text-sm text-blue-700 mt-1 flex flex-wrap gap-4">
                                    {selectedKategorie && <span className="flex items-center">📁 {selectedKategorie}</span>}
                                    {selectedMarke && <span className="flex items-center">🏷️ {selectedMarke}</span>}
                                    {selectedZutaten && <span className="flex items-center">🧪 Zutaten: {selectedZutaten}</span>}
                                    {(minPreis || maxPreis) && (
                                        <span className="flex items-center">💰 {minPreis || '0'}€ - {maxPreis || '∞'}€</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <span className="ml-4 text-slate-600">Lade Produkte...</span>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-8">
                            {produkte.map((produkt) => (
                                <div
                                    key={produkt.id}
                                    className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/50
                                             shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer
                                             hover:border-blue-200 hover:bg-white group overflow-hidden"
                                    onClick={() => navigate(`/produkt/${produkt.id}`)}
                                >
                                    {/* Product Image - VERKLEINERT */}
                                    <div className="aspect-[4/3] bg-slate-100 rounded-t-xl mb-3 overflow-hidden relative">
                                        {produkt.bildUrl ? (
                                            <img
                                                src={produkt.bildUrl}
                                                alt={produkt.name}
                                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div className={`absolute inset-0 flex items-center justify-center text-slate-400 ${produkt.bildUrl ? 'hidden' : 'flex'}`}>
                                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>

                                        {/* Price Badge */}
                                        {produkt.preis && (
                                            <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-sm
                                                          rounded-lg text-sm font-semibold text-blue-600 shadow-sm">
                                                {produkt.preis}€
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4 pt-0">
                                        <h3 className="font-medium text-slate-900 mb-2 line-clamp-2 text-sm leading-tight">
                                            {produkt.name}
                                        </h3>

                                        <div className="text-xs text-slate-600 mb-3 truncate">
                                            {produkt.marke}
                                        </div>

                                        {/* Nutrition Info */}
                                        <div className="flex items-center justify-between">
                                            {produkt.energieKcal && (
                                                <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                                    {produkt.energieKcal}
                                                </div>
                                            )}

                                            {/* Hover Arrow */}
                                            <div className="text-slate-400 group-hover:text-blue-500 transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Zutaten Preview - nur wenn Zutatenfilter aktiv */}
                                        {produkt.zutaten && selectedZutaten && (
                                            <div className="mt-3 pt-3 border-t border-slate-200">
                                                <div className="text-xs text-slate-500 line-clamp-2">
                                                    🧪 {produkt.zutaten.substring(0, 80)}...
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center space-x-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                                    disabled={currentPage === 0}
                                    className="px-4 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm
                                             disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors
                                             flex items-center space-x-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    <span>Zurück</span>
                                </button>

                                <div className="flex items-center space-x-2">
                                    <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium">
                                        {currentPage + 1}
                                    </span>
                                    <span className="text-slate-500">von</span>
                                    <span className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg">
                                        {totalPages}
                                    </span>
                                </div>

                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                                    disabled={currentPage >= totalPages - 1}
                                    className="px-4 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm
                                             disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors
                                             flex items-center space-x-2"
                                >
                                    <span>Weiter</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* No Results */}
                        {!loading && produkte.length === 0 && (
                            <div className="text-center py-16">
                                <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="text-xl font-medium text-slate-900 mb-2">Keine Produkte gefunden</h3>
                                <p className="text-slate-600 mb-4">
                                    Versuche andere Suchkriterien oder entferne einige Filter.
                                </p>
                                {hasActiveFilters && (
                                    <button
                                        onClick={resetFilters}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Alle Filter zurücksetzen
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}