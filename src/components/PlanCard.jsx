import { Link } from 'react-router-dom';

function PlanCard({ plan, onEliminar }) {
  // Regla visual: planes entre 8 y 30 días se consideran "Más Popular"
  const esDestacado = plan.duration_days > 7 && plan.duration_days <= 30;

  return (
    <div className="col">
      <div
        className={`card h-100 position-relative ${
          esDestacado ? 'shadow border-primary border-2' : 'shadow-sm border-0'
        }`}
      >
        {esDestacado && (
          <span className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-primary px-3 py-2 fw-bold text-uppercase">
            Más Popular
          </span>
        )}

        <div className={`card-body p-4 text-center ${esDestacado ? 'mt-2' : ''} d-flex flex-column`}>
          <h4 className="card-title fw-bold mb-3">{plan.name}</h4>
          <h3 className="card-price text-primary fw-bold mb-4">
            ${Number(plan.price).toLocaleString('es-CL')}
            <span className="fs-6 fw-normal text-muted"> / {plan.duration_days} días</span>
          </h3>

          <hr />

          <ul className="list-unstyled my-4 text-start">
            <li className="mb-2">
              <i className="bi bi-check2 text-success me-2"></i> Acceso a sala de musculación
            </li>
            <li className="mb-2">
              <i className="bi bi-check2 text-success me-2"></i> Duración activa: {plan.duration_days} días
            </li>
            <li className="mb-2">
              <i className="bi bi-check2 text-success me-2"></i> Evaluación física inicial
            </li>
            <li className={plan.duration_days >= 30 ? 'mb-2' : 'text-muted text-decoration-line-through mb-2'}>
              <i className={plan.duration_days >= 30 ? 'bi bi-check2 text-success me-2' : 'bi bi-x text-danger me-2'}></i>
              Clases grupales ilimitadas
            </li>
          </ul>

          {/* Acciones de administración */}
          <div className="mt-auto pt-3 border-top d-flex gap-2">
            <Link
              to={`/planes/editar/${plan.id}`}
              className="btn btn-outline-warning w-50 rounded-pill fw-bold"
            >
              Editar
            </Link>
            <button
              onClick={() => onEliminar(plan)}
              className="btn btn-outline-danger w-50 rounded-pill fw-bold"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlanCard;