import { Link } from "react-router-dom";

function WeekendTrips() {
  return (
    <div className="container py-5">
      <h2 className="text-center mb-5">WEEKEND TRIPS</h2>

      <div className="row g-4">

        <div className="col-md-6">
          <div className="card text-white">
            <img
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
              className="card-img"
              style={{ height: "300px", objectFit: "cover" }}
            />
            <div className="card-img-overlay d-flex align-items-end">
              <div>
                <h4>Upcoming Treks in Mumbai</h4>
                <Link to="/treks" className="btn btn-outline-light mt-2">
                  View Tours
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card text-white">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
              className="card-img"
              style={{ height: "300px", objectFit: "cover" }}
            />
            <div className="card-img-overlay d-flex align-items-end">
              <div>
                <h4>Weekend Trip Mumbai & Pune</h4>
                <Link to="/tours" className="btn btn-outline-light mt-2">
                  View Tours
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default WeekendTrips;
