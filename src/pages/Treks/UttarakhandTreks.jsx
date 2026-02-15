import { Link } from "react-router-dom";

const uttarakhandTreks = [
  "Valley of Flowers Trek",
  "Kedarkantha Trek",
  "Brahmatal Trek",
  "Ali Bedni Bugyal Trek",
  "Dayara Bugyal Trek",
  "Kuari Pass Trek",
  "Kedarnath Trek",
  "Tungnath Trek",
];

function UttarakhandTreks() {
  return (
    <div className="container py-5">
      <h2 className="fw-bold text-center mb-5">Uttarakhand Treks</h2>

      <div className="row g-4">
        {uttarakhandTreks.map((trek, index) => (
          <div className="col-md-4" key={index}>
            <div className="card shadow-sm p-3 h-100">
              <h6>{trek}</h6>

              <Link
                to={`/treks/${trek.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className="btn btn-success mt-3"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UttarakhandTreks;
