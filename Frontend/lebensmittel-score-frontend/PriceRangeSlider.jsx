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


            <div className="relative mt-6">
                <div className="relative h-2 bg-slate-200 rounded-lg">
                    {/* Active Range */}
                    <div
                        className="absolute h-full bg-blue-500 rounded-lg transition-all duration-150"
                        style={{
                            left: `${((minVal - minValue) / (maxValue - minValue)) * 100}%`,
                            width: `${((maxVal - minVal) / (maxValue - minValue)) * 100}%`
                        }}
                    />


                    <input
                        type="range"
                        min={minValue}
                        max={maxValue}
                        step="0.01"
                        value={minVal}
                        onChange={handleMinSliderChange}
                        className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-20
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
                           [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2
                           [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:rounded-full
                           [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
                           [&::-webkit-slider-thumb]:hover:bg-blue-50 [&::-webkit-slider-thumb]:transition-colors"
                        style={{ pointerEvents: 'all' }}
                    />


                    <input
                        type="range"
                        min={minValue}
                        max={maxValue}
                        step="0.01"
                        value={maxVal}
                        onChange={handleMaxSliderChange}
                        className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-10
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
                           [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2
                           [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:rounded-full
                           [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
                           [&::-webkit-slider-thumb]:hover:bg-blue-50 [&::-webkit-slider-thumb]:transition-colors"
                        style={{ pointerEvents: 'all' }}
                    />
                </div>
            </div>


            <div className="flex justify-between text-sm text-slate-600 pt-2">
                <span className="font-medium">{minVal.toFixed(2)}€</span>
                <span className="font-medium">{maxVal.toFixed(2)}€</span>
            </div>
        </div>
    );
}