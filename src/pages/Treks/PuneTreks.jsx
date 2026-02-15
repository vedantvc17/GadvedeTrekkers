import { Link } from "react-router-dom";

const puneTreks = [
  "Harishchandragad Trek",
  "Rajmachi Trek",
  "Kalsubai Trek",
  "Rajmachi Fireflies Trek",
  "Ratangad Trek",
  "Kalu Waterfall Trek",
  "Bhandardara Fireflies Camping",
  "Andharban Jungle Trek",
  "Aadrai Jungle Trek",
  "Devkund Waterfall",
  "Nanemachi Waterfall Trek",
  "Bhorgiri to Bhimashankar Trek",
];

function PuneTreks() {
  return (
    <div className="container py-5">
      <h2 className="fw-bold text-center mb-5">Pune Treks</h2>

      <div className="row g-4">
        {puneTreks.map((trek, index) => (
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

export default PuneTreks;
