import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { findTrekBySlug, slugifyTrekName } from "../../data/treks";
import { getAdminItems, normaliseItem } from "../../data/adminStorage";
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

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "gallery", label: "Photo Gallery" },
  { id: "itinerary", label: "Itinerary" },
  { id: "details", label: "Details & Cost" },
];

const KALSUBAI_ITINERARY_KEYS = ["kasara", "mumbai", "pune"];
const HC_ITINERARY_KEYS = ["kasara", "pune"];

const parseJsonValue = (value, fallback) => {
  try {
    return JSON.parse(value || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
};

const parseLineItems = (value = "") =>
  String(value)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const parseDiscountItems = (value = "") =>
  parseLineItems(value).map((line) => {
    const [code, desc] = line.split("|");
    return { code: code || line, desc: desc || "" };
  });

const normaliseRouteKey = (city) =>
  String(city || "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z]/g, "");

const parseDeparturePlanItineraries = (departurePlans) =>
  Object.fromEntries(
    Object.entries(parseJsonValue(departurePlans, {})).map(([city, plan]) => {
      const key = normaliseRouteKey(city);
      const lines = parseLineItems(plan?.itinerary || "");
      const events = lines.map((line) => {
        const [, time = "", desc = line] = line.split("|");
        return { time, desc };
      });
      return [
        key,
        {
          label: `From ${city}`,
          sublabel: `${city} Route`,
          icon: city === "Mumbai" ? "🚂" : "🚌",
          note: `${city} departure itinerary`,
          days: [{ title: `${city} Departure`, events }],
        },
      ];
    })
  );

function TrekDetails() {
  const { id } = useParams();
  const previewDraft = typeof window !== "undefined" ? sessionStorage.getItem("gt_trek_preview") : null;
  const previewItem = parseJsonValue(previewDraft, null);
  const previewSlug = previewItem?.name ? slugifyTrekName(previewItem.name) : "";
  const adminMatch = getAdminItems("gt_treks").find((item) => slugifyTrekName(item.name || "") === id);
  const adminTrek = adminMatch
    ? (() => {
        const fallbackGallery = [adminMatch.image, adminMatch.image, adminMatch.image].filter(Boolean);
        const gallery = parseJsonValue(adminMatch.imageGallery, fallbackGallery);
        return {
          ...normaliseItem(adminMatch),
          image: gallery[0] || adminMatch.image,
          gallery,
        };
      })()
    : null;
  const previewTrek = previewItem && previewSlug === id
    ? (() => {
        const fallbackGallery = [previewItem.image, previewItem.image, previewItem.image].filter(Boolean);
        const gallery = parseJsonValue(previewItem.imageGallery, fallbackGallery);
        return {
          ...normaliseItem(previewItem),
          image: gallery[0] || previewItem.image,
          gallery,
        };
      })()
    : null;
  const trek = previewTrek || adminTrek || (id ? findTrekBySlug(id) : null);
  const isKalsubai = trek?.name === "Kalsubai Trek";
  const isHarishchandragad = trek?.name === "Harishchandragad Trek";
  const isRich = isKalsubai || isHarishchandragad;

  const [activeTab, setActiveTab] = useState("overview");
  const [activeItinerary, setActiveItinerary] = useState("kasara");
  const [lightboxImg, setLightboxImg] = useState(null);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

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

  useEffect(() => {
    setCurrentHeroSlide(0);
  }, [trek?.name]);

  useEffect(() => {
    if (!trek?.gallery?.length || trek.gallery.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % trek.gallery.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [trek?.gallery]);

  const formattedName = trek?.name
    ?? (id ? id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Trek Details");
  const heroImages = trek?.gallery?.length ? trek.gallery.slice(0, 3) : [];

  /* ── Basic layout for non-rich treks ── */
  if (!isRich) {
    return (
      <div className="td-page">
        {trek ? (
          <>
            <div className="td-hero">
              <div className="td-hero-slides">
                {heroImages.map((image, index) => (
                  <div
                    key={`${trek.name}-basic-hero-${index}`}
                    className={`td-hero-slide${index === currentHeroSlide ? " is-active" : ""}`}
                    style={{ backgroundImage: `url(${image})` }}
                  />
                ))}
              </div>
              <div className="td-hero-overlay" />
              <div className="td-hero-content container-fluid td-shell">
                <span className="td-kicker">🥾 Maharashtra Trek Experience</span>
                <h1 className="td-heading">{formattedName}</h1>
                <p className="td-subheading">{trek.location} · {trek.duration} · {trek.altitude}</p>

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
                  <Link to="/book" state={{ trek }} className="btn td-book-btn">
                    Book Now — ₹{trek.price}
                  </Link>
                  <button className="btn td-itinerary-btn" onClick={() => setActiveTab("gallery")}>
                    View Photos
                  </button>
                </div>

                {heroImages.length > 1 && (
                  <div className="td-hero-dots" aria-label="Trek hero image slides">
                    {heroImages.map((_, index) => (
                      <button
                        key={`${trek.name}-basic-dot-${index}`}
                        type="button"
                        className={`td-hero-dot${index === currentHeroSlide ? " is-active" : ""}`}
                        onClick={() => setCurrentHeroSlide(index)}
                        aria-label={`Show image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="container-fluid td-shell py-4">
              <div className="td-card">
                <h2 className="td-section-title">Photo Gallery</h2>
                <div className="td-gallery-grid">
                  {trek.gallery?.map((img, i) => (
                    <div
                      className="td-gallery-item"
                      key={i}
                      onClick={() => setLightboxImg(img)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && setLightboxImg(img)}
                    >
                      <img src={img} alt={`${trek.name} ${i + 1}`} className="td-gallery-img" />
                      <div className="td-gallery-zoom">🔍 View</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {lightboxImg && (
              <div className="td-lightbox" onClick={() => setLightboxImg(null)}>
                <div className="td-lightbox-inner" onClick={(e) => e.stopPropagation()}>
                  <img src={lightboxImg} alt="Full view" />
                  <button className="td-lightbox-close" onClick={() => setLightboxImg(null)}>✕</button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="trek-details-basic container py-5">
            <p className="text-center text-muted">Detailed itinerary coming soon for this trek.</p>
          </div>
        )}
      </div>
    );
  }

  /* ── Resolve active data set ── */
  const adminDiscountCodes = trek?.discountEnabled === false ? [] : parseDiscountItems(trek?.discountCodes);
  const adminItineraries = (adminTrek || previewTrek) ? parseDeparturePlanItineraries(trek?.departurePlans) : {};
  const overview = isKalsubai
    ? (adminTrek || previewTrek)
      ? {
          ...kalsubaiOverview,
          subtitle: trek?.subtitle || kalsubaiOverview.subtitle,
          intro: trek?.about || kalsubaiOverview.intro,
        }
      : kalsubaiOverview
    : (adminTrek || previewTrek)
      ? {
          ...harishchandragadOverview,
          subtitle: trek?.subtitle || harishchandragadOverview.subtitle,
          intro: trek?.about || harishchandragadOverview.intro,
          history: trek?.history || harishchandragadOverview.history,
          mainAttractions: trek?.mainAttractions || harishchandragadOverview.mainAttractions,
        }
      : harishchandragadOverview;
  const history = (adminTrek || previewTrek) && trek?.detailedHistory
    ? trek.detailedHistory
    : isKalsubai ? kalsubaiHistory : harishchandragadHistory;
  const highlights = (adminTrek || previewTrek) && trek?.highlights
    ? parseLineItems(trek.highlights).map((text) => ({ icon: "✨", text }))
    : isKalsubai ? kalsubaiHighlights : harishchandragadHighlights;
  const eventDetails = (adminTrek || previewTrek)
    ? {
        difficulty: trek?.difficulty || "",
        endurance: trek?.enduranceLevel || trek?.difficulty || "",
        baseVillage: trek?.baseVillage || "",
        region: trek?.regionArea || trek?.location || "",
        duration: trek?.duration || "",
        climbTime: trek?.climbTime || "",
        distance: trek?.distance || "",
        altitude: trek?.altitude || "",
        driveFromPune: trek?.drivePune || "",
        sanctuary: trek?.wildlifeSanctuary || "",
        minGroup: "",
      }
    : isKalsubai ? kalsubaiEventDetails : harishchandragadEventDetails;
  const pricing = (adminTrek || previewTrek)
    ? Object.fromEntries(
        Object.entries(parseJsonValue(trek?.departurePlans, {})).map(([city, plan]) => [
          city,
          { label: `${city} Departure`, price: Number(plan?.price) || trek?.price || 0 },
        ])
      )
    : isKalsubai ? kalsubaiPricing : harishchandragadPricing;
  const whyJoin = isKalsubai ? kalsubaiWhyJoin : harishchandragadWhyJoin;
  const itineraries = (adminTrek || previewTrek)
    ? adminItineraries
    : isKalsubai ? kalsubaiItineraries : harishchandragadItineraries;
  const bookingSteps = isKalsubai ? kalsubaiBookingSteps : harishchandragadBookingSteps;
  const itineraryKeys = (adminTrek || previewTrek)
    ? Object.keys(adminItineraries)
    : isKalsubai ? KALSUBAI_ITINERARY_KEYS : HC_ITINERARY_KEYS;
  const itinerary = itineraryKeys.length
    ? itineraries[activeItinerary] ?? itineraries[itineraryKeys[0]]
    : { note: "Itinerary will appear once route details are added.", days: [] };
  const includedItems = (adminTrek || previewTrek)
    ? parseLineItems(trek?.included).map((item) => `✅ ${item}`)
    : isKalsubai
      ? [
          "✅ Expert certified trek leader",
          "✅ Breakfast at summit",
          "✅ Veg lunch at base village",
          "✅ Local jeep from Kasara (train batch)",
          "✅ First aid kit",
          "✅ E-certificate on completion",
          "✅ WhatsApp group coordination",
        ]
      : harishchandragadInclusions;
  const excludedItems = (adminTrek || previewTrek)
    ? parseLineItems(trek?.notIncluded).map((item) => `❌ ${item}`)
    : isKalsubai
      ? [
          "❌ Train ticket (self-arranged)",
          "❌ Personal expenses",
        ]
      : harishchandragadExclusions;
  const carryItems = (adminTrek || previewTrek)
    ? parseLineItems(trek?.thingsToCarry)
    : harishchandragadThingsToCarry;

  const heroKicker = isKalsubai ? "🏔 Maharashtra's Highest Peak" : "🏔 Ancient Hill Fort — Konkan Kada";
  const heroTagline = overview.tagline;

  /* ── Rich Details Page ── */
  return (
    <div className="td-page">

      {/* ── HERO ── */}
      <div className="td-hero">
        <div className="td-hero-slides">
          {heroImages.map((image, index) => (
            <div
              key={`${trek.name}-hero-${index}`}
              className={`td-hero-slide${index === currentHeroSlide ? " is-active" : ""}`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
        </div>
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
            <Link to="/book" state={{ trek }} className="btn td-book-btn">
              Book Now — ₹{trek.price}
            </Link>
            <button className="btn td-itinerary-btn" onClick={() => setActiveTab("itinerary")}>
              View Itinerary
            </button>
          </div>

          {heroImages.length > 1 && (
            <div className="td-hero-dots" aria-label="Trek hero image slides">
              {heroImages.map((_, index) => (
                <button
                  key={`${trek.name}-dot-${index}`}
                  type="button"
                  className={`td-hero-dot${index === currentHeroSlide ? " is-active" : ""}`}
                  onClick={() => setCurrentHeroSlide(index)}
                  aria-label={`Show image ${index + 1}`}
                />
              ))}
            </div>
          )}
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
                {(trek?.discountEnabled !== false) && isHarishchandragad && (
                  <div className="td-card" style={{ marginTop: 16 }}>
                    <h3 className="td-section-title">Discount Offers</h3>
                    <div className="td-discount-codes">
                      {(adminDiscountCodes.length ? adminDiscountCodes : harishchandragadDiscountCodes).map((d) => (
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
              <Link to="/book" state={{ trek }} className="btn td-book-btn" style={{ marginTop: 20 }}>
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
                            "Difficulty Level": eventDetails.difficulty,
                            "Endurance Level": eventDetails.endurance,
                            "Base Village": eventDetails.baseVillage,
                            "Region": eventDetails.region,
                            "Duration": eventDetails.duration,
                            "Climb Time (one way)": eventDetails.climbTime,
                            "Distance (one way)": eventDetails.distance,
                            "Altitude": eventDetails.altitude,
                            "Minimum Group": eventDetails.minGroup,
                            "Wildlife Sanctuary": eventDetails.sanctuary,
                          }
                        : {
                            "Difficulty Level": eventDetails.difficulty,
                            "Endurance Level": eventDetails.endurance,
                            "Base Village": eventDetails.baseVillage,
                            "Region": eventDetails.region,
                            "Duration": eventDetails.duration,
                            "Climb Time (one way)": eventDetails.climbTime,
                            "Distance (one way)": eventDetails.distance,
                            "Altitude": eventDetails.altitude,
                            "Drive from Pune": eventDetails.driveFromPune,
                            "Wildlife Sanctuary": eventDetails.sanctuary,
                          }
                    ).filter(([, val]) => val).map(([key, val]) => (
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
                        <Link to="/book" state={{ trek }} className="btn td-pricing-book-btn">
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
                    {[...includedItems, ...excludedItems].map((item) => (
                      <li key={item} className="td-inclusion-item">{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Things to Carry (Harishchandragad only) */}
                {(isHarishchandragad || (adminTrek || previewTrek)) && carryItems.length > 0 && (
                  <div className="td-card" style={{ marginTop: 18 }}>
                    <h3 className="td-section-title">Things to Carry</h3>
                    <ul className="td-inclusions">
                      {carryItems.map((item) => (
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
        <Link to="/book" state={{ trek }} className="btn td-cta-book-btn">
          Book Now
        </Link>
      </div>
    </div>
  );
}

export default TrekDetails;
