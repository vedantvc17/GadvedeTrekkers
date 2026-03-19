import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import logo from "../assets/gadvedelogo.png";
import { uniqueTreks, slugifyTrekName } from "../data/treks";

function Header() {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const headerRef = useRef(null);
  const campingSites = [
    "Pavna Lake Camping",
    "Alibag Beach Side Camping",
    "Panshet Lake Camping",
    "Matheran Camping",
  ];
  const rentalCategories = ["Tents", "Villas"];

  useEffect(() => {
    function handlePointerDown(event) {
      if (!headerRef.current?.contains(event.target)) {
        setMobileNavOpen(false);
        setOpenMenu(null);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, []);

  const toggleMobileNav = () => {
    setMobileNavOpen((current) => {
      const next = !current;
      if (!next) {
        setOpenMenu(null);
      }
      return next;
    });
  };

  const closeMenus = () => {
    setMobileNavOpen(false);
    setOpenMenu(null);
  };

  const toggleDropdownMenu = (menuName) => {
    setOpenMenu((current) => (current === menuName ? null : menuName));
  };

  return (
    <nav
         ref={headerRef}
         className="navbar navbar-expand-lg navbar-dark shadow-sm py-3"
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
          className={`navbar-toggler border-0 mobile-nav-toggle ${
            mobileNavOpen ? "is-open" : ""
          }`}
          type="button"
          onClick={toggleMobileNav}
          aria-expanded={mobileNavOpen}
          aria-label="Toggle navigation"
        >
          <span className="mobile-nav-line"></span>
          <span className="mobile-nav-line"></span>
          <span className="mobile-nav-line"></span>
        </button>

        <div
          className={`navbar-collapse justify-content-end mobile-nav-panel ${
            mobileNavOpen ? "is-open" : ""
          }`}
          id="navbarContent"
        >
          <ul className="navbar-nav align-items-center">

            {/* Treks Dropdown */}
            <li
              className="nav-item dropdown mx-3 trek-dropdown"
              onMouseEnter={() => setOpenMenu("treks")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <span
                className={`nav-link dropdown-toggle text-white ${
                  openMenu === "treks" ? "show" : ""
                }`}
                role="button"
                aria-expanded={openMenu === "treks"}
                onClick={() => toggleDropdownMenu("treks")}
              >
                Treks
              </span>
              <div
                className={`dropdown-menu trek-dropdown-menu p-3 ${
                  openMenu === "treks" ? "show" : ""
                }`}
              >
                <div className="dropdown-region-title">
                  Maharashtra Treks
                </div>

                <div className="trek-dropdown-list">
                  {uniqueTreks.map((trek) => (
                    <Link
                      key={trek.name}
                      className="dropdown-item"
                      to={`/treks/${slugifyTrekName(trek.name)}`}
                      onClick={closeMenus}
                    >
                      {trek.name}
                    </Link>
                  ))}
                </div>
              </div>
            </li>

            <li
              className="nav-item dropdown mx-3"
              onMouseEnter={() => setOpenMenu("camping")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <span
                className={`nav-link dropdown-toggle text-white ${
                  openMenu === "camping" ? "show" : ""
                }`}
                role="button"
                aria-expanded={openMenu === "camping"}
                onClick={() => toggleDropdownMenu("camping")}
              >
                Camping
              </span>
              <ul className={`dropdown-menu ${openMenu === "camping" ? "show" : ""}`}>
                {campingSites.map((site) => (
                  <li key={site}>
                    <Link className="dropdown-item" to="/camping" onClick={closeMenus}>
                      {site}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* Tours Dropdown */}
            <li
              className="nav-item dropdown mx-3"
              onMouseEnter={() => setOpenMenu("tours")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <span
                className={`nav-link dropdown-toggle text-white ${
                  openMenu === "tours" ? "show" : ""
                }`}
                role="button"
                aria-expanded={openMenu === "tours"}
                onClick={() => toggleDropdownMenu("tours")}
              >
                Tours
              </span>
              <ul className={`dropdown-menu ${openMenu === "tours" ? "show" : ""}`}>
                <li>
                  <Link className="dropdown-item" to="/tours/group" onClick={closeMenus}>
                    Group Tours
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/tours/private" onClick={closeMenus}>
                    Private Tours
                  </Link>
                </li>
              </ul>
            </li>

            <li
              className="nav-item dropdown mx-3"
              onMouseEnter={() => setOpenMenu("rentals")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <span
                className={`nav-link dropdown-toggle text-white ${
                  openMenu === "rentals" ? "show" : ""
                }`}
                role="button"
                aria-expanded={openMenu === "rentals"}
                onClick={() => toggleDropdownMenu("rentals")}
              >
                Rentals
              </span>
              <ul className={`dropdown-menu ${openMenu === "rentals" ? "show" : ""}`}>
                {rentalCategories.map((category) => (
                  <li key={category}>
                    <Link
                      className="dropdown-item"
                      to="/rentals"
                      state={{ category }}
                      onClick={closeMenus}
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li className="nav-item mx-3">
              <Link className="nav-link text-white" to="/corporate" onClick={closeMenus}>
                College Industrial Visits
              </Link>
            </li>

            {/* Corporate Dropdown */}
            <li
              className="nav-item dropdown mx-3"
              onMouseEnter={() => setOpenMenu("corporate")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <span
                className={`nav-link dropdown-toggle text-white ${openMenu === "corporate" ? "show" : ""}`}
                role="button"
                aria-expanded={openMenu === "corporate"}
                onClick={() => toggleDropdownMenu("corporate")}
              >
                Corporate
              </span>
              <ul className={`dropdown-menu ${openMenu === "corporate" ? "show" : ""}`}>
                <li>
                  <Link className="dropdown-item" to="/corporate/trek" onClick={closeMenus}>
                    🏔 Corporate Trek
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/corporate/camping" onClick={closeMenus}>
                    ⛺ Corporate Camping
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/corporate/team-building" onClick={closeMenus}>
                    🤝 Team Building Activities
                  </Link>
                </li>
              </ul>
            </li>

            {/* Opportunities Dropdown */}
            <li
              className="nav-item dropdown mx-3"
              onMouseEnter={() => setOpenMenu("opportunities")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <span
                className={`nav-link dropdown-toggle text-white ${openMenu === "opportunities" ? "show" : ""}`}
                role="button"
                aria-expanded={openMenu === "opportunities"}
                onClick={() => toggleDropdownMenu("opportunities")}
              >
                Opportunities
              </span>
              <ul className={`dropdown-menu ${openMenu === "opportunities" ? "show" : ""}`}>
                <li>
                  <Link className="dropdown-item" to="/careers" onClick={closeMenus}>
                    💼 Careers
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/list-property" onClick={closeMenus}>
                    🏠 List Your Property
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/list-campsite" onClick={closeMenus}>
                    ⛺ List Your Campsite
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/list-event" onClick={closeMenus}>
                    📅 List Your Event
                  </Link>
                </li>
              </ul>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Header;
