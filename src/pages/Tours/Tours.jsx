import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { getAdminItems, normaliseItem } from "../../data/adminStorage";

function Tours() {
  const location = useLocation();
  const selectedRegion = location.state?.region || null;

  const tourData = {
    himachal: [
      { name: "Manali Kullu Kasol",
        duration: "5-6 Days", 
        price: 9999, 
        originalPrice: 12999, 
        nextDate: "5 Oct 2025", 
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470" 
      },
      { name: "Manali Kasol Kheerganga", 
        duration: "6 Days", 
        price: 10999, 
        originalPrice: 13999, 
        nextDate: "10 Oct 2025", 
        image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff" 
      },
      { name: "Manali Kasol Jibhi", 
        duration: "6 Days", 
        price: 11499, 
        originalPrice: 14999, 
        nextDate: "15 Oct 2025", 
        image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429" 
      },
      { name: "Spiti Circuit", 
        duration: "8-10 Days", 
        price: 18999, 
        originalPrice: 22999, 
        nextDate: "20 Oct 2025", 
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" 
      },
      { name: "Winter Spiti Valley", 
        duration: "9 Days", 
        price: 19999, 
        originalPrice: 24999, 
        nextDate: "10 Jan 2026", 
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5" 
      },
    ],

    kashmir: [
      { name: "Kashmir Srinagar Gulmarg Sonamarg", 
        duration: "5 Days", 
        price: 14999, 
        originalPrice: 18999, 
        nextDate: "12 Oct 2025", 
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" 
      },
      { name: "Pahalgam", 
        duration: "4 Days", 
        price: 9999, 
        originalPrice: 12999, 
        nextDate: "18 Oct 2025", 
        image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff" 
      },
      { name: "Leh Nubra Pangong Leh", 
        duration: "6 Days", 
        price: 16999, 
        originalPrice: 20999, 
        nextDate: "25 Oct 2025", 
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470" 
      },
    ],

    northeast: [
      { name: "Meghalaya", 
        duration: "5 Days", 
        price: 13999, 
        originalPrice: 17999, 
        nextDate: "5 Oct 2025", 
        image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429" 
      },
      { name: "Kaziranga", 
        duration: "4 Days", 
        price: 11999, 
        originalPrice: 14999, 
        nextDate: "8 Oct 2025", 
        image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff" 
      },
      { name: "Sikkim Gangtok", 
        duration: "5 Days", 
        price: 14499, 
        originalPrice: 17999, 
        nextDate: "12 Oct 2025", 
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470" 
      },
    ],

    rajasthan: [
      { name: "Jodhpur Jaisalmer Udaipur", 
        duration: "6 Days", 
        price: 15999, 
        originalPrice: 19999, 
        nextDate: "15 Oct 2025", 
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" 
      },
      { name: "Jaipur Jaisalmer Jodhpur", 
        duration: "5 Days", 
        price: 13999, 
        originalPrice: 17999, 
        nextDate: "18 Oct 2025", 
        image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff" 
      },
    ],

    southindia: [
      { name: "Munnar Thekkady Alleppey", 
        duration: "5 Days", 
        price: 14999, 
        originalPrice: 18999, 
        nextDate: "10 Oct 2025", 
        image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429" 
      },
      { name: "Kerala with Kanyakumari", 
        duration: "6 Days", 
        price: 17999, 
        originalPrice: 21999, 
        nextDate: "14 Oct 2025", 
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470" 
      },
      { name: "Goa Backpacking", 
        duration: "4 Days", 
        price: 8999, 
        originalPrice: 11999, 
        nextDate: "20 Oct 2025", 
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" 
      },
    ],

    uttarakhand: [
      { name: "Kedarnath Yatra", 
        duration: "5 Days", 
        price: 11999, 
        originalPrice: 14999, 
        nextDate: "18 Oct 2025", 
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5" 
      },
      { name: "Char Dham Yatra", 
        duration: "10 Days", 
        price: 24999, 
        originalPrice: 29999, 
        nextDate: "25 Oct 2025", 
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470" 
      },
    ],
  };

  /* Merge admin-created tours into tourData */
  getAdminItems("gt_tours").filter((t) => t.active !== false).forEach((t) => {
    const item = normaliseItem(t);
    if (!tourData[item.region]) tourData[item.region] = [];
    tourData[item.region].push(item);
  });

  const regions = Object.keys(tourData);

  const regionRefs = {
    himachal: useRef(null),
    kashmir: useRef(null),
    northeast: useRef(null),
    rajasthan: useRef(null),
    southindia: useRef(null),
    uttarakhand: useRef(null),
  };

  useEffect(() => {
    if (selectedRegion && regionRefs[selectedRegion]) {
      regionRefs[selectedRegion].current?.scrollIntoView({
        behavior: "smooth",
      });
      window.history.replaceState({}, document.title);
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [selectedRegion]);

  return (
    <div className="container py-5">
      <h2 className="fw-bold text-center mb-5 text-success">
        Explore Tours by Region
      </h2>

      {regions.map((region) => (
        <div key={region} ref={regionRefs[region]} className="mb-5">
          <h4 className="fw-bold mb-4 text-success text-capitalize">
            {region} Tours
          </h4>

          <div className="row g-4">
            {tourData[region].map((tour, index) => (
              <div className="col-md-4" key={index}>
                <div className="card shadow-lg border-0 rounded-4 overflow-hidden h-100">

                  {/* Image */}
                  <img
                    src={tour.image}
                    alt={tour.name}
                    style={{ height: "220px", objectFit: "cover" }}
                  />

                  <div className="card-body">

                    {/* Title */}
                    <h5 className="fw-bold">{tour.name}</h5>

                    {/* Duration */}
                    <div className="mb-2">
                      ⏱ <strong>{tour.duration}</strong>
                    </div>

                    {/* Pricing */}
                    <div className="mb-2">
                      <span className="text-muted text-decoration-line-through me-2">
                        ₹{tour.originalPrice}
                      </span>
                      <span className="fw-bold fs-5">
                        ₹{tour.price}
                      </span>
                    </div>

                    {/* Next Date */}
                    <div className="small mb-3">
                      📅 <strong>Next:</strong> {tour.nextDate}
                    </div>

                    {/* Buttons */}
                    <div className="d-flex gap-2">
                      <button className="btn btn-success w-50">
                        Book Now
                      </button>

                      <Link
                        to={`/tours/${tour.name
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")}`}
                        className="btn btn-outline-success w-50"
                      >
                        View Details
                      </Link>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Tours;