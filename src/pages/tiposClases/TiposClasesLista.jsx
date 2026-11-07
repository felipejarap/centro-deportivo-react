import { useState } from 'react';
import { Link } from 'react-router-dom';
import tiposIniciales from '../../data/tiposClases.json';

function TiposClasesLista() {
  const [tipos, setTipos] = useState(() => {
    const guardados = localStorage.getItem('tiposClases');
    if (guardados) return JSON.parse(guardados);
    localStorage.setItem('tiposClases', JSON.stringify(tiposIniciales));
    return tiposIniciales;
  });

  const eliminarTipo = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este tipo de clase?')) {
      const actualizados = tipos.filter((t) => t.id !== id);
      setTipos(actualizados);
      localStorage.setItem('tiposClases', JSON.stringify(actualizados));
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '900px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark mb-0">Tipos de Clase</h2>
        <Link to="/tipos-clases/nuevo" className="btn btn-primary fw-semibold px-4 py-2" style={{ borderRadius: '8px' }}>
          + Nuevo Tipo
        </Link>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden p-3 bg-white">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr className="border-bottom">
                <th className="fw-bold py-3" style={{ width: '120px' }}>ID</th>
                <th className="fw-bold py-3">Nombre</th>
                <th className="fw-bold text-end py-3" style={{ width: '180px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tipos.map((tipo) => (
                <tr key={tipo.id} className="border-bottom">
                  <td className="text-secondary py-3">#{tipo.id}</td>
                  <td className="fw-semibold py-3 text-dark">{tipo.nombre}</td>
                  <td className="text-end py-3">
                    <Link to={`/tipos-clases/editar/${tipo.id}`} className="btn btn-sm btn-outline-warning me-2 px-3">
                      Editar
                    </Link>
                    <button onClick={() => eliminarTipo(tipo.id)} className="btn btn-sm btn-outline-danger px-3">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TiposClasesLista;