
import axios from "axios";

const BASIS = "http://localhost:8080"

export const sucheProdukte = async (query) => {
    const antwort = await axios.get(`${BASIS}/produkte`, {
        params: { query: query },
    });
    return antwort.data;
};

export const getAlleProdukte = async () => {
    const antwort = await axios.get(`${BASIS}/produkte/alle`);
    return antwort.data;
};

export const getProduktSeite = async (page = 0, size = 10) => {
    const antwort = await axios.get(`${BASIS}/produkte/seite`, {
        params: {
            page: page,
            size: size
        },
    });
    return antwort.data;
};

export const getAlleKategorien = async () => {
    const antwort = await axios.get(`${BASIS}/produkte/kategorien`);
    return antwort.data;
};

export const getAlleMarken = async () => {
    const antwort = await axios.get(`${BASIS}/produkte/marken`);
    return antwort.data;
};

// Korrigierte gefilterte Suche - BASE_URL zu BASIS geändert
export const getGefilterteProdukte = async (kategorie, marke, minPreis, maxPreis, zutat, page, size) => {
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString()
    });

    if (kategorie) params.append('kategorie', kategorie);
    if (marke) params.append('marke', marke);
    if (minPreis !== null && minPreis !== undefined) params.append('minPreis', minPreis.toString());
    if (maxPreis !== null && maxPreis !== undefined) params.append('maxPreis', maxPreis.toString());
    if (zutat && zutat.trim() !== '') params.append('zutat', zutat.trim());

    console.log('API Call params:', params.toString()); // Debug-Log

    const response = await fetch(`${BASIS}/produkte/gefiltert?${params}`);
    const data = await response.json();

    console.log('API Response:', data); // Debug-Log

    return data;
};

// Preis-Range laden
export const getPreisRange = async () => {
    const antwort = await axios.get(`${BASIS}/produkte/preis-range`);
    return antwort.data;
};