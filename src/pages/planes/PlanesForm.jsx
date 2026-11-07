import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ModalExito from '../../components/ModalExito';

function PlanesForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration_days: ''
  });

  const [errores, setErrores] = useState({});
  const [mensajeModal, setMensajeModal] = useState('');
  const modalId = 'modalExitoPlanes';

  useEffect(() => {
    if (id) {
      const guardados = JSON.parse(localStorage.getItem('planes')) || [];
      const encontrado = guardados.find((p) => p.id === Number(id));
      if (encontrado) {
        setFormData(encontrado);
      }
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errores[name]) {
      setErrores({ ...errores, [name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevosErrores = {};

    if (!formData.name.trim()) {
      nuevosErrores.name = 'Dato obligatorio';
    }

    const precioNum = parseFloat(formData.price);
    if (!formData.price || isNaN(precioNum) || precioNum <= 0) {
      nuevosErrores.price = 'El precio debe ser un número mayor a 0';
    }

    const diasNum = parseInt(formData.duration_days, 10);
    if (!formData.duration_days || isNaN(diasNum) || diasNum <= 0) {
      nuevosErrores.duration_days = 'La duración debe ser mayor a 0 días';
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setErrores({});
    const guardados = JSON.parse(localStorage.getItem('planes')) || [];
    const datosAGuardar = {
      name: formData.name.trim(),
      price: precioNum,
      duration_days: diasNum
    };

    if (id) {
      const actualizados = guardados.map((p) =>
        p.id === Number(id) ? { ...datosAGuardar, id: Number(id) } : p
      );
      localStorage.setItem('planes', JSON.stringify(actualizados));
      setMensajeModal('Plan actualizado correctamente.');
    } else {
      const nuevoPlan = { ...datosAGuardar, id: Date.now() };
      localStorage.setItem('planes', JSON.stringify([...guardados, nuevoPlan]));
      setMensajeModal('Plan registrado correctamente.');
    }

    const modalElement = document.getElementById(modalId);
    if (modalElement && window.bootstrap) {
      const modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalElement);
      modalInstance.show();
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <div className="card bg-white p-4 shadow-sm border-0 rounded-4">
        <h3 className="mb-4 text-dark fw-bold">{id ? 'Editar Plan' : 'Registrar Plan'}</h3>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label text-dark fw-bold mb-1">Nombre del Plan</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-control form-control-lg fs-6 ${errores.name ? 'is-invalid' : ''}`}
              placeholder="Ej: Básico, Anual, Promocional"
            />
            {errores.name && <div className="invalid-feedback d-block text-danger mt-1">{errores.name}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label text-dark fw-bold mb-1">Precio ($)</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`form-control form-control-lg fs-6 ${errores.price ? 'is-invalid' : ''}`}
              placeholder="Ej: 15000"
            />
            {errores.price && <div className="invalid-feedback d-block text-danger mt-1">{errores.price}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label text-dark fw-bold mb-1">Duración (Días)</label>
            <input
              type="number"
              name="duration_days"
              value={formData.duration_days}
              onChange={handleChange}
              className={`form-control form-control-lg fs-6 ${errores.duration_days ? 'is-invalid' : ''}`}
              placeholder="Ej: 30"
            />
            {errores.duration_days && (
              <div className="invalid-feedback d-block text-danger mt-1">{errores.duration_days}</div>
            )}
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Link to="/planes" className="btn btn-outline-secondary px-4">
              Cancelar
            </Link>
            <button type="submit" className="btn btn-primary px-4">
              {id ? 'Guardar Cambios' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>

      <ModalExito
        id={modalId}
        titulo="¡Operación Exitosa!"
        mensaje={mensajeModal}
        onAceptar={() => navigate('/planes')}
      />
    </div>
  );
}

export default PlanesForm;