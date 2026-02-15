import { Link } from "react-router-dom";

function Treks() {
  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold mb-5">All Trek Categories</h2>

      <div className="row g-4">

        <div className="col-md-4">
          <Link to="/treks/mumbai" className="text-decoration-none">
            <div className="card shadow-sm p-4 text-center">
              <h5>Mumbai Treks</h5>
            </div>
          </Link>
        </div>

        <div className="col-md-4">
          <Link to="/treks/pune" className="text-decoration-none">
            <div className="card shadow-sm p-4 text-center">
              <h5>Pune Treks</h5>
            </div>
          </Link>
        </div>

        <div className="col-md-4">
          <Link to="/treks/himachal" className="text-decoration-none">
            <div className="card shadow-sm p-4 text-center">
              <h5>Himachal Treks</h5>
            </div>
          </Link>
        </div>

        <div className="col-md-6">
          <Link to="/treks/uttarakhand" className="text-decoration-none">
            <div className="card shadow-sm p-4 text-center">
              <h5>Uttarakhand Treks</h5>
            </div>
          </Link>
        </div>

        <div className="col-md-6">
          <Link to="/treks/kashmir" className="text-decoration-none">
            <div className="card shadow-sm p-4 text-center">
              <h5>Kashmir Treks</h5>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Treks;
