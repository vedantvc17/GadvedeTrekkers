import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getAdminItems, normaliseItem } from "../../data/adminStorage";
import { createWhatsAppInquiryUrl } from "../../utils/leadActions";
import { toursList } from "../../data/toursData";
import { ADDITIONAL_TOUR_SEEDS } from "../../data/additionalTourDetails";
import {
  MANALI_TOUR_SEED,
  MANALI_GALLERY,
  TOUR_DETAIL_SEED_BY_SLUG,
  parseJsonValue,
  parseLineItems,
  parsePipeRows,
} from "../../data/manaliTourDetails";

const slugifyTourName = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const groupItineraryByDay = (value = "") =>
  parsePipeRows(value).reduce((acc, [day, time, description]) => {
    if (!day) return acc;
    const existing = acc.find((item) => item.day === day);
    const nextEvent = { time: time || "", description: description || "" };
    if (existing) existing.events.push(nextEvent);
    else acc.push({ day, events: [nextEvent] });
    return acc;
  }, []);

function parseRowObjects(value = "", keys = []) {
  return parsePipeRows(value).map((parts) =>
    Object.fromEntries(keys.map((key, index) => [key, parts[index] || ""]))
  );
}

function buildFallbackTour(id) {
  const baseTour = toursList.find(
    (item) => slugifyTourName(item.slug || item.name || "") === id
  );

  if (!baseTour) return null;

  return {
    ...baseTour,
    slug: slugifyTourName(baseTour.name),
    state: baseTour.state || baseTour.region || "India",
    destinationLine: baseTour.region || "India",
    heroBadge: "Instant Confirmation",
    subtitle: `${baseTour.name} is available as a separate tour package. Explore dates, pricing, and booking details below.`,
    taxPercent: 5,
    rating: "4.8",
    reviews: "1000+",
    happyCustomers: "1000+ Happy Customers",
    pickupPointLabel: "Pickup point",
    pickupPointMapLabel: baseTour.state || baseTour.region || "India",
    filters: `${baseTour.region || "tour"}|Group Tours`,
    overview: `${baseTour.name} is one of our featured group tours.\n\nYou can use this page to review the package price, next departure date, and proceed with booking.`,
    keyHighlights: `Tour|${baseTour.name}|Duration|${baseTour.duration}|Next Departure|${baseTour.nextDate}`,
    briefItinerary: `Trip|Package details available on request`,
    departureDatesDelhi: "",
    departureDatesHometown: `Upcoming|${baseTour.nextDate}`,
    pricingOptions: `Base Price|${baseTour.price}|Per person`,
    addOns: "",
    bookingNote: "",
    included: "Tour support",
    notIncluded: "Items not listed in the package",
    offerCodes: "",
    detailedItinerary: `Day 1|Plan|Package information for ${baseTour.name} will be updated soon.`,
    thingsToCarry: "Valid ID proof",
    travelInfo: `Destination|${baseTour.name}`,
    paymentDetails: "",
    cancellationPolicy: "Standard cancellation policy applies.",
    policyNotes: "Schedule may change in case of operational or weather conditions.",
    faq: "",
    imageGallery: [baseTour.image].filter(Boolean),
    active: true,
  };
}

function buildSeedTour(id) {
  return (
    TOUR_DETAIL_SEED_BY_SLUG[id] ||
    ADDITIONAL_TOUR_SEEDS[id] ||
    buildFallbackTour(id) ||
    null
  );
}

function TourDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const previewRaw = typeof window !== "undefined" ? sessionStorage.getItem("gt_tour_preview") : null;
  const previewItem = parseJsonValue(previewRaw, null);
  const previewSlug = previewItem?.slug || slugifyTourName(previewItem?.name || "");
  const adminItem = getAdminItems("gt_tours").find((item) => (item.slug || slugifyTourName(item.name || "")) === id);
  const seedTour = buildSeedTour(id);

  const tour = useMemo(() => {
    const source = previewSlug === id ? previewItem : adminItem ? normaliseItem(adminItem) : seedTour;
    if (!source) return null;
    const gallery = parseJsonValue(source.imageGallery, [source.image || MANALI_TOUR_SEED.image]).filter(Boolean);
    return {
      ...source,
      image: gallery[0] || source.image,
      imageGallery: gallery.length ? gallery : MANALI_GALLERY,
    };
  }, [adminItem, id, previewItem, previewSlug, seedTour]);

  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setActiveImage(0);
  }, [id]);

  useEffect(() => {
    if (!tour?.imageGallery?.length || tour.imageGallery.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActiveImage((prev) => (prev + 1) % tour.imageGallery.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [tour?.imageGallery]);

  if (!tour) {
    return (
      <div className="container py-5">
        <h2 className="fw-bold text-center mb-3 text-success">Tour Not Found</h2>
        <p className="text-center text-muted">This tour detail page is not available yet.</p>
      </div>
    );
  }

  const gallery = Array.isArray(tour.imageGallery)
    ? tour.imageGallery.filter(Boolean)
    : parseJsonValue(tour.imageGallery, []).filter(Boolean);
  const overviewBlocks = String(tour.overview || "").split("\n\n").filter(Boolean);
  const highlights = parseRowObjects(tour.keyHighlights, ["title", "desc"]);
  const briefItinerary = parseRowObjects(tour.briefItinerary, ["day", "summary"]);
  const delhiDates = parseRowObjects(tour.departureDatesDelhi, ["month", "dates"]);
  const hometownDates = parseRowObjects(tour.departureDatesHometown, ["month", "dates"]);
  const pricingOptions = parseRowObjects(tour.pricingOptions, ["label", "price", "desc"]);
  const addOns = parseRowObjects(tour.addOns, ["label", "price"]);
  const included = parseLineItems(tour.included);
  const excluded = parseLineItems(tour.notIncluded);
  const offers = parseRowObjects(tour.offerCodes, ["code", "desc"]);
  const itineraryDays = groupItineraryByDay(tour.detailedItinerary);
  const carryItems = parseLineItems(tour.thingsToCarry);
  const travelInfo = parseRowObjects(tour.travelInfo, ["title", "desc"]);
  const paymentDetails = parseRowObjects(tour.paymentDetails, ["label", "value"]);
  const cancellationPolicy = parseLineItems(tour.cancellationPolicy);
  const policyNotes = parseLineItems(tour.policyNotes);
  const faqs = parseRowObjects(tour.faq, ["question", "answer"]);
  const filters = String(tour.filters || "").split("|").map((item) => item.trim()).filter(Boolean);
  const gstAmount = Math.round((Number(tour.price || 0) * Number(tour.taxPercent || 0)) / 100);

  return (
    <div style={{ background: "#f4faf7", minHeight: "100vh" }}>
      <div style={{ position: "relative", minHeight: "84vh", overflow: "hidden" }}>
        {gallery.slice(0, 3).map((image, index) => (
          <div
            key={`${tour.name}-hero-${index}`}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: index === activeImage ? "scale(1.02)" : "scale(1.08)",
              opacity: index === activeImage ? 1 : 0,
              transition: "opacity 900ms ease, transform 3200ms ease",
            }}
          />
        ))}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg, rgba(3,18,14,0.86) 0%, rgba(7,34,24,0.72) 45%, rgba(10,22,17,0.6) 100%)" }} />

        <div className="container" style={{ position: "relative", zIndex: 2, paddingTop: 110, paddingBottom: 70 }}>
          <div style={{ maxWidth: 760 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.08)", color: "#fff", fontWeight: 700, letterSpacing: 0.5, marginBottom: 22 }}>
              <span>{tour.heroBadge || "🏔 Premium Group Tour"}</span>
            </div>
            <h1 style={{ color: "#fff", fontSize: "clamp(2.5rem, 8vw, 5rem)", lineHeight: 0.96, fontWeight: 900, marginBottom: 18, fontFamily: "Georgia, 'Times New Roman', serif" }}>
              {tour.name}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.15rem", maxWidth: 680, lineHeight: 1.7, marginBottom: 26 }}>
              {tour.subtitle}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 0, marginBottom: 26, borderTop: "1px solid rgba(255,255,255,0.18)", borderBottom: "1px solid rgba(255,255,255,0.18)" }}>
              {[
                ["📍", tour.state || tour.destinationLine],
                ["🕒", tour.duration],
                ["⭐", `${tour.rating || "4.8"} (${tour.reviews || "100+"} reviews)`],
                ["💰", `From ₹${tour.price}`],
              ].map(([icon, label]) => (
                <div key={label} style={{ padding: "14px 20px", color: "#fff", fontWeight: 600, fontSize: "1rem", borderRight: "1px solid rgba(255,255,255,0.12)" }}>
                  <span style={{ marginRight: 10 }}>{icon}</span>
                  {label}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 18 }}>
              <Link to="/book" state={{ trek: tour }} className="btn" style={{ background: "#13a567", color: "#fff", borderRadius: 12, padding: "14px 24px", fontWeight: 800 }}>
                Book Now - ₹{tour.price}
              </Link>
              <a
                href={createWhatsAppInquiryUrl({ packageName: tour.name, location: tour.destinationLine || tour.location || "Maharashtra", category: "Tour" })}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{ background: "#25d366", color: "#fff", borderRadius: 12, padding: "14px 24px", fontWeight: 800 }}
                title="Chat with us on WhatsApp"
              >
                💬 WhatsApp
              </a>
              <a href="#tour-itinerary" className="btn" style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "14px 24px", fontWeight: 700 }}>
                View Itinerary
              </a>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {(tour.instantConfirmation ? ["Instant Confirmation"] : [])
                .concat(tour.bestPriceGuaranteed ? ["Best Price Guaranteed"] : [])
                .concat(tour.happyCustomers ? [tour.happyCustomers] : [])
                .map((badge) => (
                  <span key={badge} style={{ background: "rgba(255,255,255,0.12)", color: "#fff", padding: "8px 14px", borderRadius: 999, fontSize: ".84rem", fontWeight: 700 }}>
                    {badge}
                  </span>
                ))}
            </div>
          </div>

          {gallery.length > 1 && (
            <div style={{ position: "absolute", left: "50%", bottom: 24, transform: "translateX(-50%)", display: "flex", gap: 10, zIndex: 3 }}>
              {gallery.slice(0, 3).map((_, index) => (
                <button
                  key={`${tour.name}-dot-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`Show image ${index + 1}`}
                  style={{
                    width: index === activeImage ? 42 : 12,
                    height: 12,
                    borderRadius: 999,
                    border: "none",
                    background: index === activeImage ? "#fff" : "rgba(255,255,255,0.45)",
                    transition: "all 250ms ease",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container py-5">
        <div className="tour-detail-layout">
          <div>
            <section style={sectionCardStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <button
                  onClick={() => navigate(-1)}
                  style={{ background: "none", border: "1px solid #d1fae5", borderRadius: 8, color: "#065f46", padding: "5px 12px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                >
                  ← Back
                </button>
                <p style={{ ...crumbStyle, margin: 0 }}>
                  <Link to="/" style={crumbLinkStyle}>Home</Link>
                  {"  >  "}
                  <Link to="/tours" style={crumbLinkStyle}>Upcoming trips</Link>
                  {"  >  "}
                  <span style={{ color: "#0f3b2b" }}>{tour.name}</span>
                </p>
              </div>
              <h2 style={sectionTitleStyle}>About {tour.name}</h2>
              {overviewBlocks.map((block) => (
                <p key={block.slice(0, 30)} style={bodyStyle}>{block}</p>
              ))}
            </section>

            <section style={sectionCardStyle}>
              <h2 style={sectionTitleStyle}>Key Highlights</h2>
              <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
                {highlights.map((item) => (
                  <div key={item.title} style={{ background: "#f1fbf6", border: "1px solid #d7f1e2", borderRadius: 16, padding: 18 }}>
                    <div style={{ color: "#0a6a47", fontWeight: 800, marginBottom: 8 }}>{item.title}</div>
                    <div style={{ color: "#365345", lineHeight: 1.7 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </section>

            <section style={sectionCardStyle}>
              <h2 style={sectionTitleStyle}>Brief Itinerary</h2>
              <div style={{ display: "grid", gap: 12 }}>
                {briefItinerary.map((item) => (
                  <div key={item.day} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 16, padding: "14px 0", borderBottom: "1px solid #eef4f0" }}>
                    <div style={{ fontWeight: 800, color: "#0a6a47" }}>{item.day}</div>
                    <div style={{ color: "#30463b", lineHeight: 1.65 }}>{item.summary}</div>
                  </div>
                ))}
              </div>
            </section>

            <section style={sectionCardStyle}>
              <h2 style={sectionTitleStyle}>Group Departure Dates</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
                <div>
                  <h3 style={subTitleStyle}>From Delhi</h3>
                  {delhiDates.map((item) => (
                    <div key={item.month} style={dateRowStyle}>
                      <strong>{item.month}</strong>
                      <span>{item.dates}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 style={subTitleStyle}>From Mumbai / Pune / Hometown</h3>
                  {hometownDates.map((item) => (
                    <div key={item.month} style={dateRowStyle}>
                      <strong>{item.month}</strong>
                      <span>{item.dates}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section style={sectionCardStyle}>
              <h2 style={sectionTitleStyle}>Cost & Add-ons</h2>
              <div style={{ display: "grid", gap: 12, marginBottom: 18 }}>
                {pricingOptions.map((item) => (
                  <div key={item.label} style={priceRowStyle}>
                    <div>
                      <div style={{ fontWeight: 800, color: "#153e2f" }}>{item.label}</div>
                      <div style={{ color: "#5f7168", fontSize: ".92rem" }}>{item.desc}</div>
                    </div>
                    <div style={{ fontWeight: 900, fontSize: "1.25rem", color: "#0a6a47" }}>₹{item.price}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
                {addOns.map((item) => (
                  <div key={item.label} style={{ background: "#f7fbf8", borderRadius: 14, padding: 16, border: "1px solid #e6efe9" }}>
                    <div style={{ fontWeight: 700, color: "#254b3a" }}>{item.label}</div>
                    <div style={{ marginTop: 8, color: "#0a6a47", fontWeight: 900 }}>₹{item.price}</div>
                  </div>
                ))}
              </div>
              {tour.bookingNote && <p style={{ ...bodyStyle, marginTop: 16, color: "#b45309", fontWeight: 700 }}>{tour.bookingNote}</p>}
            </section>

            <section id="tour-itinerary" style={sectionCardStyle}>
              <h2 style={sectionTitleStyle}>Detailed Itinerary</h2>
              <div style={{ display: "grid", gap: 20 }}>
                {itineraryDays.map((item) => (
                  <div key={item.day}>
                    <div style={{ background: "linear-gradient(90deg,#d5f6e4,#e9fff3)", borderLeft: "5px solid #0a8456", color: "#083929", fontWeight: 900, borderRadius: 14, padding: "14px 18px", marginBottom: 10 }}>
                      {item.day}
                    </div>
                    <div style={{ display: "grid", gap: 8 }}>
                      {item.events.map((event, index) => (
                        <div key={`${item.day}-${index}`} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 16, padding: "8px 10px", alignItems: "start" }}>
                          <div style={{ color: "#0a6a47", fontWeight: 800 }}>{event.time || "Plan"}</div>
                          <div style={{ color: "#30463b", lineHeight: 1.7 }}>{event.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section style={sectionCardStyle}>
              <h2 style={sectionTitleStyle}>Inclusions & Exclusions</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
                <div>
                  <h3 style={subTitleStyle}>What is included in the tour</h3>
                  <ul style={listStyle}>
                    {included.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 style={subTitleStyle}>What is NOT included in the tour</h3>
                  <ul style={listStyle}>
                    {excluded.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </div>
            </section>

            {offers.length > 0 && tour.discountEnabled !== false && (
              <section style={{ ...sectionCardStyle, background: "linear-gradient(135deg,#0c5e40,#0f6b49)", color: "#fff" }}>
                <h2 style={{ ...sectionTitleStyle, color: "#fff" }}>Offers</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
                  {offers.map((offer) => (
                    <div key={offer.code} style={{ background: "rgba(255,255,255,0.09)", borderRadius: 16, padding: 18 }}>
                      <div style={{ fontWeight: 900, letterSpacing: 1.2, fontSize: "1.1rem", marginBottom: 6 }}>{offer.code}</div>
                      <div style={{ color: "rgba(255,255,255,0.88)" }}>{offer.desc}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section style={sectionCardStyle}>
              <h2 style={sectionTitleStyle}>Things To Carry</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 10 }}>
                {carryItems.map((item) => (
                  <div key={item} style={{ background: "#f6fbf8", border: "1px solid #e3efe8", borderRadius: 14, padding: "12px 14px", color: "#244737", fontWeight: 600 }}>
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section style={sectionCardStyle}>
              <h2 style={sectionTitleStyle}>Travel Information</h2>
              <div style={{ display: "grid", gap: 12 }}>
                {travelInfo.map((item) => (
                  <div key={item.title} style={{ borderBottom: "1px solid #edf4ef", paddingBottom: 12 }}>
                    <div style={{ fontWeight: 800, color: "#0f3b2b", marginBottom: 6 }}>{item.title}</div>
                    <div style={{ color: "#3a5246", lineHeight: 1.7 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </section>

            <section style={sectionCardStyle}>
              <h2 style={sectionTitleStyle}>Payment Details</h2>
              <div style={{ display: "grid", gap: 10 }}>
                {paymentDetails.map((item) => (
                  <div key={item.label} style={paymentRowStyle}>
                    <span style={{ fontWeight: 700, color: "#264a3a" }}>{item.label}</span>
                    <span style={{ color: "#103528", fontWeight: 800 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </section>

            <section style={sectionCardStyle}>
              <h2 style={sectionTitleStyle}>Cancellation and Refund Policy</h2>
              <ul style={listStyle}>
                {cancellationPolicy.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>

            <section style={sectionCardStyle}>
              <h2 style={sectionTitleStyle}>Tour Policy</h2>
              <ul style={listStyle}>
                {policyNotes.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>

            {faqs.length > 0 && (
              <section style={sectionCardStyle}>
                <h2 style={sectionTitleStyle}>FAQ</h2>
                <div style={{ display: "grid", gap: 14 }}>
                  {faqs.map((item) => (
                    <div key={item.question} style={{ borderBottom: "1px solid #edf4ef", paddingBottom: 14 }}>
                      <div style={{ fontWeight: 800, color: "#103528", marginBottom: 6 }}>{item.question}</div>
                      <div style={{ color: "#385145", lineHeight: 1.8 }}>{item.answer}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="tour-detail-aside">
            <div style={{ ...sectionCardStyle, padding: 24 }}>
              <div style={{ textAlign: "center", marginBottom: 18 }}>
                <div style={{ color: "#70867a", fontSize: ".84rem" }}>Starting From</div>
                <div style={{ color: "#0a6a47", fontWeight: 900, fontSize: "2.2rem" }}>₹{tour.price}</div>
                <div style={{ color: "#738b7f", fontWeight: 600 }}>+ {tour.taxPercent}% GST</div>
              </div>
              <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
                <div style={miniBadgeStyle}>Instant Confirmation</div>
                <div style={miniBadgeStyle}>Best Price Guaranteed</div>
                <div style={miniBadgeStyle}>{tour.happyCustomers}</div>
              </div>
              <div style={{ background: "#f3fbf6", borderRadius: 14, padding: 16, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span>Base Fare</span>
                  <strong>₹{tour.price}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span>GST ({tour.taxPercent}%)</span>
                  <strong>₹{gstAmount}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid #d8ece0", fontWeight: 900, color: "#0a6a47" }}>
                  <span>Total</span>
                  <span>₹{Number(tour.price || 0) + gstAmount}</span>
                </div>
              </div>
              <Link to="/book" state={{ trek: tour }} className="btn w-100" style={{ background: "#0f9d63", color: "#fff", borderRadius: 12, padding: "13px 16px", fontWeight: 800, marginBottom: 8 }}>
                Book Now
              </Link>
              <a
                href={createWhatsAppInquiryUrl({ packageName: tour.name, location: tour.destinationLine || tour.location || "Maharashtra", category: "Tour" })}
                target="_blank"
                rel="noopener noreferrer"
                className="btn w-100"
                style={{ background: "#25d366", color: "#fff", borderRadius: 12, padding: "13px 16px", fontWeight: 800, marginBottom: 12 }}
              >
                💬 WhatsApp Enquiry
              </a>
              <div style={{ color: "#31483d", fontSize: ".95rem", lineHeight: 1.7 }}>
                <strong>{tour.pickupPointLabel}</strong> <span style={{ color: "#0a6a47", fontWeight: 700 }}>{tour.pickupPointMapLabel}</span>
              </div>
            </div>

            <div style={{ ...sectionCardStyle, padding: 24 }}>
              <h3 style={{ ...subTitleStyle, marginBottom: 12 }}>Photo Gallery</h3>
              <div style={{ display: "grid", gap: 10 }}>
                {gallery.slice(0, 3).map((image, index) => (
                  <div key={`${tour.name}-thumb-${index}`} style={{ borderRadius: 14, overflow: "hidden", cursor: "pointer", border: index === activeImage ? "2px solid #0a8456" : "2px solid transparent" }} onClick={() => setActiveImage(index)}>
                    <img src={image} alt={`${tour.name} ${index + 1}`} style={{ width: "100%", height: 92, objectFit: "cover", display: "block" }} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...sectionCardStyle, padding: 24 }}>
              <h3 style={{ ...subTitleStyle, marginBottom: 12 }}>Filter</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {filters.map((item) => (
                  <span key={item} style={{ background: "#eef8f3", borderRadius: 999, padding: "8px 12px", color: "#214838", fontWeight: 700, fontSize: ".84rem" }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

const sectionCardStyle = {
  background: "#fff",
  borderRadius: 24,
  padding: 28,
  boxShadow: "0 10px 30px rgba(13,54,37,0.08)",
  marginBottom: 24,
};

const sectionTitleStyle = {
  fontWeight: 900,
  fontSize: "1.7rem",
  color: "#0f3b2b",
  marginBottom: 18,
};

const subTitleStyle = {
  fontWeight: 800,
  fontSize: "1.1rem",
  color: "#0f3b2b",
};

const bodyStyle = {
  color: "#385145",
  lineHeight: 1.9,
  fontSize: "1rem",
};

const listStyle = {
  margin: 0,
  paddingLeft: 18,
  color: "#365345",
  lineHeight: 1.8,
};

const dateRowStyle = {
  display: "grid",
  gridTemplateColumns: "110px 1fr",
  gap: 12,
  padding: "10px 0",
  borderBottom: "1px solid #eef4f0",
  color: "#365345",
};

const priceRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
  background: "#f7fbf8",
  border: "1px solid #e6efe9",
  borderRadius: 16,
  padding: "16px 18px",
};

const paymentRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  padding: "12px 14px",
  borderRadius: 14,
  background: "#f7fbf8",
};

const miniBadgeStyle = {
  background: "#eef8f3",
  borderRadius: 12,
  padding: "10px 12px",
  color: "#214838",
  fontWeight: 700,
  textAlign: "center",
};

const crumbStyle = {
  marginBottom: 16,
  color: "#6d8478",
  fontSize: ".92rem",
};

const crumbLinkStyle = {
  color: "#0a6a47",
  textDecoration: "none",
  fontWeight: 700,
};

export default TourDetails;
