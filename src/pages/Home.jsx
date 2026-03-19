import HeroCarousel from "../components/HeroCarousel";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

function TourTile({ title, images, region, path = "/tours", btnLabel = "VIEW TOURS" }) {
  const [current, setCurrent] = useState(0);
  const [prevIdx, setPrevIdx] = useState(null);
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      advanceTo((c) => (c + 1) % images.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [images.length]);

  function advanceTo(nextFn) {
    const next = nextFn(current);
    if (animating || next === current) return;
    setPrevIdx(current);
    setCurrent(next);
    setAnimating(true);
    setTimeout(() => { setPrevIdx(null); setAnimating(false); }, 900);
  }

  const go = () => navigate(path, region ? { state: { region } } : undefined);

  return (
    <div className="col-6 col-md-3">
      <div className="weekend-tile" onClick={go}>
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={title}
            className={`weekend-tile-img ${i === current ? "wt-active" : ""} ${i === prevIdx ? "wt-prev" : ""}`}
          />
        ))}
        <div className="weekend-tile-overlay" />
        <div className="weekend-tile-content">
          <h4 className="weekend-tile-title">{title}</h4>
          <div className="weekend-tile-dots">
            {images.map((_, i) => (
              <span
                key={i}
                className={`weekend-dot ${i === current ? "active" : ""}`}
                onClick={(e) => { e.stopPropagation(); advanceTo(() => i); }}
              />
            ))}
          </div>
          <button
            className="weekend-tile-btn"
            onClick={(e) => { e.stopPropagation(); go(); }}
          >
            {btnLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function Home() {
  const tourTiles = [
    {
      title: "Manali",
      region: "himachal",
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
        "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800&q=80",
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80",
      ],
    },
    {
      title: "Rajasthan",
      region: "rajasthan",
      images: [
        "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80",
        "https://images.unsplash.com/photo-1524230572899-a752b3835840?w=800&q=80",
        "https://images.unsplash.com/photo-1599030399935-8e03c7b6dccc?w=800&q=80",
        "https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?w=800&q=80",
      ],
    },
    {
      title: "Kerala",
      region: "southindia",
      images: [
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
        "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800&q=80",
        "https://images.unsplash.com/photo-1545109808-7c2b27ad7869?w=800&q=80",
        "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=800&q=80",
      ],
    },
    {
      title: "Hampi",
      region: null,
      images: [
        "https://images.unsplash.com/photo-1600100399425-c7f41f02d5c8?w=800&q=80",
        "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80",
        "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=800&q=80",
        "https://images.unsplash.com/photo-1584825975702-a7c5e1fb8ff8?w=800&q=80",
      ],
    },
    {
      title: "Hampi — Gokarna",
      region: null,
      images: [
        "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80",
        "https://images.unsplash.com/photo-1600100399425-c7f41f02d5c8?w=800&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
        "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&q=80",
      ],
    },
    {
      title: "Gokarna — Murdeshwar",
      region: null,
      images: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
        "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&q=80",
        "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",
      ],
    },
    {
      title: "Malvan — Tarkarli",
      region: null,
      images: [
        "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
        "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
        "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800&q=80",
      ],
    },
    {
      title: "Goa",
      region: "southindia",
      images: [
        "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=800&q=80",
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
        "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80",
        "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80",
      ],
    },
  ];

  return (
    <>
      <HeroCarousel />

      {/* ================= TREKS & CAMPING ================= */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">— TREKS &amp; CAMPING —</h2>

          {/* Trek tiles */}
          <h5 className="fw-bold text-success mb-3">Weekend Treks</h5>
          <div className="row g-4 mb-5">
            {[
              {
                title: "Mumbai Treks",
                region: "mumbai",
                path: "/treks",
                images: [
                  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
                  "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
                  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
                  "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80",
                ],
              },
              {
                title: "Pune Treks",
                region: "pune",
                path: "/treks",
                images: [
                  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80",
                  "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80",
                  "https://images.unsplash.com/photo-1454942901704-3c44c11b2ad1?w=800&q=80",
                  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
                ],
              },
              {
                title: "Nashik Treks",
                region: null,
                path: "/treks",
                images: [
                  "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
                  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
                  "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80",
                  "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80",
                ],
              },
              {
                title: "Bhandardara Treks",
                region: null,
                path: "/treks",
                images: [
                  "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=800&q=80",
                  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
                  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
                  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
                ],
              },
            ].map((tile) => (
              <TourTile key={tile.title} {...tile} btnLabel="VIEW TREKS" />
            ))}
          </div>

          {/* Camping tiles */}
          <h5 className="fw-bold text-success mb-3">Camping &amp; Stays</h5>
          <div className="row g-4">
            {[
              {
                title: "Alibaug Camping",
                region: null,
                path: "/camping",
                images: [
                  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
                  "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
                  "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800&q=80",
                  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80",
                ],
              },
              {
                title: "Pawna Lake Camping",
                region: null,
                path: "/camping",
                images: [
                  "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=800&q=80",
                  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
                  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",
                  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
                ],
              },
              {
                title: "Bhandardara Camping",
                region: null,
                path: "/camping",
                images: [
                  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
                  "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=800&q=80",
                  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
                  "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80",
                ],
              },
              {
                title: "Igatpuri Forest Camping",
                region: null,
                path: "/camping",
                images: [
                  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",
                  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
                  "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=800&q=80",
                  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
                ],
              },
            ].map((tile) => (
              <TourTile key={tile.title} {...tile} btnLabel="VIEW CAMPING" />
            ))}
          </div>
        </div>
      </section>

      {/* ================= POPULAR TOURS ================= */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">
            — POPULAR TOURS —
          </h2>

          <div className="row g-4">
            {tourTiles.map((tile) => (
              <TourTile key={tile.title} {...tile} />
            ))}
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
                img: "/TrekImages/mumbaitrek.png",
                state: { region: "mumbai" },
              },
              {
                name: "Pune Treks",
                price: "Starting ₹699",
                img: "/TrekImages/PuneTrek.png",
                state: { region: "pune" },
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
                            className="card-img-top standard-img"
                            alt={trek.name}
                          />
                          <div className="card-body">
                            <h5>{trek.name}</h5>
                            <h6 className="fw-bold text-success">
                              {trek.price}
                            </h6>

                            {/* Correct Trek Navigation */}
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
                img: "/TourImages/himachaltours.png",
                state: { region: "himachal" },
              },
              {
                name: "Uttarakhand Tours",
                price: "Starting ₹7,499",
                img: "/TourImages/uttarakhandtours.png",
                state: { region: "uttarakhand" },
              },
              {
                name: "Rajasthan Tours",
                price: "Starting ₹5,999",
                img: "/TourImages/Rajasthan.png",
                state: { region: "rajasthan" },
              },
              {
                name: "NorthEast Tours",
                price: "Starting ₹8,999",
                img: "/TourImages/northeast.png",
                state: { region: "northeast" },
              },
              {
                name: "Kashmir & Leh Tours",
                price: "Starting ₹9,999",
                img: "/TourImages/leh.png",
                state: { region: "kashmir" },
              },
              {
                name: "South India Tours",
                price: "Starting ₹4,999",
                img: "/TourImages/south.png",
                state: { region: "southindia" },
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
                            className="card-img-top standard-img"
                            alt={tour.name}
                          />
                          <div className="card-body">
                            <h5>{tour.name}</h5>
                            <h6 className="fw-bold text-success">
                              {tour.price}
                            </h6>
                            {/* Correct Tour Navigation */}
                            <Link
                              to="/tours"
                              state={tour.state}
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

      {/* ================= HERITAGE WALKS ================= */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold">
            Explore Pune Heritage Walks
          </h2>

          <p className="text-center text-muted mb-5">
            Discover history, culture, and hidden gems of Pune.
          </p>

          {(() => {
            const heritage = [
              {
                name: "Old Pune City Walk",
                price: "Starting ₹399",
                img: "/HeritageImages/pune.png",
                state: { category: "city" },
              },
              {
                name: "Forts & Landmarks Walk",
                price: "Starting ₹699",
                img: "/HeritageImages/shanivaarwada.png",
                state: { category: "forts" },
              },
              {
                name: "Temple & Cultural Walk",
                price: "Starting ₹299",
                img: "/HeritageImages/cultural.png",
                state: { category: "temples" },
              },
            ];

            return (
              <div className="row g-4">
                {heritage.map((item, i) => (
                  <div className="col-md-4" key={i}>
                    <div className="card border-0 shadow-sm h-100 text-center">
                      <img
                        src={item.img}
                        className="card-img-top standard-img"
                        alt={item.name}
                      />
                      <div className="card-body">
                        <h5>{item.name}</h5>
                        <h6 className="fw-bold text-success">
                          {item.price}
                        </h6>

                        <Link
                          to="/heritage"
                          state={item.state}
                          className="btn btn-success mt-3"
                        >
                          Explore →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

          <div className="text-center mt-4">
            <Link to="/heritage" className="btn btn-outline-success px-4">
              View All Heritage Walks →
            </Link>
          </div>
        </div>
      </section>

      {/* ================= RENTALS ================= */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold">
            Adventure Rentals & Essentials
          </h2>

          <p className="text-center text-muted mb-5">
            Rent high-quality gear & stays for your next adventure.
          </p>

          <div className="row g-4">

            {[
              {
                name: "Tents on Rent",
                price: "Starting ₹299/day",
                img: "/images/rentals/tent.jpg",
                state: { category: "Tents" },
              },
              {
                name: "Trekking Gear",
                price: "Starting ₹149/day",
                img: "/images/rentals/gear.jpg",
                state: { category: "Gear" },
              },
              {
                name: "Villas on Rent",
                price: "Starting ₹5999/night",
                img: "/images/rentals/villa.jpg",
                state: { category: "Villas" },
              },
            ].map((item, index) => (
              <div className="col-md-4" key={index}>
                <div className="card border-0 shadow-sm h-100 text-center">

                  <img
                    src={item.img}
                    className="card-img-top standard-img"
                    alt={item.name}
                  />

                  <div className="card-body d-flex flex-column">
                    <h5>{item.name}</h5>

                    <h6 className="fw-bold text-success">
                      {item.price}
                    </h6>

                    <Link
                      to="/rentals"
                      state={item.state}
                      className="btn btn-success mt-auto"
                    >
                      Explore →
                    </Link>
                  </div>

                </div>
              </div>
            ))}

          </div>

          <div className="text-center mt-4">
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
