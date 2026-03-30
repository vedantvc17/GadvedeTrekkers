import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { findTrekBySlug, slugifyTrekName } from "../../data/treks";
import { getAdminItems, normaliseItem } from "../../data/adminStorage";
import { createWhatsAppInquiryUrl } from "../../utils/leadActions";
import { richTrekDetails } from "../../data/richTrekDetails";
import { getTrekDates } from "../../data/trekDatesStorage";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "gallery", label: "Photo Gallery" },
  { id: "itinerary", label: "Itinerary" },
  { id: "details", label: "Details & Cost" },
];

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
        const parts = line.split("|");
        if (parts.length >= 3) {
          return { time: parts[1].trim(), desc: parts.slice(2).join("|").trim() };
        }
        if (parts.length === 2) {
          return { time: parts[0].trim(), desc: parts[1].trim() };
        }
        return { time: "", desc: parts[0].trim() };
      });
      return [
        key,
        {
          label: `From ${city}`,
          sublabel: `${city} Route`,
          icon: city === "Kasara" ? "🚂" : "🚌",
          note: `${city} departure itinerary`,
          days: [{ title: `${city} Departure`, events }],
        },
      ];
    })
  );

const parsePlaces = (value = "") =>
  parseLineItems(value).map((item) => {
    const [name, desc] = item.split("|");
    return { icon: "📍", name: (name || item).trim(), desc: (desc || "").trim() };
  });

const createWhatsappHref = (trek) =>
  createWhatsAppInquiryUrl({
    packageName: trek.name,
    location: trek.location,
    category: "Trek",
  });

function TrekDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const previewDraft =
    typeof window !== "undefined" ? sessionStorage.getItem("gt_trek_preview") : null;
  const previewItem = parseJsonValue(previewDraft, null);
  const previewSlug = previewItem?.name ? slugifyTrekName(previewItem.name) : "";
  const adminMatch = getAdminItems("gt_treks").find((item) => slugifyTrekName(item.name || "") === id);

  const buildLocalTrek = (item) => {
    const fallbackGallery = [item.image, item.image, item.image].filter(Boolean);
    const gallery = parseJsonValue(item.imageGallery, fallbackGallery);
    return { ...normaliseItem(item), image: gallery[0] || item.image, gallery };
  };

  const adminTrek = adminMatch ? buildLocalTrek(adminMatch) : null;
  const previewTrek = previewItem && previewSlug === id ? buildLocalTrek(previewItem) : null;
  const trek = previewTrek || adminTrek || (id ? findTrekBySlug(id) : null);
  const staticRichTrek = trek?.name ? richTrekDetails[trek.name] || null : null;
  const isRich = !!(staticRichTrek || adminTrek || previewTrek);
  const adminItineraryKeys =
    adminTrek || previewTrek ? Object.keys(parseDeparturePlanItineraries(trek?.departurePlans)) : [];
  const staticItineraryKeys = Object.keys(staticRichTrek?.itineraries || {});
  const defaultItineraryKey = adminItineraryKeys[0] || staticItineraryKeys[0] || "kasara";

  const todayStr = new Date().toISOString().slice(0, 10);
  const upcomingDates = trek
    ? getTrekDates(slugifyTrekName(trek.name)).filter((d) => d.date >= todayStr)
    : [];

  const [activeTab, setActiveTab] = useState("overview");
  const [activeItinerary, setActiveItinerary] = useState(defaultItineraryKey);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    if (!staticRichTrek?.meta) return;
    document.title = staticRichTrek.meta.title;
    const setMeta = (name, content) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.name = name;
        document.head.appendChild(el);
      }
      el.content = content;
    };
    setMeta("description", staticRichTrek.meta.description);
    setMeta("keywords", staticRichTrek.meta.keywords);
  }, [staticRichTrek]);

  useEffect(() => {
    setCurrentHeroSlide(0);
    setActiveItinerary(defaultItineraryKey);
  }, [trek?.name, defaultItineraryKey]);

  useEffect(() => {
    if (!trek?.gallery?.length || trek.gallery.length < 2) return undefined;
    const timer = window.setInterval(
      () => setCurrentHeroSlide((prev) => (prev + 1) % trek.gallery.length),
      3200
    );
    return () => window.clearInterval(timer);
  }, [trek?.gallery]);

  const formattedName =
    trek?.name ?? (id ? id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Trek Details");
  const heroImages = trek?.gallery?.length ? trek.gallery.slice(0, 3) : [];

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
                <button onClick={() => navigate(-1)} className="td-back-btn">← Back</button>
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
                  ].map((stat) => (
                    <div className="td-stat" key={stat.label}>
                      <span className="td-stat-icon">{stat.icon}</span>
                      <span>{stat.label}</span>
                    </div>
                  ))}
                </div>
                <div className="td-hero-actions">
                  <Link to="/book" state={{ trek }} className="btn td-book-btn">Book Now — ₹{trek.price}</Link>
                  <button className="btn td-itinerary-btn" onClick={() => setActiveTab("gallery")}>View Photos</button>
                  <a
                    href={createWhatsappHref(trek)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn td-itinerary-btn"
                    style={{ background: "#25d366", color: "#fff", borderColor: "#25d366" }}
                    title="Chat with us on WhatsApp"
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </div>
            </div>
            {upcomingDates.length > 0 && (
              <div className="container-fluid td-shell py-4">
                <div className="td-card td-dates-card">
                  <h3 className="td-section-title">📅 Upcoming Departures</h3>
                  <div className="td-dates-list">
                    {upcomingDates.map((d) => {
                      const displayDate = new Date(`${d.date}T00:00:00`).toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      });
                      return (
                        <div key={d.id} className="td-date-row">
                          <div className="td-date-info">
                            <span className="td-date-text">{displayDate}</span>
                            {d.label && <span className="td-date-badge">{d.label}</span>}
                          </div>
                          <Link to="/book" state={{ trek }} className="td-date-book-btn">Book</Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="container-fluid td-shell py-4">
              <div className="td-card">
                <h2 className="td-section-title">Photo Gallery</h2>
                <div className="td-gallery-grid">
                  {trek.gallery?.map((img, index) => (
                    <div
                      className="td-gallery-item"
                      key={index}
                      onClick={() => setLightboxImg(img)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && setLightboxImg(img)}
                    >
                      <img src={img} alt={`${trek.name} ${index + 1}`} className="td-gallery-img" />
                      <div className="td-gallery-zoom">🔍 View</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="trek-details-basic container py-5">
            <p className="text-center text-muted">Detailed itinerary coming soon for this trek.</p>
          </div>
        )}
      </div>
    );
  }

  const adminItineraries =
    adminTrek || previewTrek ? parseDeparturePlanItineraries(trek?.departurePlans) : {};
  const overview =
    adminTrek || previewTrek
      ? {
          tagline: trek?.subtitle || "",
          subtitle: trek?.subtitle || "",
          intro: trek?.about || "",
          sections: [
            ...(trek?.history ? [{ title: "History & Significance", body: trek.history }] : []),
            ...(trek?.mainAttractions ? [{ title: "Main Attractions", body: trek.mainAttractions }] : []),
          ],
        }
      : staticRichTrek?.overview || { tagline: "", subtitle: "", intro: "", sections: [] };
  const history =
    (adminTrek || previewTrek) && trek?.detailedHistory
      ? trek.detailedHistory
      : staticRichTrek?.history || "";
  const highlights =
    (adminTrek || previewTrek) && trek?.highlights
      ? parseLineItems(trek.highlights).map((text) => ({ icon: "✨", text }))
      : staticRichTrek?.highlights || [];
  const eventDetails =
    adminTrek || previewTrek
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
          driveMumbai: trek?.driveMumbai || "",
          sanctuary: trek?.wildlifeSanctuary || "",
          minGroup: trek?.minGroup || "",
          bestTime: trek?.bestTime || "",
          trailType: trek?.trailType || "",
        }
      : staticRichTrek?.eventDetails || {};
  const pricing =
    adminTrek || previewTrek
      ? Object.fromEntries(
          Object.entries(parseJsonValue(trek?.departurePlans, {})).map(([city, plan]) => [
            city,
            { label: `${city} Departure`, price: Number(plan?.price) || trek?.price || 0 },
          ])
        )
      : staticRichTrek?.pricing || {};
  const whyJoin = staticRichTrek?.whyJoin || [];
  const itineraries = adminTrek || previewTrek ? adminItineraries : staticRichTrek?.itineraries || {};
  const itineraryKeys = adminTrek || previewTrek ? Object.keys(adminItineraries) : Object.keys(itineraries);
  const itinerary =
    itineraryKeys.length > 0
      ? itineraries[activeItinerary] ?? itineraries[itineraryKeys[0]]
      : { note: "Itinerary will appear once route details are added.", days: [] };
  const bookingSteps = staticRichTrek?.bookingSteps || [];
  const includedItems =
    adminTrek || previewTrek
      ? parseLineItems(trek?.included).map((item) => `✅ ${item}`)
      : (staticRichTrek?.inclusions || []).map((item) => `✅ ${item}`);
  const excludedItems =
    adminTrek || previewTrek
      ? parseLineItems(trek?.notIncluded).map((item) => `❌ ${item}`)
      : (staticRichTrek?.exclusions || []).map((item) => `❌ ${item}`);
  const carryItems =
    adminTrek || previewTrek ? parseLineItems(trek?.thingsToCarry) : staticRichTrek?.thingsToCarry || [];
  const placesToVisit =
    adminTrek || previewTrek ? parsePlaces(trek?.placesToVisit) : staticRichTrek?.placesToVisit || [];
  const discountCodes =
    adminTrek || previewTrek
      ? trek?.discountEnabled === false
        ? []
        : parseDiscountItems(trek?.discountCodes)
      : staticRichTrek?.discountCodes || [];
  const heroKicker = staticRichTrek?.heroKicker || "🏔 Maharashtra Trek Experience";
  const heroTagline = overview.tagline || overview.subtitle;

  return (
    <div className="td-page">
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
          <button
            onClick={() => navigate(-1)}
            className="td-back-btn"
          >
            ← Back
          </button>
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
            ].map((stat) => (
              <div className="td-stat" key={stat.label}>
                <span className="td-stat-icon">{stat.icon}</span>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="td-hero-actions">
            <Link to="/book" state={{ trek }} className="btn td-book-btn">Book Now — ₹{trek.price}</Link>
            <button className="btn td-itinerary-btn" onClick={() => setActiveTab("itinerary")}>View Itinerary</button>
            <a
              href={createWhatsappHref(trek)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn td-itinerary-btn"
              style={{ background: "#25d366", color: "#fff", borderColor: "#25d366" }}
              title="Chat with us on WhatsApp"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>

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

      <div className="container-fluid td-shell td-body">
        {activeTab === "overview" && (
          <div className="td-section">
            <div className="td-overview-grid">
              <div className="td-overview-main">
                <div className="td-card">
                  <h2 className="td-section-title">About {trek.name}</h2>
                  <p className="td-para">{overview.intro}</p>
                  {overview.sections?.map((section) => (
                    <div key={section.title}>
                      <h3 className="td-subsection-title">{section.title}</h3>
                      <p className="td-para">{section.body}</p>
                    </div>
                  ))}
                </div>

                {history && (
                  <div className="td-card">
                    <h2 className="td-section-title">{staticRichTrek?.historyTitle || "Detailed History"}</h2>
                    <p className="td-para">{history}</p>
                  </div>
                )}

                {placesToVisit.length > 0 && (
                  <div className="td-card">
                    <h2 className="td-section-title">Places to Visit</h2>
                    <div className="td-places-list">
                      {placesToVisit.map((place) => (
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
                {upcomingDates.length > 0 && (
                  <div className="td-card td-dates-card">
                    <h3 className="td-section-title">📅 Upcoming Departures</h3>
                    <div className="td-dates-list">
                      {upcomingDates.map((d) => {
                        const displayDate = new Date(`${d.date}T00:00:00`).toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        });
                        return (
                          <div key={d.id} className="td-date-row">
                            <div className="td-date-info">
                              <span className="td-date-text">{displayDate}</span>
                              {d.label && <span className="td-date-badge">{d.label}</span>}
                            </div>
                            <Link to="/book" state={{ trek }} className="td-date-book-btn">Book</Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="td-card td-highlights-card">
                  <h3 className="td-section-title">Trek Highlights</h3>
                  <ul className="td-highlights-list">
                    {highlights.map((highlight) => (
                      <li key={highlight.text} className="td-highlight-item">
                        <span className="td-highlight-icon">{highlight.icon}</span>
                        <span>{highlight.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {discountCodes.length > 0 && (
                  <div className="td-card" style={{ marginTop: 16 }}>
                    <h3 className="td-section-title">Discount Offers</h3>
                    <div className="td-discount-codes">
                      {discountCodes.map((discount) => (
                        <div className="td-discount-item" key={discount.code}>
                          <span className="td-discount-code">{discount.code}</span>
                          <span className="td-discount-desc">{discount.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {whyJoin.length > 0 && (
                  <div className="td-why-grid" style={{ marginTop: 16 }}>
                    {whyJoin.map((item) => (
                      <div className="td-why-card" key={item.title}>
                        <span className="td-why-icon">{item.icon}</span>
                        <strong>{item.title}</strong>
                        <p>{item.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "gallery" && (
          <div className="td-section">
            <h2 className="td-section-title">Photo Gallery</h2>
            <p className="td-muted">Hover to zoom · Click to view full screen</p>
            <div className="td-gallery-grid">
              {[...trek.gallery, ...trek.gallery].map((img, index) => (
                <div
                  className="td-gallery-item"
                  key={index}
                  onClick={() => setLightboxImg(img)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${trek.name} photo ${index + 1}`}
                  onKeyDown={(e) => e.key === "Enter" && setLightboxImg(img)}
                >
                  <img src={img} alt={`${trek.name} - Photo ${index + 1}`} className="td-gallery-img" loading="lazy" />
                  <div className="td-gallery-zoom">🔍 View</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "itinerary" && (
          <div className="td-section">
            <h2 className="td-section-title">Trek Itinerary</h2>
            <p className="td-muted">
              {itineraryKeys.length > 1
                ? "Choose your departure route to see the itinerary"
                : itinerary?.days?.[0]?.title
                  ? itinerary.days[0].title
                  : "Itinerary"}
            </p>

            {itineraryKeys.length > 1 && (
              <div className="td-itinerary-selector" role="radiogroup" aria-label="Select departure route">
                {itineraryKeys.map((key) => {
                  const route = itineraries[key];
                  return (
                    <label key={key} className={`td-itinerary-option${activeItinerary === key ? " active" : ""}`}>
                      <input
                        type="radio"
                        name="itineraryRoute"
                        value={key}
                        checked={activeItinerary === key}
                        onChange={() => setActiveItinerary(key)}
                      />
                      <span className="td-itinerary-icon">{route.icon}</span>
                      <div>
                        <span className="td-itinerary-label">{route.label}</span>
                        <span className="td-itinerary-sublabel">{route.sublabel}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            {itinerary.note && <div className="td-itinerary-note">⚠️ {itinerary.note}</div>}

            <div className="td-timeline">
              {(itinerary.days || []).map((day, dayIndex) => (
                <div className="td-timeline-day" key={dayIndex}>
                  <div className="td-timeline-day-title">{day.title}</div>
                  <div className="td-timeline-events">
                    {(day.events || []).map((event, eventIndex) => (
                      <div className="td-timeline-event" key={eventIndex}>
                        <div className="td-timeline-time">{event.time}</div>
                        <div className="td-timeline-dot" />
                        <div className="td-timeline-desc">{event.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {bookingSteps.length > 0 && (
              <div className="td-card td-booking-steps-card">
                <h3 className="td-section-title">How to Book?</h3>
                <ol className="td-booking-steps">
                  {bookingSteps.map((step, index) => (
                    <li key={index} className="td-booking-step">
                      <span className="td-booking-step-num">{index + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Link to="/book" state={{ trek }} className="btn td-book-btn">Book Now</Link>
                  <a
                    href={createWhatsappHref(trek)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn td-itinerary-btn"
                    style={{ background: "#25d366", color: "#fff", borderColor: "#25d366" }}
                  >
                    💬 WhatsApp Enquiry
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "details" && (
          <div className="td-section">
            <div className="td-details-grid">
              <div className="td-card">
                <h2 className="td-section-title">Trek Details</h2>
                <table className="td-details-table">
                  <tbody>
                    {Object.entries({
                      "Difficulty Level": eventDetails.difficulty,
                      "Endurance Level": eventDetails.endurance,
                      "Base Village": eventDetails.baseVillage,
                      Region: eventDetails.region,
                      Duration: eventDetails.duration,
                      "Climb Time": eventDetails.climbTime,
                      Distance: eventDetails.distance,
                      Altitude: eventDetails.altitude,
                      "Drive from Pune": eventDetails.driveFromPune,
                      "Drive from Mumbai": eventDetails.driveMumbai,
                      "Best Time": eventDetails.bestTime,
                      "Trail Type": eventDetails.trailType,
                      "Minimum Group": eventDetails.minGroup,
                      "Wildlife Sanctuary": eventDetails.sanctuary,
                    })
                      .filter(([, value]) => value)
                      .map(([key, value]) => (
                        <tr key={key}>
                          <td className="td-table-key">{key}</td>
                          <td className="td-table-val">{value}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div>
                <div className="td-card">
                  <h2 className="td-section-title">Pricing</h2>
                  <div className="td-pricing-cards">
                    {Object.values(pricing).map((price) => (
                      <div className="td-pricing-card" key={price.label}>
                        <div className="td-pricing-label">{price.label}</div>
                        <div className="td-pricing-price">₹{price.price}<span>/person</span></div>
                        <Link to="/book" state={{ trek }} className="btn td-pricing-book-btn">Book This</Link>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="td-card" style={{ marginTop: 18 }}>
                  <h3 className="td-section-title">What's Included / Not Included</h3>
                  <ul className="td-inclusions">
                    {[...includedItems, ...excludedItems].map((item) => (
                      <li key={item} className="td-inclusion-item">{item}</li>
                    ))}
                  </ul>
                </div>

                {carryItems.length > 0 && (
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

      {lightboxImg && (
        <div className="td-lightbox" onClick={() => setLightboxImg(null)}>
          <div className="td-lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxImg} alt="Full view" />
            <button className="td-lightbox-close" onClick={() => setLightboxImg(null)}>✕</button>
          </div>
        </div>
      )}

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
        <Link to="/book" state={{ trek }} className="btn td-cta-book-btn">Book Now</Link>
        <a
          href={createWhatsappHref(trek)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn td-cta-book-btn"
          style={{ background: "#25d366", borderColor: "#25d366" }}
          title="Ask on WhatsApp"
        >
          💬 WhatsApp
        </a>
      </div>
    </div>
  );
}

export default TrekDetails;
