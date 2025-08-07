import { Routes, Route, Link, useLocation } from "react-router-dom";
import Suche from "./Suche";
import ProduktDetails from "./ProduktDetails";
import LebensmittelListe from './LebensmittelListe';

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Apple-like Navigation */}
      <nav className="bg-white/70 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">

            {/* Logo/Brand */}
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-thin text-slate-900 tracking-tight">
                Food<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Score</span>
              </h1>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                           ${location.pathname === '/'
                             ? 'bg-slate-900 text-white shadow-lg'
                             : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                Suche
              </Link>

              <Link
                to="/lebensmittel"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                           ${location.pathname === '/lebensmittel'
                             ? 'bg-slate-900 text-white shadow-lg'
                             : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                Alle Produkte
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <Routes>
        <Route path="/" element={<Suche />} />
        <Route path="/lebensmittel" element={<LebensmittelListe />} />
        <Route path="/produkt/:id" element={<ProduktDetails />} />
      </Routes>
    </div>
  );
}