import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { getAdminItems, normaliseItem } from "../../data/adminStorage";
import { createWhatsAppInquiryUrl } from "../../utils/leadActions";

function Heritage() {
  const location = useLocation();
  const selectedCategory = location.state?.category || null;

  const heritageData = {
    city: [
      {
        name: "Shaniwar Wada Heritage Walk",
        location: "Pune",
        duration: "2-3 Hours",
        type: "City",
        price: 499,
        originalPrice: 799,
        nextDate: "20 Sept 2025",
        rating: 4.8,
        reviews: 120,
        image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09c",
      },
      {
        name: "Kasba Peth Walk",
        location: "Pune",
        duration: "2 Hours",
        type: "City",
        price: 399,
        originalPrice: 699,
        nextDate: "22 Sept 2025",
        rating: 4.7,
        reviews: 90,
        image: "https://images.unsplash.com/photo-1581091215367-59ab6b2d6c2d",
      },
      {
        name: "Tulshibaug Market Walk",
        location: "Pune",
        duration: "2 Hours",
        type: "City",
        price: 399,
        originalPrice: 699,
        nextDate: "25 Sept 2025",
        rating: 4.6,
        reviews: 75,
        image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1",
      },
    ],

    forts: [
      {
        name: "Sinhagad Fort Walk",
        location: "Pune",
        duration: "Half Day",
        type: "Fort",
        price: 799,
        originalPrice: 1199,
        nextDate: "21 Sept 2025",
        rating: 4.9,
        reviews: 210,
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      },
      {
        name: "Purandar Fort Walk",
        location: "Pune",
        duration: "1 Day",
        type: "Fort",
        price: 999,
        originalPrice: 1399,
        nextDate: "28 Sept 2025",
        rating: 4.8,
        reviews: 150,
        image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
      },
      {
        name: "Lohagad Fort Walk",
        location: "Lonavala",
        duration: "Half Day",
        type: "Fort",
        price: 699,
        originalPrice: 999,
        nextDate: "24 Sept 2025",
        rating: 4.7,
        reviews: 130,
        image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff",
      },
    ],

    temples: [
      {
        name: "Dagdusheth Ganpati Walk",
        location: "Pune",
        duration: "2 Hours",
        type: "Temple",
        price: 299,
        originalPrice: 599,
        nextDate: "19 Sept 2025",
        rating: 4.9,
        reviews: 300,
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5",
      },
      {
        name: "Parvati Hill Temple Walk",
        location: "Pune",
        duration: "2-3 Hours",
        type: "Temple",
        price: 399,
        originalPrice: 699,
        nextDate: "23 Sept 2025",
        rating: 4.8,
        reviews: 180,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      },
      {
        name: "Sarasbaug Walk",
        location: "Pune",
        duration: "2 Hours",
        type: "Temple",
        price: 299,
        originalPrice: 599,
        nextDate: "26 Sept 2025",
        rating: 4.7,
        reviews: 140,
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      },
    ],
  };

  /* Merge admin-created heritage walks, respecting Live/Off status */
  const _adminHeritage = getAdminItems("gt_heritage");
  const _adminByName = new Map(_adminHeritage.map((w) => [(w.name || "").toLowerCase(), w]));

  // Remove hardcoded items that admin has toggled Off
  Object.keys(heritageData).forEach((cat) => {
    heritageData[cat] = heritageData[cat].filter((w) => {
      const adminItem = _adminByName.get((w.name || "").toLowerCase());
      return !adminItem || adminItem.active !== false;
    });
  });

  // Append admin-only items (not duplicates of hardcoded) that are active
  const _hardcodedNames = new Set(Object.values(heritageData).flat().map((w) => (w.name || "").toLowerCase()));
  _adminHeritage
    .filter((w) => w.active !== false && !_hardcodedNames.has((w.name || "").toLowerCase()))
    .forEach((w) => {
      const item = normaliseItem(w);
      const cat = (item.type || "city").toLowerCase();
      if (!heritageData[cat]) heritageData[cat] = [];
      heritageData[cat].push(item);
    });

  const categories = Object.keys(heritageData);

  const categoryRefs = {
    city: useRef(null),
    forts: useRef(null),
    temples: useRef(null),
  };

  useEffect(() => {
    if (selectedCategory && categoryRefs[selectedCategory]) {
      categoryRefs[selectedCategory].current?.scrollIntoView({
        behavior: "smooth",
      });

      window.history.replaceState({}, document.title);
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [selectedCategory]);

  return (
    <div className="container py-5">
      <h2 className="fw-bold text-center mb-5 text-success">
        Pune Heritage Walks
      </h2>

      {categories.map((category) => (
        <div key={category} ref={categoryRefs[category]} className="mb-5">
          <h4 className="fw-bold mb-4 text-success">
            {category === "city"
              ? "Old Pune City Heritage Walk"
              : category === "forts"
              ? "Historical Forts & Landmarks Walk"
              : "Cultural & Temple Heritage Walk"}
          </h4>

          <div className="row g-4">
            {heritageData[category].map((item, index) => (
              <div className="col-md-4" key={index}>
                <div className="card shadow-lg border-0 rounded-4 overflow-hidden h-100">

                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ height: "220px", objectFit: "cover" }}
                  />

                  <div className="card-body">

                    {/* Title */}
                    <h5 className="fw-bold">{item.name}</h5>

                    {/* Location */}
                    <p className="text-muted small mb-2">
                      📍 {item.location}
                    </p>

                    {/* Badges */}
                    <div className="d-flex gap-2 mb-3">
                      <span className="badge bg-success">
                        {item.type}
                      </span>

                      <span className="badge bg-light text-dark border">
                        ⏱ {item.duration}
                      </span>
                    </div>

                    {/* Pricing */}
                    <div className="mb-2">
                      <span className="text-muted text-decoration-line-through me-2">
                        ₹{item.originalPrice}
                      </span>
                      <span className="fw-bold fs-5">
                        ₹{item.price}
                      </span>
                      <div className="small text-muted">
                        Starting from
                      </div>
                    </div>

                    {/* Next Date */}
                    <div className="small mb-3">
                      📅 <strong>Next:</strong> {item.nextDate}
                    </div>

                    {/* Buttons */}
                    <div className="d-flex gap-2 flex-wrap">
                      <button className="btn btn-success w-50">
                        Book Now
                      </button>

                      <Link
                        to={`/heritage/${item.name
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")}`}
                        className="btn btn-outline-success w-50"
                      >
                        View Details
                      </Link>
                      <a
                        href={createWhatsAppInquiryUrl({
                          packageName: item.name,
                          location: item.location,
                          category: "Heritage Walk",
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-success w-100"
                      >
                        WhatsApp
                      </a>
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

export default Heritage;
