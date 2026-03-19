import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getAdminItems, normaliseItem } from "../../data/adminStorage";

const campingSites = [
  {
    name: "Alibaug Camping | Music | Barbecue | Bonfire",
    shortName: "Alibaug Camping",
    location: "Alibaug, Maharashtra",
    type: "Beach",
    duration: "Overnight",
    price: 400,
    originalPrice: 699,
    nextDates: ["21 Mar", "22 Mar", "23 Mar"],
    availability: "Available",
    coupon: "3 offers",
    description: "Beachside camping with live music, barbecue, and bonfire. Perfect budget weekend escape near Mumbai.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    badge: "Best Budget",
  },
  {
    name: "Pawna Lake Camping 2026",
    shortName: "Pawna Lake Camping",
    location: "Pawna Lake — Keware Village",
    type: "Lake",
    duration: "Overnight",
    price: 1099,
    originalPrice: 1499,
    nextDates: ["19 Mar", "20 Mar", "21 Mar"],
    availability: "Available",
    coupon: "3 offers",
    description: "Serene lakeside camping with stunning Pawna Lake views, bonfire nights, and star gazing.",
    image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7",
    badge: "Most Popular",
  },
  {
    name: "Igatpuri Secret Camping and Water Sports",
    shortName: "Igatpuri Secret Camping",
    location: "Igatpuri, Maharashtra",
    type: "Forest",
    duration: "1 Night 1 Day",
    price: 899,
    originalPrice: 1299,
    nextDates: ["Available on Request"],
    availability: "On Request",
    coupon: "EARLY75",
    description: "Secluded forest camping combined with thrilling water sports activities at scenic Igatpuri.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    badge: null,
  },
  {
    name: "Bhandardara Lake Camping",
    shortName: "Bhandardara Camping",
    location: "Bhandardara, Maharashtra",
    type: "Lake",
    duration: "Overnight",
    price: 999,
    originalPrice: 1399,
    nextDates: ["19 Mar", "20 Mar", "21 Mar"],
    availability: "Available",
    coupon: "EARLY75",
    description: "Lakeside camping by Arthur Lake with breathtaking views of Bhandardara Dam and Sahyadri peaks.",
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff",
    badge: null,
  },
  {
    name: "Stargazing Camping Dehene Asangaon",
    shortName: "Stargazing Camping",
    location: "Dehene, Maharashtra",
    type: "Forest",
    duration: "Overnight",
    price: 1699,
    originalPrice: 2199,
    nextDates: ["Available on Request"],
    availability: "On Request",
    coupon: "EARLY75",
    description: "Premium stargazing camping experience away from city lights — telescope sessions, dark sky photography.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    badge: "Premium",
  },
  {
    name: "Panshet Dam Camping | Camping near Pune",
    shortName: "Panshet Dam Camping",
    location: "Panshet, Maharashtra",
    type: "Lake",
    duration: "Overnight",
    price: 849,
    originalPrice: 1199,
    nextDates: ["11 Apr", "18 Apr", "25 Apr"],
    availability: "Available",
    coupon: "3 offers",
    description: "Relaxing lakefront camping near Pune — perfect for families, couples, and weekend escapes.",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
    badge: null,
  },
  {
    name: "Kalsubai Camping from Kasara",
    shortName: "Kalsubai Camping",
    location: "Bari, Maharashtra",
    type: "Mountain",
    duration: "1 Night 2 Days",
    price: 1299,
    originalPrice: 1799,
    nextDates: ["04 Apr", "11 Apr", "18 Apr"],
    availability: "Available",
    coupon: "EARLY75",
    description: "Camp at the base of Maharashtra's highest peak — experience sunrise over the Sahyadris.",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5",
    badge: "Weekend Trek+Camp",
  },
  {
    name: "Revdanda Beach Camping",
    shortName: "Revdanda Beach Camping",
    location: "Revdanda Beach, Maharashtra",
    type: "Beach",
    duration: "Overnight",
    price: 300,
    originalPrice: 599,
    nextDates: ["19 Mar", "20 Mar", "21 Mar"],
    availability: "Available",
    coupon: "EARLY75",
    description: "Affordable beachside camping at the scenic Revdanda Beach — bonfire, sea breeze, budget getaway.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    badge: "Best Value",
  },
  {
    name: "Rajmachi Camping | Treks and Trails India",
    shortName: "Rajmachi Camping",
    location: "Udhewadi, Maharashtra",
    type: "Mountain",
    duration: "1 Night 2 Days",
    price: 1599,
    originalPrice: 1999,
    nextDates: ["21 Mar", "28 Mar", "04 Apr"],
    availability: "Available",
    coupon: "2 offers",
    description: "Iconic Rajmachi fort camping with twin-fort views, forest trails, and unforgettable night sky.",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    badge: "Fort Camping",
  },
];

const TYPE_FILTERS = ["All", "Lake", "Beach", "Mountain", "Forest"];

const discountCodes = [
  { code: "NYEGD6", desc: "Group Discount — ₹75/head" },
  { code: "NYEGD12", desc: "Group Discount — ₹100/head" },
  { code: "EARLY75", desc: "Early Booking Discount" },
];

function Camping() {
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeSort, setActiveSort] = useState("popular");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    document.title = "Camping Near Mumbai & Pune 2025 | Lake, Beach & Forest Camps | Gadvede Trekkers";
    if (location.state) window.history.replaceState({}, document.title);
  }, [location.state]);

  const adminCamps = getAdminItems("gt_camping").filter((c) => c.active !== false).map(normaliseItem);
  const allCampingSites = [...campingSites, ...adminCamps];

  const filtered = allCampingSites
    .filter((s) => activeFilter === "All" || s.type === activeFilter)
    .sort((a, b) => {
      if (activeSort === "price-asc") return a.price - b.price;
      if (activeSort === "price-desc") return b.price - a.price;
      return 0;
    });

  return (
    <div>
      {/* ── HERO ── */}
      <div
        className="camping-hero"
        style={{
          background: "linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 100%)",
          padding: "64px 0 48px",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div className="container">
          <span
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 999,
              padding: "5px 16px",
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
              display: "inline-block",
              marginBottom: 16,
            }}
          >
            ⛺ Group Discount Available
          </span>
          <h1 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, marginBottom: 12 }}>
            Camping Near Mumbai &amp; Pune
          </h1>
          <p style={{ fontSize: "1.05rem", opacity: 0.85, maxWidth: 560, margin: "0 auto 28px" }}>
            Lake, beach, mountain &amp; forest camps. Starting from just{" "}
            <strong style={{ color: "#6ee7b7" }}>₹300/person</strong>. Group discounts available!
          </p>

          {/* Discount Codes Strip */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "center",
              marginTop: 8,
            }}
          >
            {discountCodes.map((d) => (
              <div
                key={d.code}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1.5px dashed rgba(255,255,255,0.4)",
                  borderRadius: 10,
                  padding: "8px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <code
                  style={{
                    background: "#d1fae5",
                    color: "#065f46",
                    padding: "2px 10px",
                    borderRadius: 6,
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    letterSpacing: 1,
                  }}
                >
                  {d.code}
                </code>
                <span style={{ fontSize: "0.82rem", opacity: 0.9 }}>{d.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FILTERS + SORT ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 90 }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, padding: "12px 16px" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {TYPE_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: "6px 16px",
                  borderRadius: 999,
                  border: activeFilter === f ? "none" : "1px solid #d1d5db",
                  background: activeFilter === f ? "#059669" : "#f9fafb",
                  color: activeFilter === f ? "#fff" : "#374151",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "0.82rem", color: "#6b7280" }}>{filtered.length} camps</span>
            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value)}
              style={{
                border: "1px solid #d1d5db",
                borderRadius: 8,
                padding: "6px 12px",
                fontSize: "0.82rem",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              <option value="popular">Sort: Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── CARDS GRID ── */}
      <div className="container py-5">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 24,
          }}
        >
          {filtered.map((site) => (
            <div
              key={site.name}
              style={{
                background: "#fff",
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
                border: "1px solid #e5e7eb",
                transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.14)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.08)";
              }}
            >
              {/* Image */}
              <div style={{ position: "relative", overflow: "hidden" }}>
                <img
                  src={site.image}
                  alt={site.shortName}
                  style={{ width: "100%", height: 210, objectFit: "cover", display: "block" }}
                />
                {/* Type badge */}
                <span
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    background: "rgba(0,0,0,0.55)",
                    color: "#fff",
                    padding: "3px 10px",
                    borderRadius: 999,
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {site.type}
                </span>
                {/* Special badge */}
                {site.badge && (
                  <span
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      background: "#059669",
                      color: "#fff",
                      padding: "3px 10px",
                      borderRadius: 999,
                      fontSize: "0.72rem",
                      fontWeight: 700,
                    }}
                  >
                    {site.badge}
                  </span>
                )}
                {/* Discount % badge */}
                <span
                  style={{
                    position: "absolute",
                    bottom: 12,
                    left: 12,
                    background: "#dc2626",
                    color: "#fff",
                    padding: "3px 10px",
                    borderRadius: 999,
                    fontSize: "0.72rem",
                    fontWeight: 700,
                  }}
                >
                  {Math.round((1 - site.price / site.originalPrice) * 100)}% OFF
                </span>
              </div>

              {/* Body */}
              <div style={{ padding: "16px 18px 18px" }}>
                <h5 style={{ fontWeight: 700, fontSize: "0.95rem", color: "#111827", marginBottom: 4, lineHeight: 1.3 }}>
                  {site.shortName}
                </h5>
                <p style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: 8 }}>
                  📍 {site.location}
                </p>
                <p style={{ fontSize: "0.83rem", color: "#374151", lineHeight: 1.5, marginBottom: 12 }}>
                  {site.description}
                </p>

                {/* Duration + Coupon */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                  <span style={{ background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0", borderRadius: 6, padding: "2px 10px", fontSize: "0.75rem", fontWeight: 600 }}>
                    ⏱ {site.duration}
                  </span>
                  <span style={{ background: "#fefce8", color: "#854d0e", border: "1px solid #fde047", borderRadius: 6, padding: "2px 10px", fontSize: "0.75rem", fontWeight: 600 }}>
                    🎟 {site.coupon}
                  </span>
                  <span
                    style={{
                      background: site.availability === "Available" ? "#dcfce7" : "#f3f4f6",
                      color: site.availability === "Available" ? "#166534" : "#6b7280",
                      border: `1px solid ${site.availability === "Available" ? "#86efac" : "#d1d5db"}`,
                      borderRadius: 6,
                      padding: "2px 10px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {site.availability === "Available" ? "✅ Available" : "📅 On Request"}
                  </span>
                </div>

                {/* Dates */}
                {site.nextDates[0] !== "Available on Request" && (
                  <p style={{ fontSize: "0.78rem", color: "#6b7280", marginBottom: 12 }}>
                    📅 {site.nextDates.join(" · ")} and more
                  </p>
                )}

                {/* Price + CTA */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                  <div>
                    <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#059669" }}>₹{site.price}</span>
                    <span style={{ fontSize: "0.78rem", color: "#9ca3af", textDecoration: "line-through", marginLeft: 6 }}>
                      ₹{site.originalPrice}
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "#6b7280", marginLeft: 4 }}>/person</span>
                  </div>
                  <Link
                    to="/book"
                    state={{ selectedCampsite: { name: site.shortName, location: site.location, price: site.price, originalPrice: site.originalPrice, duration: site.duration, image: site.image } }}
                    style={{
                      background: "#059669",
                      color: "#fff",
                      padding: "8px 20px",
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: "0.83rem",
                      textDecoration: "none",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#047857")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#059669")}
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SEO Text Block */}
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: 16,
            padding: "32px",
            marginTop: 56,
          }}
        >
          <h2 style={{ fontWeight: 700, color: "#065f46", marginBottom: 12 }}>
            Best Camping Sites Near Mumbai &amp; Pune 2025
          </h2>
          <p style={{ color: "#374151", lineHeight: 1.8, fontSize: "0.92rem", marginBottom: 16 }}>
            Escape the hustle of city life and immerse yourself in the tranquility of nature with our curated
            camping experiences. From lakeside camps at Pawna and Panshet to beachside stays at Alibag and
            Revdanda, we offer Maharashtra's most scenic and affordable camping packages. Whether you're
            planning a group outing, couple retreat, or solo adventure, our camps feature bonfires, barbecues,
            star gazing, and outdoor activities for all ages.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["Camping Near Mumbai", "Camping Near Pune", "Lakeside Camping", "Beach Camping", "Fort Camping", "Group Camping", "Bonfire Camping", "Stargazing Camp", "Overnight Camping Maharashtra"].map((tag) => (
              <span
                key={tag}
                style={{
                  background: "#d1fae5",
                  color: "#065f46",
                  padding: "4px 14px",
                  borderRadius: 999,
                  fontSize: "0.78rem",
                  fontWeight: 600,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Camping;
