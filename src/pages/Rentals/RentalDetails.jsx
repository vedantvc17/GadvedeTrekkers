import { useLocation, useNavigate } from "react-router-dom";

function RentalDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const item = location.state?.item;

  if (!item) {
    return (
      <div className="container py-5 text-center">
        <h3>Rental not found</h3>
        <button
          className="btn btn-success mt-3"
          onClick={() => navigate("/rentals")}
        >
          Back to Rentals
        </button>
      </div>
    );
  }

  return (
    <section className="py-5">
      <div className="container">
        <button
          className="btn btn-outline-success mb-4"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="row">
          <div className="col-md-6">
            <img
              src={item.image}
              alt={item.name}
              className="img-fluid rounded shadow"
            />
          </div>

          <div className="col-md-6">
            <h2 className="fw-bold">{item.name}</h2>
            <p className="text-muted">{item.category}</p>

            <h4 className="text-success">{item.price}</h4>

            <p className="mt-3">{item.description}</p>

            <button className="btn btn-success mt-3">
              Book / Rent Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RentalDetails;