import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';

import ClasesLista from './pages/clases/ClasesLista';
import ClasesForm from './pages/clases/ClasesForm';
import TiposClasesLista from './pages/tiposClases/TiposClasesLista';
import TiposClasesForm from './pages/tiposClases/TiposClasesForm';
import PlanesLista from './pages/planes/PlanesLista';
import PlanesForm from './pages/planes/PlanesForm';

function App() {
  return (
    <Router>
      <div className="min-vh-100 bg-light">
        <Navbar />
        <main className="pb-5">
          <Routes>
            <Route path="/" element={<Navigate to="/clases" replace />} />
            <Route path="/clases" element={<ClasesLista />} />
            <Route path="/clases/nueva" element={<ClasesForm />} />
            <Route path="/clases/editar/:id" element={<ClasesForm />} />

            <Route path="/tipos-clases" element={<TiposClasesLista />} />
            <Route path="/tipos-clases/nuevo" element={<TiposClasesForm />} />
            <Route path="/tipos-clases/editar/:id" element={<TiposClasesForm />} />

            <Route path="/planes" element={<PlanesLista />} />
            <Route path="/planes/nuevo" element={<PlanesForm />} />
            <Route path="/planes/editar/:id" element={<PlanesForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;