import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import tiposIniciales from '../../data/tiposClases.json';
import ModalExito from '../../components/ModalExito';

function ClasesForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [tiposClases, setTiposClases] = useState([]);

  const [formData, setFormData] = useState({
    nombre: '',
    tipoId: '',
    participantes: '',
    lugar: '',
    fechaInicio: '',
    fechaTermino: ''
  });

  const [errores, setErrores] = useState({});
  const [mensajeModal, setMensajeModal] = useState('');
  const modalId = 'modalExitoClases';

  // 1. Cargar lista de tipos de clase
  useEffect(() => {
    const tiposGuardados = JSON.parse(localStorage.getItem('tiposClases'));
    if (tiposGuardados && tiposGuardados.length > 0) {
      setTiposClases(tiposGuardados);
    } else {
      setTiposClases(tiposIniciales);
      localStorage.setItem('tiposClases', JSON.stringify(tiposIniciales));
    }
  }, []);

  // 2. Cargar datos si estamos editando
  useEffect(() => {
    if (id) {
      const clasesGuardadas = JSON.parse(localStorage.getItem('clases')) || [];
      const encontrada = clasesGuardadas.find((c) => c.id === Number(id));
      if (encontrada) {
        setFormData(encontrada);
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

    // Validaciones de campos obligatorios
    if (!formData.nombre.trim()) nuevosErrores.nombre = 'Dato obligatorio';
    if (!formData.tipoId) nuevosErrores.tipoId = 'Dato obligatorio';
    if (!formData.participantes) nuevosErrores.participantes = 'Dato obligatorio';
    if (!formData.lugar.trim()) nuevosErrores.lugar = 'Dato obligatorio';
    if (!formData.fechaInicio) nuevosErrores.fechaInicio = 'Dato obligatorio';
    if (!formData.fechaTermino) nuevosErrores.fechaTermino = 'Dato obligatorio';

    // VALIDACIÓN DE FECHAS: La fecha de término debe ser posterior a la de inicio
    if (formData.fechaInicio && formData.fechaTermino) {
      const inicio = new Date(formData.fechaInicio);
      const termino = new Date(formData.fechaTermino);

      if (termino <= inicio) {
        nuevosErrores.fechaTermino = 'La fecha de término debe ser mayor a la fecha de inicio';
      }
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setErrores({});

    const clasesGuardadas = JSON.parse(localStorage.getItem('clases')) || [];

    if (id) {
      const actualizadas = clasesGuardadas.map((c) =>
        c.id === Number(id) ? { ...formData, id: Number(id) } : c
      );
      localStorage.setItem('clases', JSON.stringify(actualizadas));
      setMensajeModal('Clase actualizada correctamente.');
    } else {
      const nuevaClase = { ...formData, id: Date.now() };
      localStorage.setItem('clases', JSON.stringify([...clasesGuardadas, nuevaClase]));
      setMensajeModal('Clase registrada correctamente.');
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
        <h3 className="mb-4 text-dark fw-bold">{id ? 'Editar Clase' : 'Registrar Clase'}</h3>

        <form onSubmit={handleSubmit} noValidate>
          {/* Nombre */}
          <div className="mb-3">
            <label className="form-label text-dark fw-bold mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`form-control form-control-lg fs-6 ${errores.nombre ? 'is-invalid' : ''}`}
              placeholder="Escriba el nombre de la clase"
            />
            {errores.nombre && <div className="invalid-feedback d-block text-danger mt-1">{errores.nombre}</div>}
          </div>

          {/* Tipo clase */}
          <div className="mb-3">
            <label className="form-label text-dark fw-bold mb-1">Tipo clase</label>
            <select
              name="tipoId"
              value={formData.tipoId}
              onChange={handleChange}
              className={`form-select form-select-lg fs-6 ${errores.tipoId ? 'is-invalid' : ''}`}
            >
              <option value="">Seleccione un tipo...</option>
              {tiposClases.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
            {errores.tipoId && <div className="invalid-feedback d-block text-danger mt-1">{errores.tipoId}</div>}
          </div>

          {/* Cantidad de participantes */}
          <div className="mb-3">
            <label className="form-label text-dark fw-bold mb-1">Cantidad de participantes</label>
            <input
              type="number"
              name="participantes"
              value={formData.participantes}
              onChange={handleChange}
              className={`form-control form-control-lg fs-6 ${errores.participantes ? 'is-invalid' : ''}`}
              placeholder="Ej: 15"
            />
            {errores.participantes && <div className="invalid-feedback d-block text-danger mt-1">{errores.participantes}</div>}
          </div>

          {/* Lugar */}
          <div className="mb-3">
            <label className="form-label text-dark fw-bold mb-1">Lugar</label>
            <input
              type="text"
              name="lugar"
              value={formData.lugar}
              onChange={handleChange}
              className={`form-control form-control-lg fs-6 ${errores.lugar ? 'is-invalid' : ''}`}
              placeholder="Escriba el lugar"
            />
            {errores.lugar && <div className="invalid-feedback d-block text-danger mt-1">{errores.lugar}</div>}
          </div>

          {/* Fecha/Hora inicio */}
          <div className="mb-3">
            <label className="form-label text-dark fw-bold mb-1">Fecha/Hora inicio</label>
            <input
              type="datetime-local"
              name="fechaInicio"
              value={formData.fechaInicio}
              onChange={handleChange}
              className={`form-control form-control-lg fs-6 ${errores.fechaInicio ? 'is-invalid' : ''}`}
            />
            {errores.fechaInicio && <div className="invalid-feedback d-block text-danger mt-1">{errores.fechaInicio}</div>}
          </div>

          {/* Fecha/Hora término */}
          <div className="mb-4">
            <label className="form-label text-dark fw-bold mb-1">Fecha/Hora término</label>
            <input
              type="datetime-local"
              name="fechaTermino"
              value={formData.fechaTermino}
              onChange={handleChange}
              className={`form-control form-control-lg fs-6 ${errores.fechaTermino ? 'is-invalid' : ''}`}
            />
            {errores.fechaTermino && <div className="invalid-feedback d-block text-danger mt-1">{errores.fechaTermino}</div>}
          </div>

          {/* Botones */}
          <div className="d-flex justify-content-end gap-2 mt-4">
            <Link to="/clases" className="btn btn-outline-secondary px-4">Cancelar</Link>
            <button type="submit" className="btn btn-primary px-4">{id ? 'Guardar Cambios' : 'Registrar'}</button>
          </div>
        </form>
      </div>

      <ModalExito
        id={modalId}
        titulo="¡Operación Exitosa!"
        mensaje={mensajeModal}
        onAceptar={() => navigate('/clases')}
      />
    </div>
  );
}

export default ClasesForm;