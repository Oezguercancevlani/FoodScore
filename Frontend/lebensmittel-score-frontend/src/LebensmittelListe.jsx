import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAlleProdukte, getProduktSeite, getAlleKategorien, getAlleMarken, getGefilterteProdukte, getPreisRange } from './Clients/ProduktClient';

// Simple Autocomplete (gleich wie vorher)
function SimpleAutocomplete({ value, onChange, options, placeholder, label }) {
    // ... (gleicher Code wie vorher)
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

// VERBESSERTE PriceRangeSlider Komponente
function PriceRangeSlider({ minValue, maxValue, currentMin, currentMax, onChange }) {
    const [minVal, setMinVal] = useState(currentMin);
    const [maxVal, setMaxVal] = useState(currentMax);
    const [isDragging, setIsDragging] = useState(false);
    const minRangeRef = useRef(null);
    const maxRangeRef = useRef(null);

    useEffect(() => {
        setMinVal(currentMin);
        setMaxVal(currentMax);
    }, [currentMin, currentMax]);

    // Debounced onChange für bessere Performance
    const debouncedOnChange = useRef();
    useEffect(() => {
        clearTimeout(debouncedOnChange.current);
        debouncedOnChange.current = setTimeout(() => {
            if (!isDragging) {
                onChange(minVal, maxVal);
            }
        }, 300);
    }, [minVal, maxVal, isDragging]);

    const handleMinChange = (e) => {
        const value = Math.min(Number(e.target.value), maxVal - 0.01);
        setMinVal(value);
        if (isDragging) {
            onChange(value, maxVal);
        }
    };

    const handleMaxChange = (e) => {
        const value = Math.max(Number(e.target.value), minVal + 0.01);
        setMaxVal(value);
        if (isDragging) {
            onChange(minVal, value);
        }
    };

    const handleMinInputChange = (e) => {
        const value = e.target.value;
        if (value === '') {
            setMinVal(minValue);
            return;
        }

        const numValue = Number(value);
        if (!isNaN(numValue)) {
            const clampedValue = Math.max(minValue, Math.min(numValue, maxVal - 0.01));
            setMinVal(clampedValue);
        }
    };

    const handleMaxInputChange = (e) => {
        const value = e.target.value;
        if (value === '') {
            setMaxVal(maxValue);
            return;
        }

        const numValue = Number(value);
        if (!isNaN(numValue)) {
            const clampedValue = Math.min(maxValue, Math.max(numValue, minVal + 0.01));
            setMaxVal(clampedValue);
        }
    };

    const handleInputBlur = () => {
        onChange(minVal, maxVal);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onChange(minVal, maxVal);
            e.target.blur();
        }
    };

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        onChange(minVal, maxVal);
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
                💰 Preisbereich
            </label>

            {/* Input Fields */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs text-slate-500 mb-1">Von</label>
                    <div className="relative">
                        <input
                            type="number"
                            step="0.01"
                            min={minValue}
                            max={maxValue}
                            value={minVal.toFixed(2)}
                            onChange={handleMinInputChange}
                            onBlur={handleInputBlur}
                            onKeyPress={handleKeyPress}
                            className="w-full px-3 py-2 pr-6 text-sm border border-slate-200 rounded-lg bg-white/80
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">€</span>
                    </div>
                </div>
                <div>
                    <label className="block text-xs text-slate-500 mb-1">Bis</label>
                    <div className="relative">
                        <input
                            type="number"
                            step="0.01"
                            min={minValue}
                            max={maxValue}
                            value={maxVal.toFixed(2)}
                            onChange={handleMaxInputChange}
                            onBlur={handleInputBlur}
                            onKeyPress={handleKeyPress}
                            className="w-full px-3 py-2 pr-6 text-sm border border-slate-200 rounded-lg bg-white/80
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">€</span>
                    </div>
                </div>
            </div>

            {/* Range Slider - Verbessert */}
            <div className="relative mt-6">
                <div className="relative h-2 bg-slate-200 rounded-lg">
                    {/* Active Range */}
                    <div
                        className="absolute h-full bg-blue-500 rounded-lg transition-all duration-100"
                        style={{
                            left: `${((minVal - minValue) / (maxValue - minValue)) * 100}%`,
                            width: `${((maxVal - minVal) / (maxValue - minValue)) * 100}%`
                        }}
                    />
                </div>

                {/* Slider Container */}
                <div className="relative -mt-2">
                    {/* Min Range Input */}
                    <input
                        ref={minRangeRef}
                        type="range"
                        min={minValue}
                        max={maxValue}
                        step="0.01"
                        value={minVal}
                        onChange={handleMinChange}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onTouchStart={handleMouseDown}
                        onTouchEnd={handleMouseUp}
                        className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-20
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
                     [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:hover:bg-blue-600
                     [&::-webkit-slider-thumb]:transition-colors [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
                     [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:bg-blue-500
                     [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none
                     [&::-moz-range-track]:bg-transparent [&::-moz-range-track]:h-0"
                        style={{ zIndex: minVal > maxVal - (maxValue - minValue) * 0.05 ? 25 : 20 }}
                    />

                    {/* Max Range Input */}
                    <input
                        ref={maxRangeRef}
                        type="range"
                        min={minValue}
                        max={maxValue}
                        step="0.01"
                        value={maxVal}
                        onChange={handleMaxChange}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onTouchStart={handleMouseDown}
                        onTouchEnd={handleMouseUp}
                        className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-21
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
                     [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:hover:bg-blue-600
                     [&::-webkit-slider-thumb]:transition-colors [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
                     [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:bg-blue-500
                     [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none
                     [&::-moz-range-track]:bg-transparent [&::-moz-range-track]:h-0"
                    />
                </div>
            </div>

            {/* Display Values */}
            <div className="flex justify-between text-sm text-slate-600 pt-2">
                <span className="font-medium">{minVal.toFixed(2)}€</span>
                <span className="font-medium">{maxVal.toFixed(2)}€</span>
            </div>

            {/* Optional: Range Info */}
            <div className="text-xs text-slate-400 text-center">
                Spanne: {(maxVal - minVal).toFixed(2)}€
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

    const [preisBounds, setPreisBounds] = useState({ min: 0, max: 100 });
    const [selectedMinPreis, setSelectedMinPreis] = useState(0);
    const [selectedMaxPreis, setSelectedMaxPreis] = useState(100);

    const [filtersVisible, setFiltersVisible] = useState(false);

    // Filter-Daten laden (einschließlich Preis-Range)
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

    const fetchProdukte = async (page = 0, kategorie = selectedKategorie, marke = selectedMarke, minPreis = selectedMinPreis, maxPreis = selectedMaxPreis) => {
        setLoading(true);
        try {
            let data;

            // Prüfen ob Standard-Range oder gefiltert
            const isMinFiltered = minPreis > preisBounds.min;
            const isMaxFiltered = maxPreis < preisBounds.max;

            if (kategorie || marke || isMinFiltered || isMaxFiltered) {
                data = await getGefilterteProdukte(
                    kategorie || null,
                    marke || null,
                    isMinFiltered ? minPreis : null,
                    isMaxFiltered ? maxPreis : null,
                    page,
                    pageSize
                );
            } else {
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
        if (preisBounds.min !== 0 || preisBounds.max !== 100) { // Warten bis Preis-Bounds geladen sind
            fetchProdukte(0);
        }
    }, [selectedKategorie, selectedMarke, selectedMinPreis, selectedMaxPreis, preisBounds]);

    const goToPage = (page) => {
        fetchProdukte(page);
    };

    const goToDetails = (produktId) => {
        navigate(`/produkt/${produktId}`);
    };

    const clearFilters = () => {
        setSelectedKategorie('');
        setSelectedMarke('');
        setSelectedMinPreis(preisBounds.min);
        setSelectedMaxPreis(preisBounds.max);
    };

    const handlePriceChange = (minPreis, maxPreis) => {
        setSelectedMinPreis(minPreis);
        setSelectedMaxPreis(maxPreis);
    };

    const hasActiveFilters = selectedKategorie || selectedMarke ||
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
                        (selectedMinPreis > preisBounds.min || selectedMaxPreis < preisBounds.max ? 1 : 0)}
                  </span>
                                )}
                            </button>
                        </div>

                        {/* Filter-Bereich MIT PREIS */}
                        {filtersVisible && (
                            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">

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

                                    {/* VERBESSERTE Preis-Range Filter */}
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
                                            {(selectedKategorie || selectedMarke) && (selectedMinPreis > preisBounds.min || selectedMaxPreis < preisBounds.max) && ' • '}
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

                {/* Products Grid (gleich wie vorher) */}
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

                {/* Pagination (gleich wie vorher) */}
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