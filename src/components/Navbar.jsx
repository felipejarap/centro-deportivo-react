import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/logo.svg';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container-fluid px-4">
        
        {/* BRANDING */}
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold me-auto" to="/">
          <img src={logo} alt="Kronofit Logo" width="30" height="30" className="d-inline-block align-text-top object-fit-contain" />
          <span className="fs-4 text-white fw-extrabold tracking-wide">KRONOFIT</span>
        </Link>

        {/* BOTÓN HAMBURGUESA */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* ENLACES CENTRALES Y DERECHA */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-3">
            
            {/* DESPLEGABLE DE CLASES */}
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle text-light" href="#" id="navbarDropdownClases" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Clases
              </a>
              <ul className="dropdown-menu dropdown-menu-dark border-0 shadow mt-2" aria-labelledby="navbarDropdownClases">
                <li>
                  <NavLink className="dropdown-item py-2" to="/clases">
                    Gestión de Clases
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item py-2" to="/tipos-clases">
                    Tipos de Clase
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* MÓDULOS ADICIONALES */}
            <li className="nav-item">
              <NavLink className="nav-link text-light" to="/profesores">Profesores</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-light" to="/alumnos">Alumnos</NavLink>
            </li>

          </ul>

          {/* ACCESOS DERECHA */}
          <div className="d-flex align-items-center gap-3">
            <Link to="/login" className="text-light text-decoration-none">Login</Link>
            <Link to="/registro" className="btn btn-primary rounded-pill px-4 py-1 fw-semibold">Registro</Link>
          </div>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;