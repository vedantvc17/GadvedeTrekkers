import { Link } from "react-router-dom";

function KashmirTours() {

  const packages = [
    "Kashmir Srinagar Gulmarg Sonamarg",
    "Pahalgam",
    "Leh Nubra Turtuk Pangong Leh",
    "Delhi Manali Leh Turtuk Manali Delhi",
    "Leh Nubra Pangong Leh",
    "Leh Nubra Turtuk Pangong Umling La Leh",
  ];

  return (
    <div className="container py-5">
      <h2 className="mb-4">Kashmir & Leh Tours</h2>

      <div className="row">
        {packages.map((pkg, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <Link
              to={`/tours/kashmir/${pkg.replaceAll(" ", "-")}`}
              className="card p-3 text-decoration-none text-dark shadow-sm"
            >
              {pkg}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default KashmirTours;
