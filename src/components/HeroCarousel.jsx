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
            className="hero-slide d-flex align-items-center justify-content-center text-white text-center position-relative"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "90vh",
              animation: "zoomEffect 20s ease-in-out infinite"
            }}
          >
            <div className="overlay"></div>

            <div className="hero-content animate-content">
              <h1 className="display-3 fw-bold">
                Explore the Best Treks <br />
                &{" "}
                <span className="highlight-text">
                  Budget Tours
                </span>
              </h1>

              <p className="lead mt-3 fade-in">
                Pune | Mumbai | Delhi | Bangalore | Goa
              </p>

              <div className="mt-4">
                <Link to="/treks" className="btn btn-success px-4 py-2 me-3 hero-btn">
                  View Upcoming Treks
                </Link>

                <Link to="/contact" className="btn btn-outline-light px-4 py-2 hero-btn-outline">
                  Contact on WhatsApp
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 2 */}
        <div className="carousel-item">
          <div
            className="hero-slide d-flex align-items-center justify-content-center text-white text-center position-relative"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1920&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "90vh",
              animation: "zoomEffect 20s ease-in-out infinite"
            }}
          >
            <div className="overlay"></div>

            <div className="hero-content animate-content">
              <h1 className="display-3 fw-bold">Himalayan Adventures</h1>

              <p className="lead mt-3 fade-in">
                Himachal | Uttarakhand | Kashmir
              </p>

              <Link to="/tours" className="btn btn-success px-4 py-2 mt-3 hero-btn">
                Explore Tours
              </Link>
            </div>
          </div>
        </div>

        {/* Slide 3 */}
        <div className="carousel-item">
          <div
            className="hero-slide d-flex align-items-center justify-content-center text-white text-center position-relative"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1920&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "90vh",
              animation: "zoomEffect 20s ease-in-out infinite"
            }}
          >
            <div className="overlay"></div>

            <div className="hero-content animate-content">
              <h1 className="display-3 fw-bold">Corporate & School Trips</h1>

              <p className="lead mt-3 fade-in">
                Safe | Customized | Team Building
              </p>

              <Link to="/corporate" className="btn btn-success px-4 py-2 mt-3 hero-btn">
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

      {/* Custom Styles */}
      <style>
        {`
          .overlay {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: linear-gradient(135deg, rgba(15,23,42,0.72) 0%, rgba(15,23,42,0.55) 100%);
          }

          .hero-content { position: relative; z-index: 2; }

          .animate-content { animation: fadeUp 1.2s ease forwards; }

          .fade-in { animation: fadeIn 2s ease; }

          .highlight-text {
            color: #D4A853;
            position: relative;
          }

          .highlight-text::after {
            content: '';
            position: absolute;
            left: 0; bottom: -5px;
            width: 100%; height: 4px;
            background: linear-gradient(90deg, #B8862D, #D4A853);
            border-radius: 2px;
            animation: pulseLine 2s infinite;
          }

          .hero-btn {
            background: linear-gradient(135deg, #0D9488, #14B8A6) !important;
            border: none !important;
            color: #fff !important;
            font-weight: 600;
            box-shadow: 0 4px 16px rgba(13, 148, 136, 0.35);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .hero-btn:hover {
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 8px 24px rgba(13, 148, 136, 0.5);
          }

          .hero-btn-outline {
            border: 2px solid rgba(255,255,255,0.5) !important;
            backdrop-filter: blur(8px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .hero-btn-outline:hover {
            background: rgba(255,255,255,0.1) !important;
            border-color: #D4A853 !important;
            color: #D4A853 !important;
            transform: translateY(-3px) scale(1.05);
          }

          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(30px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes zoomEffect {
            0%   { transform: scale(1); }
            50%  { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          @keyframes pulseLine {
            0%   { opacity: 0.6; }
            50%  { opacity: 1; }
            100% { opacity: 0.6; }
          }
        `}
      </style>

    </div>
  );
}

export default HeroCarousel;
