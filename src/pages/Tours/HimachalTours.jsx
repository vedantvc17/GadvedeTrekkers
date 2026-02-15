import { Link } from "react-router-dom";

function HimachalTours() {

  const packages = [
    "Manali Kullu Kasol",
    "Manali Kasol Kheerganga",
    "Manali Kasol Jibhi",
    "Spiti Circuit",
    "Manali Kasol Tosh",
    "Mcleodganj Bir Jibhi",
    "Manali Kasol Kheerganga Jibhi",
    "Winter Spiti Valley",
  ];

  return (
    <div className="container py-5">
      <h2 className="mb-4">Himachal Tours</h2>

      <div className="row">
        {packages.map((pkg, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <Link
              to={`/tours/himachal/${pkg.replaceAll(" ", "-")}`}
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

export default HimachalTours;
