import { Link } from "react-router-dom";

function HeroCarousel() {
  return (
    <div
      id="heroCarousel"
      className="carousel slide carousel-fade"
      data-bs-ride="carousel"
      data-bs-interval="5000"
    >
      {/* Indicators */}
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active"></button>
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2"></button>
      </div>

      <div className="carousel-inner">

        {/* Slide 1 */}
        <div className="carousel-item active">
          <div
            className="hero-slide d-flex align-items-center justify-content-center text-white text-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=80')"
            }}
          >
            <div className="hero-content">
              <h1 className="display-3 fw-bold">
                Explore the Best Treks <br /> & Budget Tours
              </h1>
              <p className="lead mt-3">
                Pune | Mumbai | Delhi | Bangalore | Goa
              </p>

              <div className="mt-4">
                <Link to="/treks" className="btn btn-success px-4 py-2 me-3">
                  View Upcoming Treks
                </Link>

                <Link to="/contact" className="btn btn-outline-light px-4 py-2">
                  Contact on WhatsApp
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 2 */}
        <div className="carousel-item">
          <div
            className="hero-slide d-flex align-items-center justify-content-center text-white text-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1920&q=80')"
            }}
          >
            <div className="hero-content">
              <h1 className="display-3 fw-bold">Himalayan Adventures</h1>
              <p className="lead mt-3">
                Himachal | Uttarakhand | Kashmir
              </p>

              <Link to="/tours" className="btn btn-success px-4 py-2 mt-3">
                Explore Tours
              </Link>
            </div>
          </div>
        </div>

        {/* Slide 3 */}
        <div className="carousel-item">
          <div
            className="hero-slide d-flex align-items-center justify-content-center text-white text-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1920&q=80')"
            }}
          >
            <div className="hero-content">
              <h1 className="display-3 fw-bold">Corporate & School Trips</h1>
              <p className="lead mt-3">
                Safe | Customized | Team Building
              </p>

              <Link to="/corporate" className="btn btn-success px-4 py-2 mt-3">
                Plan Now
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Arrows */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#heroCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon"></span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#heroCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon"></span>
      </button>

    </div>
  );
}

export default HeroCarousel;
