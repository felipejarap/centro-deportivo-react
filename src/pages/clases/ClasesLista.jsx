import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ClasesLista() {
  const [clases, setClases] = useState([]);
  const [tipos, setTipos] = useState([]);

  useEffect(() => {
    // 1. Cargar tipos de clase para mapear los nombres en la columna 'Tipo'
    const guardadosTipos = localStorage.getItem('tiposClases');
    if (guardadosTipos) {
      setTipos(JSON.parse(guardadosTipos));
    } else {
      fetch('/src/data/tiposClases.json')
        .then((res) => res.json())
        .then((data) => setTipos(data))
        .catch((err) => console.error('Error al cargar tipos:', err));
    }

    // 2. Cargar clases iniciales si localStorage está vacío o es nulo
    const guardadasClases = localStorage.getItem('clases');
    if (guardadasClases && JSON.parse(guardadasClases).length > 0) {
      setClases(JSON.parse(guardadasClases));
    } else {
      fetch('/src/data/clases.json')
        .then((res) => res.json())
        .then((data) => {
          setClases(data);
          localStorage.setItem('clases', JSON.stringify(data));
        })
        .catch((err) => console.error('Error al cargar clases:', err));
    }
  }, []);

  const obtenerNombreTipo = (tipoId) => {
    const encontrado = tipos.find((t) => Number(t.id) === Number(tipoId));
    return encontrado ? encontrado.nombre : 'Sin tipo';
  };

  const eliminarClase = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta clase?')) {
      const actualizadas = clases.filter((c) => c.id !== id);
      setClases(actualizadas);
      localStorage.setItem('clases', JSON.stringify(actualizadas));
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '950px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark mb-0">Gestión de Clases</h2>
        <Link to="/clases/nueva" className="btn btn-primary fw-semibold px-4 py-2" style={{ borderRadius: '8px' }}>
          + Nueva Clase
        </Link>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden p-3 bg-white">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr className="border-bottom">
                <th className="fw-bold py-3">Nombre</th>
                <th className="fw-bold py-3">Tipo</th>
                <th className="fw-bold py-3">Participantes</th>
                <th className="fw-bold py-3">Lugar</th>
                <th className="fw-bold text-end py-3" style={{ width: '180px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clases.map((clase) => (
                <tr key={clase.id} className="border-bottom">
                  <td className="fw-semibold py-3 text-dark">{clase.nombre}</td>
                  <td className="py-3">
                    <span className="badge bg-info text-dark px-3 py-2 rounded-pill">
                      {obtenerNombreTipo(clase.tipoId)}
                    </span>
                  </td>
                  <td className="py-3 text-secondary">{clase.participantes}</td>
                  <td className="py-3 text-secondary">{clase.lugar}</td>
                  <td className="text-end py-3">
                    <Link to={`/clases/editar/${clase.id}`} className="btn btn-sm btn-outline-warning me-2 px-3">
                      Editar
                    </Link>
                    <button onClick={() => eliminarClase(clase.id)} className="btn btn-sm btn-outline-danger px-3">
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

export default ClasesLista;