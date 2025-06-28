import axios from "axios";

const BASIS = "http://localhost:8080"

export const sucheProdukte = async (query) => {
  const antwort = await axios.get(`${BASIS}/produkte`, {
    params: { query: query },
  });
  return antwort.data;
};