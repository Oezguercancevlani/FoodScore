import { Routes, Route } from "react-router-dom";
import Suche from "./Suche";
import ProduktDetails from "./ProduktDetails"; // Diese Datei erstellst du gleich

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<Suche />} />
        <Route path="/produkt/:id" element={<ProduktDetails />} />
      </Routes>
  );
}
