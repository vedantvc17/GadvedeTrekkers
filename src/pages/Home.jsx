import HeroCarousel from "../components/HeroCarousel";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <HeroCarousel />

      {/* ================= WEEKEND TRIPS ================= */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">
            — WEEKEND TRIPS —
          </h2>

          <div className="row g-4">

            <div className="col-md-8">
              <div className="position-relative overflow-hidden rounded">
                <img
                  src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
                  className="img-fluid w-100"
                  style={{ height: "300px", objectFit: "cover" }}
                />
                <div className="position-absolute bottom-0 start-0 text-white p-4">
                  <h4>Upcoming Treks in Mumbai</h4>
                  {/* No Route Here */}
                  <button className="btn btn-outline-light btn-sm">
                    View Tours
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="position-relative overflow-hidden rounded">
                <img
                  src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
                  className="img-fluid w-100"
                  style={{ height: "300px", objectFit: "cover" }}
                />
                <div className="position-absolute bottom-0 start-0 text-white p-3">
                  <h5>Upcoming Treks in Pune</h5>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= POPULAR TREKS ================= */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold">
            Popular Treks Near Pune & Mumbai
          </h2>

          <p className="text-center text-muted mb-5">
            Beginner-friendly and challenging Sahyadri treks every weekend.
          </p>

          <div className="row g-4">

            {[
              {
                name: "Rajgad Fort Trek",
                price: "₹999",
                img: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff",
              },
              {
                name: "Torna Fort Trek",
                price: "₹1099",
                img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
              },
              {
                name: "Visapur Fort Trek",
                price: "₹799",
                img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
              },
              {
                name: "Lohagad Fort Trek",
                price: "₹699",
                img: "https://images.unsplash.com/photo-1473625247510-8ceb1760943f",
              },
            ].map((trek, index) => (
              <div className="col-md-3" key={index}>
                <div className="card border-0 shadow-sm h-100">
                  <img
                    src={trek.img}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />

                  <div className="card-body">
                    <h6>{trek.name}</h6>
                    <h5 className="fw-bold text-success">{trek.price}</h5>

                    <div className="d-flex gap-2 mt-3">
                      <button className="btn btn-success w-50">
                        Book Now
                      </button>
                      <button className="btn btn-outline-success w-50">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          </div>

          {/* ✅ View All Treks Route */}
          <div className="text-center mt-4">
            <Link to="/treks" className="btn btn-outline-success px-4">
              View All Treks →
            </Link>
          </div>

        </div>
      </section>

      {/* ================= BACKPACKING TOURS ================= */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="fw-bold">
            Backpacking Trips & Group Tours
          </h2>

          <div className="row g-4 mt-4">

            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429"
                  className="card-img-top"
                  style={{ height: "220px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5>Himachal Backpacking</h5>
                  <button className="btn btn-success mt-3">
                    Explore Tours →
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1587474260584-136574528ed5"
                  className="card-img-top"
                  style={{ height: "220px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5>Rajasthan Tours</h5>
                  <button className="btn btn-success mt-3">
                    Explore Tours →
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                  className="card-img-top"
                  style={{ height: "220px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5>South India Trips</h5>
                  <button className="btn btn-success mt-3">
                    Explore Tours →
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* ✅ Explore All Tours Route */}
          <div className="mt-4">
            <Link to="/tours" className="btn btn-outline-success px-4">
              Explore All Tours →
            </Link>
          </div>

        </div>
      </section>

      {/* ================= RENTALS ================= */}
      <section className="py-5">
        <div className="container text-center">
          <h2 className="fw-bold">Adventure Rentals & Essentials</h2>

          <div className="row g-4 mt-4">

            {["Tents on Rent", "Trekking Gear", "Villas on Rent"].map(
              (item, index) => (
                <div className="col-md-4" key={index}>
                  <div className="card shadow-sm border-0 p-4 h-100">
                    <h5>{item}</h5>
                    <p className="text-muted">
                      Quality gear for your adventures.
                    </p>
                    <button className="btn btn-success mt-auto">
                      Explore
                    </button>
                  </div>
                </div>
              )
            )}

          </div>

          {/* ✅ Rentals Route */}
          <div className="mt-4">
            <Link to="/rentals" className="btn btn-outline-success px-4">
              View All Rentals →
            </Link>
          </div>

        </div>
      </section>

      {/* ================= CORPORATE ================= */}
      <section className="py-5 bg-light text-center">
        <div className="container">
          <h2 className="fw-bold">
            Budget Tours for Schools & Corporate Groups
          </h2>

          <p className="text-muted">
            Safe, affordable & customizable PAN-India tours.
          </p>

          <Link to="/corporate" className="btn btn-success px-4 mt-3">
            Plan Your Trip
          </Link>
        </div>
      </section>
    </>
  );
}

export default Home;
