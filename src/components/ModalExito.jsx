function ModalExito({ id, titulo, mensaje, onAceptar = () => {} }) {
  return (
    <div className="modal fade" id={id} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content text-center p-4 rounded-4">
          <div className="modal-body">
            <i className="bi bi-check-circle-fill text-success display-1 mb-3 d-block"></i>
            <h5 className="fw-bold">{titulo}</h5>
            <p className="text-secondary">{mensaje}</p>
            <button 
              type="button" 
              className="btn btn-primary px-4 fw-semibold rounded-3 mt-2" 
              data-bs-dismiss="modal"
              onClick={onAceptar}
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalExito;