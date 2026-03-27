import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { getAdminItems, normaliseItem } from "../../data/adminStorage";
import { toursData as defaultToursData } from "../../data/toursData";
import { parseJsonValue } from "../../data/manaliTourDetails";
import { createWhatsAppInquiryUrl } from "../../utils/leadActions";

const REGION_ORDER = [
  "himachal",
  "kashmir",
  "northeast",
  "rajasthan",
  "kerala",
  "uttarakhand",
];

const REGION_LABELS = {
  himachal: "Himachal",
  kashmir: "Kashmir & Leh",
  northeast: "NorthEast",
  rajasthan: "Rajasthan",
  kerala: "Kerala",
  uttarakhand: "Uttarakhand",
};

const KERALA_TOUR_MATCHER =
  /kerala|munnar|thekkady|alleppey|alappuzha|kochi|kochin|athirapally|athirappilly|kanyakumari/i;

const slugifyTourName = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function dedupeTours(items = []) {
  const bySlug = new Map();

  items.forEach((tour) => {
    const slug = slugifyTourName(tour.slug || tour.name || "");
    if (!slug) return;
    bySlug.set(slug, tour);
  });

  return Array.from(bySlug.values());
}

function Tours() {
  const location = useLocation();
  const selectedRegion = location.state?.region || null;

  const tourData = JSON.parse(JSON.stringify(defaultToursData));

  getAdminItems("gt_tours")
    .filter((tour) => tour.active !== false)
    .forEach((tour) => {
      const item = normaliseItem(tour);
      const gallery = parseJsonValue(item.imageGallery, [item.image]).filter(Boolean);
      if (!tourData[item.region]) tourData[item.region] = [];
      tourData[item.region].push({ ...item, image: gallery[0] || item.image });
    });

  Object.keys(tourData).forEach((region) => {
    tourData[region] = dedupeTours(tourData[region]);
  });

  const displayTourData = {
    ...tourData,
    kerala: dedupeTours(
      (tourData.southindia || []).filter((tour) =>
        KERALA_TOUR_MATCHER.test(
          `${tour.name} ${tour.subtitle || ""} ${tour.destinationLine || ""}`
        )
      )
    ),
  };

  delete displayTourData.southindia;

  const regions = REGION_ORDER.filter(
    (region) => Array.isArray(displayTourData[region]) && displayTourData[region].length
  );

  const regionRefs = {
    himachal: useRef(null),
    kashmir: useRef(null),
    northeast: useRef(null),
    rajasthan: useRef(null),
    kerala: useRef(null),
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
          <h4 className="fw-bold mb-4 text-success">
            {REGION_LABELS[region] || region} Tours
          </h4>

          <div className="row g-4">
            {(displayTourData[region] || []).map((tour, index) => (
              <div className="col-md-4" key={`${region}-${tour.name}-${index}`}>
                <div className="card shadow-lg border-0 rounded-4 overflow-hidden h-100">
                  <img
                    src={tour.image}
                    alt={tour.name}
                    style={{ height: "220px", objectFit: "cover" }}
                  />

                  <div className="card-body">
                    <h5 className="fw-bold">{tour.name}</h5>

                    <div className="mb-2">
                      ⏱ <strong>{tour.duration}</strong>
                    </div>

                    <div className="mb-2">
                      <span className="text-muted text-decoration-line-through me-2">
                        ₹{tour.originalPrice}
                      </span>
                      <span className="fw-bold fs-5">₹{tour.price}</span>
                    </div>

                    <div className="small mb-3">
                      📅 <strong>Next:</strong> {tour.nextDate}
                    </div>

                    <div className="d-flex gap-2 flex-wrap">
                      <button className="btn btn-success w-50">Book Now</button>

                      <Link
                        to={`/tours/${slugifyTourName(tour.slug || tour.name)}`}
                        className="btn btn-outline-success w-50"
                      >
                        View Details
                      </Link>
                      <a
                        href={createWhatsAppInquiryUrl({
                          packageName: tour.name,
                          location: tour.destinationLine || REGION_LABELS[region] || region,
                          category: "Tour",
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

export default Tours;
