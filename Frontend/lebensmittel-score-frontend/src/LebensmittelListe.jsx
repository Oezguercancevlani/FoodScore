
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAlleProdukte, getProduktSeite, getAlleKategorien, getAlleMarken, getGefilterteProdukte, getPreisRange } from './Clients/ProduktClient';

// Simple Autocomplete (unverändert)
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

// ERWEITERTE Zutaten-Autocomplete mit häufigen Zutaten
function ZutatenAutocomplete({ value, onChange, label }) {
    // Häufige Zutaten aus Ihren Daten
    const haeufieZutaten = [
        'Milch', 'MILCH', 'MAGERMILCHPULVER', 'MILCHEIWEISS',
        'Weizen', 'WEIZEN', 'WEIZENMEHL', 'HARTWEIZENGRIESS',
        'Ei', 'EI', 'EIER', 'EIGELBPULVER',
        'Soja', 'SOJA', 'SOJAMEHL',
        'Nüsse', 'NÜSSE', 'SCHALENFRÜCHTE', 'ERDNÜSSE',
        'Zucker', 'Salz', 'SPEISESALZ',
        'Palmöl', 'Sonnenblumenöl', 'Rapsöl',
        'Konservierungsstoff', 'Antioxidationsmittel',
        'Säuerungsmittel', 'Emulgator',
        'Wasser', 'Alkohol', 'Ethylalkohol'
    ];

    const [inputValue, setInputValue] = useState('');
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    useEffect(() => {
        if (inputValue.trim().length >= 2) {
            const filtered = haeufieZutaten.filter(zutat =>
                zutat.toLowerCase().includes(inputValue.toLowerCase())
            ).slice(0, 6);
            setFilteredOptions(filtered);
            setShowDropdown(filtered.length > 0);
        } else {
            setFilteredOptions([]);
            setShowDropdown(false);
        }
    }, [inputValue]);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onChange(inputValue.trim());
            setShowDropdown(false);
            e.target.blur();
        }
    };

    const handleBlur = () => {
        setTimeout(() => {
            setShowDropdown(false);
            onChange(inputValue.trim());
        }, 150);
    };

    const handleOptionClick = (option) => {
        setInputValue(option);
        onChange(option);
        setShowDropdown(false);
        inputRef.current?.blur();
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
                    onKeyPress={handleKeyPress}
                    onBlur={handleBlur}
                    onFocus={() => {
                        if (filteredOptions.length > 0) {
                            setShowDropdown(true);
                        }
                    }}
                    placeholder="z.B. Milch, Weizen, Nüsse..."
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
                       first:rounded-t-xl last:rounded-b-xl text-sm"
                        >
                            {option}
                        </button>
                    ))}

                    <div className="px-4 py-2 text-xs text-slate-500 bg-slate-50 border-t border-slate-100 rounded-b-xl">
                        Enter drücken für "{inputValue}"
                    </div>
                </div>
            )}

            {inputValue && !showDropdown && (
                <div className="mt-1 text-xs text-slate-500">
                    Enter drücken oder Feld verlassen zum Suchen
                </div>
            )}
        </div>
    );
}

// PriceRangeSlider (unverändert)
function PriceRangeSlider({ minValue, maxValue, currentMin, currentMax, onChange }) {
    const [minVal, setMinVal] = useState(currentMin);
    const [maxVal, setMaxVal] = useState(currentMax);
    const [minInput, setMinInput] = useState('');
    const [maxInput, setMaxInput] = useState('');

    useEffect(() => {
        setMinVal(currentMin);
        setMaxVal(currentMax);
        setMinInput(currentMin.toFixed(2));
        setMaxInput(currentMax.toFixed(2));
    }, [currentMin, currentMax]);

    const handleMinInputChange = (e) => {
        const value = e.target.value;
        if (/^[\d.,]*$/.test(value)) {
            setMinInput(value);
        }
    };

    const handleMaxInputChange = (e) => {
        const value = e.target.value;
        if (/^[\d.,]*$/.test(value)) {
            setMaxInput(value);
        }
    };

    const handleMinInputBlur = () => {
        let value = parseFloat(minInput.replace(',', '.'));

        if (isNaN(value) || value < minValue) {
            value = minValue;
        } else if (value >= maxVal) {
            value = Math.max(minValue, maxVal - 0.01);
        }

        value = Math.max(minValue, Math.min(maxValue, value));
        setMinVal(value);
        setMinInput(value.toFixed(2));
        onChange(value, maxVal);
    };

    const handleMaxInputBlur = () => {
        let value = parseFloat(maxInput.replace(',', '.'));

        if (isNaN(value) || value > maxValue) {
            value = maxValue;
        } else if (value <= minVal) {
            value = Math.min(maxValue, minVal + 0.01);
        }

        value = Math.max(minValue, Math.min(maxValue, value));
        setMaxVal(value);
        setMaxInput(value.toFixed(2));
        onChange(minVal, value);
    };

    const handleKeyPress = (e, isMin) => {
        if (e.key === 'Enter') {
            if (isMin) {
                handleMinInputBlur();
            } else {
                handleMaxInputBlur();
            }
            e.target.blur();
        }
    };

    const handleMinSliderChange = (e) => {
        const value = Math.min(Number(e.target.value), maxVal - 0.01);
        setMinVal(value);
        setMinInput(value.toFixed(2));
        onChange(value, maxVal);
    };

    const handleMaxSliderChange = (e) => {
        const value = Math.max(Number(e.target.value), minVal + 0.01);
        setMaxVal(value);
        setMaxInput(value.toFixed(2));
        onChange(minVal, value);
    };

    const leftPercent = ((minVal - minValue) / (maxValue - minValue)) * 100;
    const rightPercent = ((maxVal - minValue) / (maxValue - minValue)) * 100;

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
                💰 Preisbereich
            </label>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs text-slate-500 mb-1">Von</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={minInput}
                            onChange={handleMinInputChange}
                            onBlur={handleMinInputBlur}
                            onKeyPress={(e) => handleKeyPress(e, true)}
                            placeholder="0,00"
                            className="w-full px-3 py-2 pr-8 text-sm border border-slate-200 rounded-lg bg-white/80
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        <span className="absolute right-3 top-2 text-xs text-slate-400">€</span>
                    </div>
                </div>
                <div>
                    <label className="block text-xs text-slate-500 mb-1">Bis</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={maxInput}
                            onChange={handleMaxInputChange}
                            onBlur={handleMaxInputBlur}
                            onKeyPress={(e) => handleKeyPress(e, false)}
                            placeholder="1000,00"
                            className="w-full px-3 py-2 pr-8 text-sm border border-slate-200 rounded-lg bg-white/80
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        <span className="absolute right-3 top-2 text-xs text-slate-400">€</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4 mt-6">
                <div className="relative h-2 bg-slate-200 rounded-full">
                    <div
                        className="absolute h-full bg-blue-500 rounded-full transition-all duration-150"
                        style={{
                            left: `${leftPercent}%`,
                            width: `${rightPercent - leftPercent}%`
                        }}
                    />
                </div>

                <div>
                    <label className="block text-xs text-slate-500 mb-1">
                        Minimum: {minVal.toFixed(2)}€
                    </label>
                    <input
                        type="range"
                        min={minValue}
                        max={maxValue}
                        step="0.01"
                        value={minVal}
                        onChange={handleMinSliderChange}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer
                                   [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
                                   [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full
                                   [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
                                   [&::-webkit-slider-thumb]:hover:bg-blue-600 [&::-webkit-slider-thumb]:transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-xs text-slate-500 mb-1">
                        Maximum: {maxVal.toFixed(2)}€
                    </label>
                    <input
                        type="range"
                        min={minValue}
                        max={maxValue}
                        step="0.01"
                        value={maxVal}
                        onChange={handleMaxSliderChange}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer
                                   [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
                                   [&::-webkit-slider-thumb]:bg-green-500 [&::-webkit-slider-thumb]:rounded-full
                                   [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
                                   [&::-webkit-slider-thumb]:hover:bg-green-600 [&::-webkit-slider-thumb]:transition-colors"
                    />
                </div>
            </div>

            <div className="flex justify-between text-sm text-slate-600 pt-2 bg-slate-50 rounded-lg px-3 py-2">
                <span className="font-medium text-blue-600">Min: {minVal.toFixed(2)}€</span>
                <span className="font-medium text-green-600">Max: {maxVal.toFixed(2)}€</span>
            </div>
        </div>
    );
}

export default function LebensmittelListe() {
    const [produkte, setProdukte] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Pagination State
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize] = useState(18);

    const [kategorien, setKategorien] = useState([]);
    const [marken, setMarken] = useState([]);
    const [selectedKategorie, setSelectedKategorie] = useState('');
    const [selectedMarke, setSelectedMarke] = useState('');
    const [selectedZutat, setSelectedZutat] = useState('');

    const [preisBounds, setPreisBounds] = useState({ min: 0, max: 100 });
    const [selectedMinPreis, setSelectedMinPreis] = useState(0);
    const [selectedMaxPreis, setSelectedMaxPreis] = useState(100);

    const [filtersVisible, setFiltersVisible] = useState(false);

    // Filter-Daten laden
    useEffect(() => {
        const loadFilters = async () => {
            try {
                const [kategorienData, markenData, preisRangeData] = await Promise.all([
                    getAlleKategorien(),
                    getAlleMarken(),
                    getPreisRange()
                ]);
                setKategorien(kategorienData);
                setMarken(markenData);
                setPreisBounds({ min: preisRangeData.min, max: preisRangeData.max });
                setSelectedMinPreis(preisRangeData.min);
                setSelectedMaxPreis(preisRangeData.max);
            } catch (error) {
                console.error('Fehler beim Laden der Filter:', error);
            }
        };
        loadFilters();
    }, []);

    const fetchProdukte = async (page = 0, kategorie = selectedKategorie, marke = selectedMarke, minPreis = selectedMinPreis, maxPreis = selectedMaxPreis, zutat = selectedZutat) => {
        setLoading(true);
        console.log('Fetch Produkte with:', { kategorie, marke, minPreis, maxPreis, zutat, page }); // DEBUG

        try {
            let data;

            const isMinFiltered = minPreis > preisBounds.min;
            const isMaxFiltered = maxPreis < preisBounds.max;

            if (kategorie || marke || isMinFiltered || isMaxFiltered || zutat) {
                console.log('Using filtered search'); // DEBUG
                data = await getGefilterteProdukte(
                    kategorie || null,
                    marke || null,
                    isMinFiltered ? minPreis : null,
                    isMaxFiltered ? maxPreis : null,
                    zutat || null,
                    page,
                    pageSize
                );
            } else {
                console.log('Using unfiltered search'); // DEBUG
                data = await getProduktSeite(page, pageSize);
            }

            setProdukte(data.content);
            setCurrentPage(data.pageable.pageNumber);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch (error) {
            console.error('Fehler beim Laden der Produkte:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (preisBounds.min !== 0 || preisBounds.max !== 100) {
            fetchProdukte(0);
        }
    }, [selectedKategorie, selectedMarke, selectedMinPreis, selectedMaxPreis, selectedZutat, preisBounds]);

    const goToPage = (page) => {
        fetchProdukte(page);
    };

    const goToDetails = (produktId) => {
        navigate(`/produkt/${produktId}`);
    };

    const clearFilters = () => {
        setSelectedKategorie('');
        setSelectedMarke('');
        setSelectedZutat('');
        setSelectedMinPreis(preisBounds.min);
        setSelectedMaxPreis(preisBounds.max);
    };

    const handlePriceChange = (minPreis, maxPreis) => {
        setSelectedMinPreis(minPreis);
        setSelectedMaxPreis(maxPreis);
    };

    const hasActiveFilters = selectedKategorie || selectedMarke || selectedZutat ||
        selectedMinPreis > preisBounds.min ||
        selectedMaxPreis < preisBounds.max;

    if (loading && produkte.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Laden...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <div className="bg-white/70 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex flex-col gap-4">

                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-thin text-slate-900">Lebensmittel</h1>
                                <p className="text-slate-600 font-light">
                                    {totalElements} Produkte
                                    {hasActiveFilters && ' (gefiltert)'}
                                    • Seite {currentPage + 1} von {totalPages}
                                </p>
                            </div>

                            <button
                                onClick={() => setFiltersVisible(!filtersVisible)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 border
                           ${filtersVisible
                                    ? 'bg-blue-500 text-white border-blue-500'
                                    : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-white'}`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                                </svg>
                                Filter
                                {hasActiveFilters && (
                                    <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                    {(selectedKategorie ? 1 : 0) +
                        (selectedMarke ? 1 : 0) +
                        (selectedZutat ? 1 : 0) +
                        (selectedMinPreis > preisBounds.min || selectedMaxPreis < preisBounds.max ? 1 : 0)}
                  </span>
                                )}
                            </button>
                        </div>

                        {filtersVisible && (
                            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">

                                    <SimpleAutocomplete
                                        value={selectedKategorie}
                                        onChange={setSelectedKategorie}
                                        options={kategorien}
                                        placeholder="Tippen Sie um zu suchen..."
                                        label="🏷️ Kategorie"
                                    />

                                    <SimpleAutocomplete
                                        value={selectedMarke}
                                        onChange={setSelectedMarke}
                                        options={marken}
                                        placeholder="Tippen Sie um zu suchen..."
                                        label="🏭 Marke"
                                    />

                                    {/* ERWEITERTE Zutaten-Suche mit Autocomplete */}
                                    <ZutatenAutocomplete
                                        value={selectedZutat}
                                        onChange={setSelectedZutat}
                                        label="🥕 Zutaten"
                                    />

                                    <PriceRangeSlider
                                        minValue={preisBounds.min}
                                        maxValue={preisBounds.max}
                                        currentMin={selectedMinPreis}
                                        currentMax={selectedMaxPreis}
                                        onChange={handlePriceChange}
                                    />
                                </div>

                                <div className="flex gap-3 flex-wrap">
                                    <button
                                        onClick={clearFilters}
                                        disabled={!hasActiveFilters}
                                        className="flex items-center gap-2 px-4 py-2 text-sm border border-slate-200 rounded-lg
                             hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed
                             transition-colors bg-white/80"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Alle Filter zurücksetzen
                                    </button>

                                    {hasActiveFilters && (
                                        <div className="flex items-center gap-2 text-sm text-slate-600 bg-blue-50 px-3 py-2 rounded-lg">
                                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {selectedKategorie && `Kategorie: ${selectedKategorie}`}
                                            {selectedKategorie && selectedMarke && ' • '}
                                            {selectedMarke && `Marke: ${selectedMarke}`}
                                            {(selectedKategorie || selectedMarke) && selectedZutat && ' • '}
                                            {selectedZutat && `Zutat: ${selectedZutat}`}
                                            {(selectedKategorie || selectedMarke || selectedZutat) && (selectedMinPreis > preisBounds.min || selectedMaxPreis < preisBounds.max) && ' • '}
                                            {(selectedMinPreis > preisBounds.min || selectedMaxPreis < preisBounds.max) &&
                                                `Preis: ${selectedMinPreis.toFixed(2)}€ - ${selectedMaxPreis.toFixed(2)}€`}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {produkte.map(produkt => (
                        <div
                            key={produkt.id}
                            onClick={() => goToDetails(produkt.id)}
                            className="group bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/50 hover:border-slate-300/80
                         shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer
                         hover:scale-[1.02] hover:-translate-y-1 overflow-hidden"
                        >
                            <div className="w-full h-32 bg-white relative overflow-hidden rounded-t-xl">
                                {produkt.bildUrl ? (
                                    <img
                                        src={produkt.bildUrl}
                                        alt={produkt.name}
                                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-2"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                                            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                )}

                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
                                    <span className="text-xs font-semibold text-slate-900">{produkt.preis}€</span>
                                </div>
                            </div>

                            <div className="p-3">
                                <h3 className="font-medium text-slate-900 mb-1 text-sm line-clamp-2 leading-tight">
                                    {produkt.name}
                                </h3>

                                <p className="text-xs text-slate-600 mb-2 font-medium truncate">
                                    {produkt.marke}
                                </p>

                                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full truncate max-w-[100px]">
                    {produkt.kategorie}
                  </span>

                                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-12 flex justify-center items-center gap-2">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 0}
                        className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200
                     hover:bg-white hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 flex items-center justify-center group"
                    >
                        <svg className="w-4 h-4 text-slate-700 group-disabled:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div className="flex gap-2 mx-4">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = currentPage - 2 + i;
                            if (pageNum < 0 || pageNum >= totalPages) return null;

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => goToPage(pageNum)}
                                    className={`w-10 h-10 rounded-full transition-all duration-200 font-medium text-sm
                            ${pageNum === currentPage
                                        ? 'bg-blue-500 text-white shadow-lg'
                                        : 'bg-white/80 backdrop-blur-sm border border-slate-200 hover:bg-white hover:border-slate-300 text-slate-700'
                                    }`}
                                >
                                    {pageNum + 1}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage >= totalPages - 1}
                        className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200
                     hover:bg-white hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 flex items-center justify-center group"
                    >
                        <svg className="w-4 h-4 text-slate-700 group-disabled:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                <div className="h-8"></div>
            </div>
        </div>
    );
}