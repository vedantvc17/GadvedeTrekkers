import HeroCarousel from "../components/HeroCarousel";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

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
            Explore Treks by Region
          </h2>

          <p className="text-center text-muted mb-5">
            Discover adventures across India.
          </p>

          {(() => {
            const treks = [
              {
                name: "Mumbai Treks",
                price: "Starting ₹799",
                img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
                state: { region: "mumbai" },
              },
              {
                name: "Pune Treks",
                price: "Starting ₹699",
                img: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff",
                state: { region: "pune" },
              },
              {
                name: "Himachal Treks",
                price: "Starting ₹6,999",
                img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
                state: { region: "himachal" },
              },
              {
                name: "Uttarakhand Treks",
                price: "Starting ₹7,499",
                img: "https://images.unsplash.com/photo-1587474260584-136574528ed5",
                state: { region: "uttarakhand" },
              },
              {
                name: "Kashmir Treks",
                price: "Starting ₹9,999",
                img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
                state: { region: "kashmir" },
              },
            ];

            const visibleCount = 3;
            const extended = [
              ...treks.slice(-visibleCount),
              ...treks,
              ...treks.slice(0, visibleCount),
            ];

            const [index, setIndex] = useState(visibleCount);
            const [transition, setTransition] = useState(true);

            useEffect(() => {
              const interval = setInterval(() => {
                setIndex((prev) => prev + 1);
              }, 4000);
              return () => clearInterval(interval);
            }, []);

            const next = () => setIndex((prev) => prev + 1);
            const prev = () => setIndex((prev) => prev - 1);

            const handleTransitionEnd = () => {
              if (index >= treks.length + visibleCount) {
                setTransition(false);
                setIndex(visibleCount);
              }

              if (index < visibleCount) {
                setTransition(false);
                setIndex(treks.length + visibleCount - 1);
              }
            };

            return (
              <div className="trek-slider-container">

                <button className="trek-slider-btn left" onClick={prev}>
                  ❮
                </button>

                <div className="trek-slider-wrapper">
                  <div
                    className="trek-slider-track"
                    style={{
                      transform: `translateX(-${index * (100 / visibleCount)}%)`,
                      transition: transition ? "transform 0.6s ease-in-out" : "none",
                    }}
                    onTransitionEnd={() => {
                      handleTransitionEnd();
                      setTimeout(() => setTransition(true), 20);
                    }}
                  >
                    {extended.map((trek, i) => (
                      <div className="trek-slide" key={i}>
                        <div className="card border-0 shadow-sm h-100 text-center">
                          <img
                            src={trek.img}
                            className="card-img-top"
                            style={{ height: "260px", objectFit: "cover" }}
                            alt={trek.name}
                          />
                          <div className="card-body">
                            <h5>{trek.name}</h5>
                            <h6 className="fw-bold text-success">
                              {trek.price}
                            </h6>

                            {/* ✅ Correct Navigation */}
                            <Link
                              to="/treks"
                              state={trek.state}
                              className="btn btn-success mt-3"
                            >
                              Explore →
                            </Link>

                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="trek-slider-btn right" onClick={next}>
                  ❯
                </button>

              </div>
            );
          })()}

          <div className="text-center mt-4">
            <Link to="/treks" className="btn btn-outline-success px-4">
              View All Treks →
            </Link>
          </div>
        </div>
      </section>

      {/* ================= POPULAR TOURS ================= */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center fw-bold">
            Explore Tours by Region
          </h2>

          <p className="text-center text-muted mb-5">
            Discover backpacking & group tours across India.
          </p>

          {(() => {
            const tours = [
              {
                name: "Himachal Tours",
                price: "Starting ₹6,999",
                img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
                link: "/tours/himachal",
              },
              {
                name: "Uttarakhand Tours",
                price: "Starting ₹7,499",
                img: "https://images.unsplash.com/photo-1587474260584-136574528ed5",
                link: "/tours/uttarakhand",
              },
              {
                name: "Rajasthan Tours",
                price: "Starting ₹5,999",
                img: "https://images.unsplash.com/photo-1548013146-72479768bada",
                link: "/tours/rajasthan",
              },
              {
                name: "NorthEast Tours",
                price: "Starting ₹8,999",
                img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
                link: "/tours/northeast",
              },
              {
                name: "Kashmir & Leh Tours",
                price: "Starting ₹9,999",
                img: "https://images.unsplash.com/photo-1593693411515-c20261bcad6e",
                link: "/tours/kashmir",
              },
              {
                name: "South India Tours",
                price: "Starting ₹4,999",
                img: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09e",
                link: "/tours/southindia",
              },
            ];

            const visibleCount = 3;
            const extended = [
              ...tours.slice(-visibleCount),
              ...tours,
              ...tours.slice(0, visibleCount),
            ];

            const [index, setIndex] = useState(visibleCount);
            const [transition, setTransition] = useState(true);

            useEffect(() => {
              const interval = setInterval(() => {
                setIndex((prev) => prev + 1);
              }, 4000);
              return () => clearInterval(interval);
            }, []);

            const next = () => setIndex((prev) => prev + 1);
            const prev = () => setIndex((prev) => prev - 1);

            const handleTransitionEnd = () => {
              if (index >= tours.length + visibleCount) {
                setTransition(false);
                setIndex(visibleCount);
              }

              if (index < visibleCount) {
                setTransition(false);
                setIndex(tours.length + visibleCount - 1);
              }
            };

            return (
              <div className="tour-slider-container">

                <button className="tour-slider-btn left" onClick={prev}>
                  ❮
                </button>

                <div className="tour-slider-wrapper">
                  <div
                    className="tour-slider-track"
                    style={{
                      transform: `translateX(-${index * (100 / visibleCount)}%)`,
                      transition: transition ? "transform 0.6s ease-in-out" : "none",
                    }}
                    onTransitionEnd={() => {
                      handleTransitionEnd();
                      setTimeout(() => setTransition(true), 20);
                    }}
                  >
                    {extended.map((tour, i) => (
                      <div className="tour-slide" key={i}>
                        <div className="card border-0 shadow-sm h-100 text-center">
                          <img
                            src={tour.img}
                            className="card-img-top"
                            style={{ height: "260px", objectFit: "cover" }}
                            alt={tour.name}
                          />
                          <div className="card-body">
                            <h5>{tour.name}</h5>
                            <h6 className="fw-bold text-success">
                              {tour.price}
                            </h6>
                            <Link
                              to={tour.link}
                              className="btn btn-success mt-3"
                            >
                              Explore →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="tour-slider-btn right" onClick={next}>
                  ❯
                </button>

              </div>
            );
          })()}

          <div className="text-center mt-4">
            <Link to="/tours" className="btn btn-outline-success px-4">
              View All Tours →
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
