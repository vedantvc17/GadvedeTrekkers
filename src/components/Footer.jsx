import { Link } from "react-router-dom";
import logo from "../assets/gadvedelogo.png";

function Footer() {
  return (
    <footer
      className="py-5 mt-5 text-white"
      style={{ backgroundColor: "#198754" }}
    >
      <div className="container">
        <div className="row text-start">

          {/* LEFT SECTION */}
          <div className="col-md-3 mb-4">
            <img
              src={logo}
              alt="Gadvede Logo"
              style={{ width: "80px" }}
              className="mb-3"
            />
            <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
              At Gadvede Trekkers, we provide safe, affordable, and
              unforgettable adventure experiences across India.
            </p>
          </div>

          {/* COMPANY */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold mb-3">Company</h5>
            <ul className="list-unstyled">
              <li><Link className="footer-link" to="/tours">Tours</Link></li>
              <li><Link className="footer-link" to="/treks">Treks</Link></li>
              <li><Link className="footer-link" to="/about">About Us</Link></li>
              <li><Link className="footer-link" to="/contact">Contact</Link></li>
              <li><Link className="footer-link" to="/blogs">Blogs</Link></li>
            </ul>
          </div>

          {/* QUICK LINKS */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li><span className="footer-link">Privacy Policy</span></li>
              <li><span className="footer-link">Cancellation Policy</span></li>
              <li><span className="footer-link">Terms & Conditions</span></li>
              <li><span className="footer-link">Disclaimer</span></li>
              <li><span className="footer-link">Support</span></li>
            </ul>
          </div>

          {/* OFFICE */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold mb-3">Our Office</h5>
            <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
              Gadvede Trekkers <br />
              Pune, Maharashtra <br />
              India
            </p>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="text-center mt-4 pt-3 border-top border-light">
          <p className="mb-0" style={{ fontSize: "14px" }}>
            © {new Date().getFullYear()} Gadvede Trekkers. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;