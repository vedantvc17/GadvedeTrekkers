import { Link } from "react-router-dom";

const mumbaiTreks = [
  "Harihar Trek",
  "Harishchandragad Trek",
  "Ratangad Trek",
  "Kalsubai Trek",
  "Sandhan Valley Trek",
  "Rajmachi Trek",
  "Kalu Waterfall Trek",
  "Rajmachi Fireflies Trek",
  "Devkund Waterfall Trek",
  "Andharban Jungle Trek",
  "Bhandardara Fireflies Camping",
  "Aadrai Jungle Trek",
];

function MumbaiTreks() {
  return (
    <div className="container py-5">
      <h2 className="fw-bold text-center mb-5">Mumbai Treks</h2>

      <div className="row g-4">
        {mumbaiTreks.map((trek, index) => (
          <div className="col-md-4" key={index}>
            <div className="card shadow-sm p-3 h-100">
              <h6>{trek}</h6>
              <Link
                to={`/treks/${trek.toLowerCase().replaceAll(" ", "-")}`}
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

export default MumbaiTreks;
