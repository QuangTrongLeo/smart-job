import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-primary fs-4" to="/">
          <i className="bi bi-briefcase-fill me-2"></i>SmartJob
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/jobs">Tìm việc làm</Link>
            </li>
            <li className="nav-item me-3">
              <Link className="nav-link" to="/freelancers">Tìm Freelancer</Link>
            </li>
            <li className="nav-item">
              <Link className="btn btn-outline-light me-2" to="/login">Đăng nhập</Link>
            </li>
            <li className="nav-item">
              <Link className="btn btn-primary" to="/register">Đăng ký</Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;