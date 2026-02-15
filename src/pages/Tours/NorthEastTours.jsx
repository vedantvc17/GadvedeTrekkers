import { Link } from "react-router-dom";

function NorthEastTours() {

  const packages = [
    "Meghalaya",
    "Kaziranga",
    "Meghalaya Premium",
    "Sikkim Gangtok",
  ];

  return (
    <div className="container py-5">
      <h2 className="mb-4">NorthEast Tours</h2>

      <div className="row">
        {packages.map((pkg, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <Link
              to={`/tours/northeast/${pkg.replaceAll(" ", "-")}`}
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

export default NorthEastTours;
