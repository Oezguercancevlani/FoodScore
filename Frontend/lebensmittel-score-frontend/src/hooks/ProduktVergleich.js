import { useState, useCallback, useEffect } from 'react';
import { vergleicheProdukte } from '../Clients/VergleichsClient';

export const useProductComparison = () => {
    // Lokaler State mit Persistierung
    const [comparisonList, setComparisonList] = useState(() => {
        const saved = localStorage.getItem('productComparison');
        return saved ? JSON.parse(saved) : [];
    });

    const [comparisonData, setComparisonData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Lokalen Storage bei Änderungen aktualisieren
    useEffect(() => {
        localStorage.setItem('productComparison', JSON.stringify(comparisonList));
    }, [comparisonList]);

    const addToComparison = useCallback((product) => {
        setComparisonList(prev => {
            // Prüfen ob Produkt bereits in der Liste
            if (prev.find(p => p.id === product.id)) {
                return prev;
            }
            // Maximal 5 Produkte
            if (prev.length >= 5) {
                alert('Maximal 5 Produkte können verglichen werden!');
                return prev;
            }
            return [...prev, product];
        });
    }, []);

    const removeFromComparison = useCallback((productId) => {
        setComparisonList(prev => prev.filter(p => p.id !== productId));
        // Reset comparison data wenn Produkte entfernt werden
        setComparisonData(null);
    }, []);

    const clearComparison = useCallback(() => {
        setComparisonList([]);
        setComparisonData(null);
        setError(null);
    }, []);

    const compareProducts = useCallback(async () => {
        if (comparisonList.length < 2) {
            setError('Mindestens 2 Produkte werden für einen Vergleich benötigt');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const productIds = comparisonList.map(p => p.id);
            const response = await vergleicheProdukte(productIds);
            setComparisonData(response);
        } catch (error) {
            console.error('Fehler beim Produktvergleich:', error);
            setError('Fehler beim Laden des Vergleichs. Bitte versuchen Sie es erneut.');
        } finally {
            setLoading(false);
        }
    }, [comparisonList]);

    // Automatischer Vergleich bei Änderungen der Liste
    useEffect(() => {
        if (comparisonList.length >= 2) {
            compareProducts();
        } else {
            setComparisonData(null);
        }
    }, [comparisonList, compareProducts]);

    return {
        comparisonList,
        comparisonData,
        loading,
        error,
        addToComparison,
        removeFromComparison,
        clearComparison,
        compareProducts,
        canAddMore: comparisonList.length < 5
    };
};