import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ModalExito from '../../components/ModalExito';

function TiposClasesForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [mensajeModal, setMensajeModal] = useState('');

  const modalId = 'modalExitoTiposClases';

  useEffect(() => {
    if (id) {
      const guardados = JSON.parse(localStorage.getItem('tiposClases')) || [];
      const encontrado = guardados.find((t) => t.id === Number(id));
      if (encontrado) setNombre(encontrado.nombre);
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (nombre.trim() === '') {
      setError('Dato obligatorio');
      return;
    }

    setError('');

    const guardados = JSON.parse(localStorage.getItem('tiposClases')) || [];

    if (id) {
      const actualizados = guardados.map((t) => 
        t.id === Number(id) ? { id: Number(id), nombre: nombre.trim() } : t
      );
      localStorage.setItem('tiposClases', JSON.stringify(actualizados));
      setMensajeModal('Tipo de clase actualizado correctamente.');
    } else {
      const nuevo = { id: Date.now(), nombre: nombre.trim() };
      localStorage.setItem('tiposClases', JSON.stringify([...guardados, nuevo]));
      setMensajeModal('Tipo de clase registrado correctamente.');
    }

    // DISPARO DEL MODAL CON BOOTSTRAP JS NATIVO
    const modalElement = document.getElementById(modalId);
    if (modalElement && window.bootstrap) {
      const modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalElement);
      modalInstance.show();
    }
  };

  const handleAceptarModal = () => {
    navigate('/tipos-clases');
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <div className="card bg-white p-4 shadow-sm border-0 rounded-4">
        <h3 className="mb-4 text-dark fw-bold">{id ? 'Editar Tipo de Clase' : 'Registrar Tipo de Clase'}</h3>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label className="form-label text-dark fw-bold mb-1">Nombre</label>
            <input 
              type="text" 
              value={nombre} 
              onChange={(e) => {
                setNombre(e.target.value);
                if (error) setError('');
              }} 
              className={`form-control form-control-lg fs-6 ${error ? 'is-invalid' : ''}`} 
              placeholder="Escriba el nombre del tipo de clase" 
            />
            {error && <div className="invalid-feedback d-block text-danger mt-1">{error}</div>}
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Link to="/tipos-clases" className="btn btn-outline-secondary px-4">Cancelar</Link>
            <button type="submit" className="btn btn-primary px-4">{id ? 'Guardar Cambios' : 'Registrar'}</button>
          </div>
        </form>
      </div>

      {/* COMPONENTE MODAL CON TU ESTRUCTURA EXACTA */}
      <ModalExito 
        id={modalId}
        titulo="¡Operación Exitosa!"
        mensaje={mensajeModal} 
        onAceptar={handleAceptarModal} 
      />
    </div>
  );
}

export default TiposClasesForm;