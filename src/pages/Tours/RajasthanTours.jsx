import { Link } from "react-router-dom";

function RajasthanTours() {

  const packages = [
    "Jodhpur Jaisalmer Udaipur",
    "Jaipur Jaisalmer Jodhpur",
    "Jaipur Jodhpur Jaisalmer Udaipur",
    "New Year Rajasthan Trip",
  ];

  return (
    <div className="container py-5">
      <h2 className="mb-4">Rajasthan Tours</h2>

      <div className="row">
        {packages.map((pkg, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <Link
              to={`/tours/rajasthan/${pkg.replaceAll(" ", "-")}`}
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

export default RajasthanTours;
