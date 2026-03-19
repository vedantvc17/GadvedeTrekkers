import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { findTrekBySlug, slugifyTrekName } from "../../data/treks";
import {
  kalsubaiOverview,
  kalsubaiHistory,
  kalsubaiHighlights,
  kalsubaiEventDetails,
  kalsubaiPricing,
  kalsubaiWhyJoin,
  kalsubaiItineraries,
  kalsubaiBookingSteps,
} from "../../data/kalsubaiDetails";
import {
  harishchandragadOverview,
  harishchandragadHistory,
  harishchandragadHighlights,
  harishchandragadEventDetails,
  harishchandragadPricing,
  harishchandragadWhyJoin,
  harishchandragadItineraries,
  harishchandragadBookingSteps,
  harishchandragadPlacesToVisit,
  harishchandragadInclusions,
  harishchandragadExclusions,
  harishchandragadThingsToCarry,
  harishchandragadDiscountCodes,
} from "../../data/harishchandragadDetails";
import KalsubaiRouteMap from "../../components/KalsubaiRouteMap";
import HarishchandragadRouteMap from "../../components/HarishchandragadRouteMap";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "gallery", label: "Photo Gallery" },
  { id: "route", label: "Trek Route" },
  { id: "itinerary", label: "Itinerary" },
  { id: "details", label: "Details & Cost" },
];

const KALSUBAI_ITINERARY_KEYS = ["kasara", "mumbai", "pune"];
const HC_ITINERARY_KEYS = ["pune"];

function TrekDetails() {
  const { id } = useParams();
  const trek = id ? findTrekBySlug(id) : null;
  const isKalsubai = trek?.name === "Kalsubai Trek";
  const isHarishchandragad = trek?.name === "Harishchandragad Trek";
  const isRich = isKalsubai || isHarishchandragad;

  const [activeTab, setActiveTab] = useState("overview");
  const [activeItinerary, setActiveItinerary] = useState(isHarishchandragad ? "pune" : "kasara");
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });

    if (isKalsubai) {
      document.title = `Kalsubai Trek 2025 | Highest Peak Maharashtra | Night Trek | Gadvede Trekkers`;
      const setMeta = (name, content) => {
        let el = document.querySelector(`meta[name="${name}"]`);
        if (!el) { el = document.createElement("meta"); el.name = name; document.head.appendChild(el); }
        el.content = content;
      };
      setMeta("description", "Book Kalsubai Trek — Maharashtra's highest peak (5400 ft). Night trek from Mumbai, Pune & Kasara. Sunrise, Milky Way, Temple darshan. Starting ₹799. Expert guides, safe batches.");
      setMeta("keywords", "Kalsubai trek booking, Kalsubai night trek, highest peak Maharashtra, Kalsubai from Mumbai, Kalsubai from Pune, Kalsubai from Kasara, Bari village trek, Sahyadri trek 2025");
    }

    if (isHarishchandragad) {
      document.title = `Harishchandragad Trek 2025 | Konkan Kada | Kedareshwar Cave | Gadvede Trekkers`;
      const setMeta = (name, content) => {
        let el = document.querySelector(`meta[name="${name}"]`);
        if (!el) { el = document.createElement("meta"); el.name = name; document.head.appendChild(el); }
        el.content = content;
      };
      setMeta("description", "Book Harishchandragad Trek from Pune 2025. Night trek to Maharashtra's iconic hill fort — Konkan Kada, Kedareshwar Cave, Harishchandreshwar Temple. ₹1,449/person. Expert guides, safe batches.");
      setMeta("keywords", "Harishchandragad trek, Harishchandragad from Pune, Konkan Kada, Kedareshwar cave, Pachnai village trek, Harishchandragad 2025, Maharashtra fort trek");
    }
  }, [isKalsubai, isHarishchandragad]);

  const formattedName = trek?.name
    ?? (id ? id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Trek Details");

  /* ── Basic layout for non-rich treks ── */
  if (!isRich) {
    return (
      <div className="trek-details-basic container py-5">
        <h1 className="fw-bold text-center mb-2 text-success">{formattedName}</h1>
        {trek ? (
          <>
            <p className="text-center text-muted mb-4">
              {trek.location} &nbsp;|&nbsp; {trek.duration} &nbsp;|&nbsp; {trek.altitude}
            </p>
            <div className="text-center mb-4">
              {trek.gallery?.map((img, i) => (
                <img key={i} src={img} alt={`${trek.name} ${i + 1}`}
                  style={{ width: "30%", margin: "6px", borderRadius: 16, objectFit: "cover", aspectRatio: "4/3" }} />
              ))}
            </div>
            <div className="text-center">
              <Link to="/book" state={{ selectedTrek: trek }} className="btn btn-success px-5 py-3 fw-bold rounded-4">
                Book {trek.name} — ₹{trek.price}
              </Link>
            </div>
          </>
        ) : (
          <p className="text-center text-muted">Detailed itinerary coming soon for this trek.</p>
        )}
      </div>
    );
  }

  /* ── Resolve active data set ── */
  const overview = isKalsubai ? kalsubaiOverview : harishchandragadOverview;
  const history = isKalsubai ? kalsubaiHistory : harishchandragadHistory;
  const highlights = isKalsubai ? kalsubaiHighlights : harishchandragadHighlights;
  const eventDetails = isKalsubai ? kalsubaiEventDetails : harishchandragadEventDetails;
  const pricing = isKalsubai ? kalsubaiPricing : harishchandragadPricing;
  const whyJoin = isKalsubai ? kalsubaiWhyJoin : harishchandragadWhyJoin;
  const itineraries = isKalsubai ? kalsubaiItineraries : harishchandragadItineraries;
  const bookingSteps = isKalsubai ? kalsubaiBookingSteps : harishchandragadBookingSteps;
  const itineraryKeys = isKalsubai ? KALSUBAI_ITINERARY_KEYS : HC_ITINERARY_KEYS;
  const itinerary = itineraries[activeItinerary] ?? itineraries[itineraryKeys[0]];

  const heroKicker = isKalsubai ? "🏔 Maharashtra's Highest Peak" : "🏔 Ancient Hill Fort — Konkan Kada";
  const heroTagline = overview.tagline;

  /* ── Rich Details Page ── */
  return (
    <div className="td-page">

      {/* ── HERO ── */}
      <div className="td-hero" style={{ backgroundImage: `url(${trek.gallery[0]})` }}>
        <div className="td-hero-overlay" />
        <div className="td-hero-content container-fluid td-shell">
          <span className="td-kicker">{heroKicker}</span>
          <h1 className="td-heading">{trek.name}</h1>
          <p className="td-subheading">{heroTagline}</p>

          <div className="td-stats-bar">
            {[
              { icon: "📍", label: trek.location },
              { icon: "⏱", label: trek.duration },
              { icon: "🏔", label: trek.altitude },
              { icon: "⚡", label: trek.difficulty },
              { icon: "⭐", label: `${trek.rating} (${trek.reviews} reviews)` },
              { icon: "💰", label: `From ₹${trek.price}` },
            ].map((s) => (
              <div className="td-stat" key={s.label}>
                <span className="td-stat-icon">{s.icon}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          <div className="td-hero-actions">
            <Link to="/book" state={{ selectedTrek: trek }} className="btn td-book-btn">
              Book Now — ₹{trek.price}
            </Link>
            <button className="btn td-itinerary-btn" onClick={() => setActiveTab("itinerary")}>
              View Itinerary
            </button>
          </div>
        </div>
      </div>

      {/* ── STICKY TABS ── */}
      <div className="td-tabs-wrapper" role="tablist">
        <div className="td-tabs container-fluid td-shell">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`td-tab${activeTab === tab.id ? " active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="container-fluid td-shell td-body">

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <div className="td-section">
            <div className="td-overview-grid">
              <div className="td-overview-main">
                <div className="td-card">
                  <h2 className="td-section-title">About {trek.name}</h2>
                  <p className="td-para">{overview.intro}</p>

                  {isKalsubai && (
                    <>
                      <h3 className="td-subsection-title">🌌 Kalsubai Night Trek</h3>
                      <p className="td-para">{overview.nightTrek}</p>
                      <h3 className="td-subsection-title">🌧 Kalsubai Monsoon Trek</h3>
                      <p className="td-para">{overview.monsoon}</p>
                    </>
                  )}

                  {isHarishchandragad && (
                    <>
                      <h3 className="td-subsection-title">🏯 History & Significance</h3>
                      <p className="td-para">{overview.history}</p>
                      <h3 className="td-subsection-title">🗺 Main Attractions</h3>
                      <p className="td-para">{overview.mainAttractions}</p>
                    </>
                  )}
                </div>

                <div className="td-card">
                  <h2 className="td-section-title">{isKalsubai ? "History & Legend" : "Detailed History"}</h2>
                  <p className="td-para">{history}</p>
                </div>

                {/* Places to Visit (Harishchandragad only) */}
                {isHarishchandragad && (
                  <div className="td-card">
                    <h2 className="td-section-title">Places to Visit on Harishchandragad</h2>
                    <div className="td-places-list">
                      {harishchandragadPlacesToVisit.map((place) => (
                        <div className="td-place-item" key={place.name}>
                          <span className="td-place-icon">{place.icon}</span>
                          <div>
                            <strong className="td-place-name">{place.name}</strong>
                            <p className="td-place-desc">{place.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="td-overview-side">
                {/* Highlights */}
                <div className="td-card td-highlights-card">
                  <h3 className="td-section-title">Trek Highlights</h3>
                  <ul className="td-highlights-list">
                    {highlights.map((h) => (
                      <li key={h.text} className="td-highlight-item">
                        <span className="td-highlight-icon">{h.icon}</span>
                        <span>{h.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Discount Codes (Harishchandragad only) */}
                {isHarishchandragad && (
                  <div className="td-card" style={{ marginTop: 16 }}>
                    <h3 className="td-section-title">Discount Offers</h3>
                    <div className="td-discount-codes">
                      {harishchandragadDiscountCodes.map((d) => (
                        <div className="td-discount-item" key={d.code}>
                          <span className="td-discount-code">{d.code}</span>
                          <span className="td-discount-desc">{d.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Why Join */}
                <div className="td-why-grid" style={{ marginTop: 16 }}>
                  {whyJoin.map((w) => (
                    <div className="td-why-card" key={w.title}>
                      <span className="td-why-icon">{w.icon}</span>
                      <strong>{w.title}</strong>
                      <p>{w.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── GALLERY TAB ── */}
        {activeTab === "gallery" && (
          <div className="td-section">
            <h2 className="td-section-title">Photo Gallery</h2>
            <p className="td-muted">Hover to zoom · Click to view full screen</p>
            <div className="td-gallery-grid">
              {[...trek.gallery, ...trek.gallery].map((img, i) => (
                <div
                  className="td-gallery-item"
                  key={i}
                  onClick={() => setLightboxImg(img)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${trek.name} photo ${i + 1}`}
                  onKeyDown={(e) => e.key === "Enter" && setLightboxImg(img)}
                >
                  <img
                    src={img}
                    alt={`${trek.name} - Photo ${i + 1}`}
                    className="td-gallery-img"
                    loading="lazy"
                  />
                  <div className="td-gallery-zoom">🔍 View</div>
                </div>
              ))}
            </div>

            {lightboxImg && (
              <div className="td-lightbox" onClick={() => setLightboxImg(null)}>
                <div className="td-lightbox-inner" onClick={(e) => e.stopPropagation()}>
                  <img src={lightboxImg} alt="Full view" />
                  <button className="td-lightbox-close" onClick={() => setLightboxImg(null)}>✕</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ROUTE MAP TAB ── */}
        {activeTab === "route" && (
          <div className="td-section">
            <h2 className="td-section-title">Trek Route Map</h2>
            <p className="td-muted">
              {isKalsubai
                ? "AI-generated visual route from Bari Village to Kalsubai Summit"
                : "AI-generated visual route from Pachnai Village to Harishchandragad Summit & Konkan Kada"}
            </p>
            {isKalsubai ? <KalsubaiRouteMap /> : <HarishchandragadRouteMap />}
            <div className="td-route-info-grid">
              {isKalsubai
                ? [
                    { label: "Start Point", value: "Bari Village (680m)", icon: "🏘" },
                    { label: "Summit", value: "Kalsubai Peak (1646m)", icon: "🏔" },
                    { label: "Distance (one way)", value: "5.5 km", icon: "📏" },
                    { label: "Climb Time", value: "3.5 – 4 hours", icon: "⏱" },
                    { label: "Trail Type", value: "Rocky + Ladders", icon: "🪜" },
                    { label: "Difficulty", value: "Medium", icon: "⚡" },
                  ]
                : [
                    { label: "Start Point", value: "Pachnai Village (2592 ft)", icon: "🏘" },
                    { label: "Summit", value: "Taramati Peak (4650 ft)", icon: "🏔" },
                    { label: "Distance (one way)", value: "5 km", icon: "📏" },
                    { label: "Climb Time", value: "3 hours", icon: "⏱" },
                    { label: "Side Trip", value: "Konkan Kada Cliff", icon: "🪨" },
                    { label: "Difficulty", value: "Medium", icon: "⚡" },
                  ]
              }
              .map((r) => (
                <div className="td-route-info-item" key={r.label}>
                  <span className="td-route-icon">{r.icon}</span>
                  <div>
                    <div className="td-route-label">{r.label}</div>
                    <div className="td-route-value">{r.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ITINERARY TAB ── */}
        {activeTab === "itinerary" && (
          <div className="td-section">
            <h2 className="td-section-title">Trek Itinerary</h2>
            <p className="td-muted">
              {itineraryKeys.length > 1
                ? "Choose your departure route to see the itinerary"
                : "Departure from Pune"}
            </p>

            {/* Route selector — only shown when multiple options */}
            {itineraryKeys.length > 1 && (
              <div className="td-itinerary-selector" role="radiogroup" aria-label="Select departure route">
                {itineraryKeys.map((key) => {
                  const it = itineraries[key];
                  return (
                    <label
                      key={key}
                      className={`td-itinerary-option${activeItinerary === key ? " active" : ""}`}
                    >
                      <input
                        type="radio"
                        name="itineraryRoute"
                        value={key}
                        checked={activeItinerary === key}
                        onChange={() => setActiveItinerary(key)}
                      />
                      <span className="td-itinerary-icon">{it.icon}</span>
                      <div>
                        <span className="td-itinerary-label">{it.label}</span>
                        <span className="td-itinerary-sublabel">{it.sublabel}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Note */}
            <div className="td-itinerary-note">
              ⚠️ {itinerary.note}
            </div>

            {/* Timeline */}
            <div className="td-timeline">
              {itinerary.days.map((day, di) => (
                <div className="td-timeline-day" key={di}>
                  <div className="td-timeline-day-title">{day.title}</div>
                  <div className="td-timeline-events">
                    {day.events.map((ev, ei) => (
                      <div className="td-timeline-event" key={ei}>
                        <div className="td-timeline-time">{ev.time}</div>
                        <div className="td-timeline-dot" />
                        <div className="td-timeline-desc">{ev.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* How to book */}
            <div className="td-card td-booking-steps-card">
              <h3 className="td-section-title">How to Book?</h3>
              <ol className="td-booking-steps">
                {bookingSteps.map((step, i) => (
                  <li key={i} className="td-booking-step">
                    <span className="td-booking-step-num">{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <Link to="/book" state={{ selectedTrek: trek }} className="btn td-book-btn" style={{ marginTop: 20 }}>
                Book Now
              </Link>
            </div>
          </div>
        )}

        {/* ── DETAILS & COST TAB ── */}
        {activeTab === "details" && (
          <div className="td-section">
            <div className="td-details-grid">
              {/* Event Details */}
              <div className="td-card">
                <h2 className="td-section-title">Trek Details</h2>
                <table className="td-details-table">
                  <tbody>
                    {Object.entries(
                      isKalsubai
                        ? {
                            "Difficulty Level": kalsubaiEventDetails.difficulty,
                            "Endurance Level": kalsubaiEventDetails.endurance,
                            "Base Village": kalsubaiEventDetails.baseVillage,
                            "Region": kalsubaiEventDetails.region,
                            "Duration": kalsubaiEventDetails.duration,
                            "Climb Time (one way)": kalsubaiEventDetails.climbTime,
                            "Distance (one way)": kalsubaiEventDetails.distance,
                            "Altitude": kalsubaiEventDetails.altitude,
                            "Minimum Group": kalsubaiEventDetails.minGroup,
                            "Wildlife Sanctuary": kalsubaiEventDetails.sanctuary,
                          }
                        : {
                            "Difficulty Level": harishchandragadEventDetails.difficulty,
                            "Endurance Level": harishchandragadEventDetails.endurance,
                            "Base Village": harishchandragadEventDetails.baseVillage,
                            "Region": harishchandragadEventDetails.region,
                            "Duration": harishchandragadEventDetails.duration,
                            "Climb Time (one way)": harishchandragadEventDetails.climbTime,
                            "Distance (one way)": harishchandragadEventDetails.distance,
                            "Altitude": harishchandragadEventDetails.altitude,
                            "Drive from Pune": harishchandragadEventDetails.driveFromPune,
                            "Wildlife Sanctuary": harishchandragadEventDetails.sanctuary,
                          }
                    ).map(([key, val]) => (
                      <tr key={key}>
                        <td className="td-table-key">{key}</td>
                        <td className="td-table-val">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pricing + Inclusions */}
              <div>
                <div className="td-card">
                  <h2 className="td-section-title">Pricing</h2>
                  <div className="td-pricing-cards">
                    {Object.values(pricing).map((p) => (
                      <div className="td-pricing-card" key={p.label}>
                        <div className="td-pricing-label">{p.label}</div>
                        <div className="td-pricing-price">₹{p.price}<span>/person</span></div>
                        <Link to="/book" state={{ selectedTrek: trek }} className="btn td-pricing-book-btn">
                          Book This
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inclusions / Exclusions */}
                <div className="td-card" style={{ marginTop: 18 }}>
                  <h3 className="td-section-title">What's Included / Not Included</h3>
                  <ul className="td-inclusions">
                    {(isKalsubai
                      ? [
                          "✅ Expert certified trek leader",
                          "✅ Breakfast at summit",
                          "✅ Veg lunch at base village",
                          "✅ Local jeep from Kasara (train batch)",
                          "✅ First aid kit",
                          "✅ E-certificate on completion",
                          "✅ WhatsApp group coordination",
                          "❌ Train ticket (self-arranged)",
                          "❌ Personal expenses",
                        ]
                      : [...harishchandragadInclusions, ...harishchandragadExclusions]
                    ).map((item) => (
                      <li key={item} className="td-inclusion-item">{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Things to Carry (Harishchandragad only) */}
                {isHarishchandragad && (
                  <div className="td-card" style={{ marginTop: 18 }}>
                    <h3 className="td-section-title">Things to Carry</h3>
                    <ul className="td-inclusions">
                      {harishchandragadThingsToCarry.map((item) => (
                        <li key={item} className="td-inclusion-item">🎒 {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── STICKY BOTTOM CTA ── */}
      <div className="td-cta-bar">
        <div className="td-cta-info">
          <span className="td-cta-name">{trek.name}</span>
          <span className="td-cta-meta">{trek.location} · {trek.duration} · {trek.altitude}</span>
        </div>
        <div className="td-cta-price">
          <span className="td-cta-from">from</span>
          <span className="td-cta-amount">₹{trek.price}</span>
          <span className="td-cta-orig">₹{trek.originalPrice}</span>
        </div>
        <Link to="/book" state={{ selectedTrek: trek }} className="btn td-cta-book-btn">
          Book Now
        </Link>
      </div>
    </div>
  );
}

export default TrekDetails;
