import { Link } from "react-router-dom";

function Tours() {
  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">All Tour Categories</h2>

      <div className="row g-4">

        <div className="col-md-4">
          <Link to="/tours/himachal" className="btn btn-outline-dark w-100">
            Himachal Tours
          </Link>
        </div>

        <div className="col-md-4">
          <Link to="/tours/uttarakhand" className="btn btn-outline-dark w-100">
            Uttarakhand Tours
          </Link>
        </div>

        <div className="col-md-4">
          <Link to="/tours/rajasthan" className="btn btn-outline-dark w-100">
            Rajasthan Tours
          </Link>
        </div>

        <div className="col-md-4">
          <Link to="/tours/northeast" className="btn btn-outline-dark w-100">
            NorthEast Tours
          </Link>
        </div>

        <div className="col-md-4">
          <Link to="/tours/kashmir" className="btn btn-outline-dark w-100">
            Kashmir & Leh Tours
          </Link>
        </div>

        <div className="col-md-4">
          <Link to="/tours/southindia" className="btn btn-outline-dark w-100">
            South India Tours
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Tours;
