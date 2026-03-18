import { Link } from "react-router-dom";
import logo from "../assets/gadvedelogo.png";

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm py-3"
         style={{ backgroundColor: "#198754" }}>
      <div className="container">

        {/* 🔥 LOGO + NAME */}
        <Link
          className="navbar-brand d-flex align-items-center fw-semibold fs-5 text-white"
          to="/"
        >
          <img
            src={logo}
            alt="Gadvede Trekkers Logo"
            style={{ height: "80px", marginRight: "12px", objectFit: "contain" }}
          />
          Gadvede Trekkers
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
          <ul className="navbar-nav align-items-center">

            {/* Treks Dropdown */}
            <li className="nav-item dropdown mx-3">
              <span
                className="nav-link dropdown-toggle text-white"
                role="button"
                data-bs-toggle="dropdown"
              >
                Treks
              </span>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/treks/beginner">
                    Beginner Treks
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/treks/advanced">
                    Advanced Treks
                  </Link>
                </li>
              </ul>
            </li>

            {/* Tours Dropdown */}
            <li className="nav-item dropdown mx-3">
              <span
                className="nav-link dropdown-toggle text-white"
                role="button"
                data-bs-toggle="dropdown"
              >
                Tours
              </span>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/tours/group">
                    Group Tours
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/tours/private">
                    Private Tours
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item mx-3">
              <Link className="nav-link text-white" to="/rentals">Rentals</Link>
            </li>

            <li className="nav-item mx-3">
              <Link className="nav-link text-white" to="/faq">FAQ</Link>
            </li>

            {/* Book Now */}
            <li className="nav-item ms-3">
              <Link
                to="/book"
                className="btn px-4 rounded-pill"
                style={{ backgroundColor: "#145c32", color: "#fff" }}
              >
                Book Now
              </Link>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Header;