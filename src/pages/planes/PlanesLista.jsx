import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import planesIniciales from '../../data/planes.json';
import PlanCard from '../../components/PlanCard';

function PlanesLista() {
  const [planes, setPlanes] = useState([]);
  const [planAEliminar, setPlanAEliminar] = useState(null);

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('planes'));
    if (guardados && guardados.length > 0) {
      setPlanes(guardados);
    } else {
      setPlanes(planesIniciales);
      localStorage.setItem('planes', JSON.stringify(planesIniciales));
    }
  }, []);

  const confirmarEliminar = (plan) => {
    setPlanAEliminar(plan);
    const modalElement = document.getElementById('modalEliminarPlan');
    if (modalElement && window.bootstrap) {
      const modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalElement);
      modalInstance.show();
    }
  };

  const handleEliminar = () => {
    if (!planAEliminar) return;
    const actualizados = planes.filter((p) => p.id !== planAEliminar.id);
    setPlanes(actualizados);
    localStorage.setItem('planes', JSON.stringify(actualizados));

    const modalElement = document.getElementById('modalEliminarPlan');
    if (modalElement && window.bootstrap) {
      const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) modalInstance.hide();
    }
    setPlanAEliminar(null);
  };

  return (
    <div className="container my-5">
      {/* Cabecera y Botón Nuevo */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0">Nuestros Planes de Gimnasio</h2>
          <p className="text-muted m-0">Elige el plan que mejor se adapte a tus objetivos fitness</p>
        </div>
        <Link to="/planes/nuevo" className="btn btn-primary px-4 fw-bold rounded-pill">
          + Nuevo Plan
        </Link>
      </div>

      {/* Grid de Tarjetas usando el nuevo componente */}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {planes.length === 0 ? (
          <div className="col-12 text-center text-muted py-5">
            <h5>No hay planes registrados en el sistema.</h5>
          </div>
        ) : (
          planes.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onEliminar={confirmarEliminar} />
          ))
        )}
      </div>

      {/* Modal Confirmación de Eliminación */}
      <div className="modal fade" id="modalEliminarPlan" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold text-dark">Confirmar eliminación</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body text-secondary">
              ¿Estás seguro de que deseas eliminar el plan <strong>{planAEliminar?.name}</strong>?
            </div>
            <div className="modal-footer border-0 pt-0">
              <button type="button" className="btn btn-light" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button type="button" className="btn btn-danger" onClick={handleEliminar}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlanesLista;