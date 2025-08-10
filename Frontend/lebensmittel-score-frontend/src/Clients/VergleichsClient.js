import axios from "axios";

const BASIS = "http://localhost:8080";

export const vergleicheProdukte = async (produktIds) => {
    try {
        const response = await axios.post(`${BASIS}/vergleich/produkte`, produktIds, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Fehler beim Produktvergleich:', error);
        throw error;
    }
};

export const testVergleichEndpoint = async () => {
    try {
        const response = await axios.get(`${BASIS}/vergleich/test`);
        return response.data;
    } catch (error) {
        console.error('Fehler beim Test des Vergleich-Endpoints:', error);
        throw error;
    }
};