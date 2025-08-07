
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

// ERWEITERTE gefilterte Suche mit Preis
export const getGefilterteProdukte = async (kategorie = null, marke = null, minPreis = null, maxPreis = null, page = 0, size = 18) => {
    const antwort = await axios.get(`${BASIS}/produkte/gefiltert`, {
        params: {
            kategorie: kategorie,
            marke: marke,
            minPreis: minPreis,
            maxPreis: maxPreis,
            page: page,
            size: size
        }
    });
    return antwort.data;
};

// NEUE Preis-Range laden
export const getPreisRange = async () => {
    const antwort = await axios.get(`${BASIS}/produkte/preis-range`);
    return antwort.data;
};