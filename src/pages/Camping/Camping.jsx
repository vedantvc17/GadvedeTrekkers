import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getAdminItems, normaliseItem } from "../../data/adminStorage";
import { createWhatsAppInquiryUrl } from "../../utils/leadActions";

/* ─── Trip data ─── */
const campingSites = [
  {
    id: "alibaug-camping",
    name: "Alibaug Camping | Music | Barbecue | Bonfire",
    shortName: "Alibaug Camping",
    location: "Alibaug, Maharashtra",
    type: "Beach",
    duration: "Overnight",
    price: 400,
    originalPrice: 699,
    nextDates: ["03 Apr", "04 Apr", "05 Apr"],
    availability: "Available",
    coupon: "3 offers",
    description: "Beachside camping with live music, barbecue, and bonfire. Perfect budget weekend escape near Mumbai.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    badge: "Best Budget",
  },
  {
    id: "pawna-lake-camping",
    name: "Pawna Lake Camping 2026",
    shortName: "Pawna Lake Camping",
    location: "Pawna Lake — Keware Village",
    type: "Lake",
    duration: "Overnight",
    price: 1099,
    originalPrice: 1499,
    nextDates: ["03 Apr", "04 Apr", "05 Apr"],
    availability: "Available",
    coupon: "3 offers",
    description: "Serene lakeside camping with stunning Pawna Lake views, bonfire nights, and star gazing.",
    image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&w=800&q=80",
    badge: "Most Popular",
  },
  {
    id: "igatpuri-camping",
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
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
    badge: null,
  },
  {
    id: "bhandardara-camping",
    name: "Bhandardara Lake Camping",
    shortName: "Bhandardara Lake Camping",
    location: "Bhandardara, Maharashtra",
    type: "Lake",
    duration: "Overnight",
    price: 999,
    originalPrice: 1399,
    nextDates: ["28 Mar", "29 Mar", "30 Mar"],
    availability: "Available",
    coupon: "EARLY75",
    description: "Lakeside camping by Arthur Lake with breathtaking views of Bhandardara Dam and Sahyadri peaks.",
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80",
    badge: null,
  },
  {
    id: "stargazing-camping",
    name: "Stargazing Camping Dehene Asangaon",
    shortName: "Stargazing Camping Dehene",
    location: "Dehene, Maharashtra",
    type: "Forest",
    duration: "Overnight",
    price: 1699,
    originalPrice: 2199,
    nextDates: ["Available on Request"],
    availability: "On Request",
    coupon: "EARLY75",
    description: "Premium stargazing camping experience away from city lights — telescope sessions, dark sky photography.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    badge: "Premium",
  },
  {
    id: "panshet-camping",
    name: "Panshet Dam Camping | Camping near Pune | Rs 1099 per person",
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
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80",
    badge: null,
  },
  {
    id: "kalsubai-camping",
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
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
    badge: "Weekend Trek+Camp",
  },
  {
    id: "revdanda-camping",
    name: "Revdanda Beach Camping",
    shortName: "Revdanda Beach Camping",
    location: "Revdanda Beach, Maharashtra",
    type: "Beach",
    duration: "Overnight",
    price: 300,
    originalPrice: 599,
    nextDates: ["28 Mar", "29 Mar", "30 Mar"],
    availability: "Available",
    coupon: "EARLY75",
    description: "Affordable beachside camping at the scenic Revdanda Beach — bonfire, sea breeze, budget getaway.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    badge: "Best Value",
  },
  {
    id: "rajmachi-camping",
    name: "Rajmachi Camping | Treks and Trails India",
    shortName: "Rajmachi Camping",
    location: "Udhewadi, Maharashtra",
    type: "Mountain",
    duration: "1 Night 2 Days",
    price: 1599,
    originalPrice: 1999,
    nextDates: ["04 Apr", "11 Apr", "18 Apr"],
    availability: "Available",
    coupon: "2 offers",
    description: "Iconic Rajmachi fort camping with twin-fort views, forest trails, and unforgettable night sky.",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
    badge: "Fort Camping",
  },
];

const TYPE_FILTERS = ["All", "Lake", "Beach", "Mountain", "Forest"];

const discountCodes = [
  { code: "NYEGD6",  desc: "Group Discount ₹75 per head" },
  { code: "NYEGD12", desc: "Group Discount ₹100 per head" },
  { code: "EARLY75", desc: "Early Booking Discount" },
];

const locationSpotlights = [
  {
    title: "Igatpuri Secret Camping & Watersports",
    icon: "🌊",
    body: "An eco-friendly campground offering all the amenities of home — from tents to kayaks. Located in a tranquil forest setting, surrounded by verdant greenery and beautiful lakeside views. Activities include swimming, hiking through scenic surroundings, and group team-building. Group discounts available for larger groups.",
  },
  {
    title: "Pawna Lake Camping — Keware Village",
    icon: "🌅",
    body: "The perfect getaway if you want to escape it all. Enjoy camping tents, campfire stories, group discounts, pleasant weather, late-night hikes, and beautiful forest. Stargazing, sunrise, sunset — all from your lake-facing tent. Book your stay today by chatting with us!",
  },
  {
    title: "Moonstone Hammock Camping — Karjat",
    icon: "🌙",
    body: "The perfect camping experience for people who want to escape Mumbai city life but still have access to modern amenities like electricity and wifi. River kayaking, movie screening, swimming pool, live music, library, outdoor games, lounge area, café and more. Group discounts available.",
  },
  {
    title: "Matheran Camping",
    icon: "🏕️",
    body: "Forest-facing tents with all camping amenities — no need to bring your own gear. Spend time star gazing or night hiking in the beautiful forest. Enjoy campfires, sunrise and sunset hikes, and local food cooked over an open flame. Night camping is incomplete without lip-smacking BBQ!",
  },
  {
    title: "Stargazing Camping — Dehene Asangaon",
    icon: "🔭",
    body: "See galaxies, moons, planets, and constellations you've never seen before. Away from city lights with our telescopes and trained guides. Sunrise and sunset are must-sees. A leisurely drive from Mumbai — book your stargazing Mumbai camping stay today!",
  },
  {
    title: "Lonavala Camping",
    icon: "🌄",
    body: "Hilltop camping with lake views, campfires, music, and barbecue. Local food and easy campsite access — no stress about equipment or permits. Whether you want to relax by the forest or go on a night hike, there's something for everyone. Group packages available.",
  },
  {
    title: "Lonavala Private Camping",
    icon: "🏔️",
    body: "Located in the foothills of the Sahyadri mountain range, offering an escape from city life with privacy for your family and friends. Enjoy stargazing, sunrise, sunset, forest tents, and local food. Group discounts available — bring all your friends along!",
  },
  {
    title: "Pawna Island Camping — Best Lakeside",
    icon: "🏝️",
    body: "Located on Pawna Lake with some of the most beautiful views in Lonavala. Camping tents with beds inside. Barbecue equipment available. Live music, campfire, boating, outdoor games, movies, and delicious local food — Masala curry or onion pakoda. Group discounts available!",
  },
  {
    title: "Bhandardara Lake Camping",
    icon: "🏞️",
    body: "A memorable camping adventure featuring lake-facing tents, campfire, easy site access, and clean western toilets. Activities include trekking, boating, stargazing, self-barbecue, and music. Beautiful scenery of the lake and Sahyadri forest. Group discounts — connect with us for details.",
  },
  {
    title: "Malshej Ghat Camping",
    icon: "🌧️",
    body: "Lake-view camping tents, campfires, barbecue, live music, and a safe campsite. Pleasant weather year-round. Stargazing, sunrise/sunset from your tent porch overlooking the lake. Located near Mumbai and Pune — easily accessible by car or bus. Group discounts for families and friends.",
  },
  {
    title: "Alibaug Beach Camping",
    icon: "🏖️",
    body: "The perfect retreat from the hustle and bustle of Mumbai. Sea-view tents, campfires, live music, BBQ, outdoor games, team building, movie nights, group discounts, night hikes, and telescopes for stargazing. Explore Alibaug Beach's natural beauty while enjoying every modern comfort.",
  },
  {
    title: "Palghar Beach Camping",
    icon: "🌊",
    body: "Located near Palghar Railway Station — easy to reach by car, train, or flight. Our team handles camping tents, furniture, food, and equipment so you can focus on having fun. Group discounts and special packages that include meals and amenities are available.",
  },
  {
    title: "Kalavantin Durg Trek & Prabalmachi Camping",
    icon: "🧗",
    body: "Classic adventure to experience the cosmos and get away from it all near Mumbai. Camping gear, cooked meals, and all amenities provided. Located on the Western Ghats with beautiful sunsets, sunrises, and starry nights. Trek leader and safety support included.",
  },
  {
    title: "Kalsubai Trek & Camping",
    icon: "⛰️",
    body: "Camp at Maharashtra's highest peak with breathtaking views of Bhandardara. Comfortable tents with mattresses, campfire stories every night, group discounts, and pleasant weather year-round. Trek leader, clean campsite, cooked meals, and easy campsite access — no need to worry about getting lost!",
  },
  {
    title: "Rajmachi Camping — Western Ghats",
    icon: "🏯",
    body: "An excellent spot in the Western Ghats offering an opportunity to explore the world's beauty and enjoy tranquillity. Camp tents with modern amenities and local cuisine. Activities include trekking, firefly watching, night hikes, and stargazing. Visit Shiv Sagar lake for peace and solitude.",
  },
];

const whyReasons = [
  {
    num: "1",
    title: "Camping Traditions",
    body: "Camping started in national parks more than 100 years ago, and countless children have gained their appreciation for nature through these experiences. It's a tradition passed down through generations — are you ready to carry it forward?",
  },
  {
    num: "2",
    title: "It Helps You Explore Nature",
    body: "It's an immersive experience whether you're at a campsite or in the wilderness. You feel the rain, wind, and breeze. Watch wildlife in their natural surroundings. At night, the sky opens up — constellations, shooting stars, planets. People camp for adventure in life, more than for any other reason.",
  },
  {
    num: "3",
    title: "It Improves Health",
    body: "Camping is good for both body and mind. Physical demands like backpacking build fitness naturally. Outdoor exercise is linked to reduced depression and better mental health. Sleeping under the stars resets your circadian rhythm, forming the basis for deep, restful sleep.",
  },
  {
    num: "4",
    title: "Camping Manifests Survival Skills",
    body: "During camping, you work as a team and solve real problems — collecting water, starting a fire, pitching tents. Skills acquired during camping build confidence, self-worth, and practical knowledge that lasts a lifetime. It takes just a little effort and direction to set up tents!",
  },
  {
    num: "5",
    title: "Make New Connections",
    body: "Electronic devices substitute for face-to-face conversations at home — not around a campfire. Shared camping experiences create life-long memories and deepen relationships. It's a chance to disconnect from noise and reconnect with the people who matter.",
  },
];

export default function Camping() {
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeSort, setActiveSort] = useState("popular");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    document.title = "Camping | Group Discount Available | Starting From Rs 1000 | Gadvede Trekkers";
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
    <div style={{ background: "#f9fafb", minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <div style={{ background: "linear-gradient(135deg, #064e3b 0%, #065f46 45%, #047857 100%)", padding: "56px 0 44px", color: "#fff" }}>
        <div className="container">

          {/* Breadcrumb */}
          <nav style={{ fontSize: "0.78rem", marginBottom: 20, opacity: 0.8, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <Link to="/" style={{ color: "#6ee7b7", textDecoration: "none", fontWeight: 600 }}>Home</Link>
            <span>›</span>
            <span style={{ color: "rgba(255,255,255,0.6)" }}>Collections</span>
            <span>›</span>
            <span style={{ color: "#fff" }}>Camping | Group Discount Available | Starting From Rs 1000</span>
          </nav>

          {/* Badge */}
          <div style={{ marginBottom: 16 }}>
            <span style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 999, padding: "5px 18px", fontSize: "0.78rem", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
              ⛺ Group Discount Available · Starting From Rs 1000
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, marginBottom: 14, lineHeight: 1.2 }}>
            Camping Near Mumbai &amp; Pune
          </h1>

          <p style={{ fontSize: "1rem", opacity: 0.88, maxWidth: 680, lineHeight: 1.75, marginBottom: 10 }}>
            Escape the hustle and bustle of everyday life and immerse yourself in the tranquility of nature. Picture this: a canvas of stars overhead, the crackle of a bonfire, and the soothing sounds of nature as your backdrop. Our camping packages, starting from just <strong style={{ color: "#6ee7b7" }}>Rs 1000</strong>, offer a budget-friendly gateway to a world of outdoor bliss.
          </p>
          <p style={{ fontSize: "0.93rem", opacity: 0.82, maxWidth: 660, lineHeight: 1.7, marginBottom: 28 }}>
            Gather your friends, because adventure is always better in good company! Avail our exclusive group discounts and create lasting memories with those who matter most. From roasting marshmallows under the open sky to sharing stories around the campfire — wake up to the symphony of birdsong and let the stress of urban life melt away.
          </p>

          {/* Discount Coupon Cards */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {discountCodes.map((d) => (
              <div
                key={d.code}
                style={{ background: "rgba(255,255,255,0.1)", border: "1.5px dashed rgba(255,255,255,0.4)", borderRadius: 12, padding: "10px 20px", display: "flex", alignItems: "center", gap: 12 }}
              >
                <div>
                  <div style={{ fontSize: "0.68rem", opacity: 0.75, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>Use coupon code</div>
                  <code style={{ background: "#d1fae5", color: "#065f46", padding: "3px 12px", borderRadius: 6, fontWeight: 800, fontSize: "0.95rem", letterSpacing: 1.5, display: "inline-block" }}>
                    {d.code}
                  </code>
                </div>
                <span style={{ fontSize: "0.82rem", opacity: 0.9, fontWeight: 600 }}>{d.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FILTER + SORT BAR ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 90, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, padding: "12px 16px" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {TYPE_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: "6px 18px", borderRadius: 999, cursor: "pointer", fontWeight: 600, fontSize: "0.82rem", transition: "all 0.2s",
                  border: activeFilter === f ? "none" : "1px solid #d1d5db",
                  background: activeFilter === f ? "#059669" : "#f9fafb",
                  color: activeFilter === f ? "#fff" : "#374151",
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "0.82rem", color: "#6b7280" }}>
              Showing {filtered.length} of {allCampingSites.length} trips
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: "0.82rem", color: "#6b7280" }}>Sort by</span>
              <select
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value)}
                style={{ border: "1px solid #d1d5db", borderRadius: 8, padding: "6px 12px", fontSize: "0.82rem", background: "#fff", cursor: "pointer" }}
              >
                <option value="popular">Recommended</option>
                <option value="price-asc">Lowest Price</option>
                <option value="price-desc">Highest Price</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── CAMPING CARDS GRID ── */}
      <div className="container py-5">
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#6b7280" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⛺</div>
            <p>No camping trips found for this filter.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {filtered.map((site) => (
              <div
                key={site.id || site.name}
                style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", border: "1px solid #e5e7eb", transition: "transform 0.3s ease, box-shadow 0.25s", cursor: "pointer" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.13)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.07)"; }}
              >
                {/* Image */}
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img src={site.image} alt={site.shortName} style={{ width: "100%", height: 210, objectFit: "cover", display: "block" }} />
                  <span style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,0.55)", color: "#fff", padding: "3px 10px", borderRadius: 999, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" }}>
                    {site.type}
                  </span>
                  {site.badge && (
                    <span style={{ position: "absolute", top: 12, right: 12, background: "#059669", color: "#fff", padding: "3px 10px", borderRadius: 999, fontSize: "0.72rem", fontWeight: 700 }}>
                      {site.badge}
                    </span>
                  )}
                  {site.originalPrice && (
                    <span style={{ position: "absolute", bottom: 12, left: 12, background: "#dc2626", color: "#fff", padding: "3px 10px", borderRadius: 999, fontSize: "0.72rem", fontWeight: 700 }}>
                      {Math.round((1 - site.price / site.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>

                {/* Body */}
                <div style={{ padding: "16px 18px 20px" }}>
                  <h5 style={{ fontWeight: 700, fontSize: "0.95rem", color: "#111827", marginBottom: 4, lineHeight: 1.35 }}>
                    {site.shortName || site.name}
                  </h5>
                  <p style={{ fontSize: "0.78rem", color: "#6b7280", marginBottom: 8 }}>📍 {site.location}</p>
                  <p style={{ fontSize: "0.83rem", color: "#374151", lineHeight: 1.55, marginBottom: 12 }}>{site.description}</p>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                    <span style={{ background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0", borderRadius: 6, padding: "2px 10px", fontSize: "0.73rem", fontWeight: 600 }}>
                      ⏱ {site.duration}
                    </span>
                    <span style={{ background: "#fefce8", color: "#854d0e", border: "1px solid #fde047", borderRadius: 6, padding: "2px 10px", fontSize: "0.73rem", fontWeight: 600 }}>
                      🎟 {site.coupon}
                    </span>
                    <span style={{
                      background: site.availability === "Available" ? "#dcfce7" : "#f3f4f6",
                      color: site.availability === "Available" ? "#166534" : "#6b7280",
                      border: `1px solid ${site.availability === "Available" ? "#86efac" : "#d1d5db"}`,
                      borderRadius: 6, padding: "2px 10px", fontSize: "0.73rem", fontWeight: 600,
                    }}>
                      {site.availability === "Available" ? "✅ Available" : "📅 On Request"}
                    </span>
                  </div>

                  {site.nextDates && site.nextDates[0] !== "Available on Request" && (
                    <p style={{ fontSize: "0.77rem", color: "#6b7280", marginBottom: 12 }}>
                      📅 {site.nextDates.slice(0, 3).join(", ")} and more
                    </p>
                  )}

                  <div style={{ marginTop: 8 }}>
                    <div style={{ marginBottom: 12 }}>
                      <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "#059669" }}>₹{site.price.toLocaleString("en-IN")}</span>
                      {site.originalPrice && (
                        <span style={{ fontSize: "0.78rem", color: "#9ca3af", textDecoration: "line-through", marginLeft: 6 }}>₹{site.originalPrice.toLocaleString("en-IN")}</span>
                      )}
                      <span style={{ fontSize: "0.72rem", color: "#6b7280", marginLeft: 4 }}>/person</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <Link
                        to={`/camping/${site.id}`}
                        style={{ background: "#059669", color: "#fff", padding: "8px 20px", borderRadius: 10, fontWeight: 700, fontSize: "0.83rem", textDecoration: "none", transition: "background 0.2s", flex: 1, textAlign: "center" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#047857")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#059669")}
                      >
                        Book Now
                      </Link>
                      <Link
                        to={`/camping/${site.id}`}
                        style={{ background: "#fff", color: "#059669", padding: "8px 20px", borderRadius: 10, fontWeight: 700, fontSize: "0.83rem", textDecoration: "none", border: "1px solid #059669", flex: 1, textAlign: "center" }}
                      >
                        View Details
                      </Link>
                      <a
                        href={createWhatsAppInquiryUrl({
                          packageName: site.shortName || site.name,
                          location: site.location,
                          category: "Camping",
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ background: "#ecfdf5", color: "#047857", padding: "8px 20px", borderRadius: 10, fontWeight: 700, fontSize: "0.83rem", textDecoration: "none", border: "1px solid #86efac", width: "100%", textAlign: "center" }}
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 40 }}>
          {["«", "1", "2", "3", "4", "5", "6", "»"].map((p, i) => (
            <button
              key={i}
              style={{
                width: 36, height: 36, borderRadius: 8, border: "1px solid #d1d5db", background: p === "1" ? "#059669" : "#fff",
                color: p === "1" ? "#fff" : "#374151", fontWeight: p === "1" ? 700 : 400, fontSize: "0.85rem", cursor: "pointer",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── WHY GO CAMPING ── */}
      <div style={{ background: "#f0fdf4", padding: "60px 0" }}>
        <div className="container">
          <h2 style={{ fontWeight: 800, color: "#064e3b", textAlign: "center", fontSize: "clamp(1.4rem,3vw,2rem)", marginBottom: 8 }}>
            Why You Should Go Camping?
          </h2>
          <p style={{ textAlign: "center", color: "#374151", maxWidth: 660, margin: "0 auto 40px", lineHeight: 1.75 }}>
            There is a reason to camp for everyone. Many people like to separate themselves from technology and reconnect with nature. Families camp away from stress to strengthen relationships. You learn necessary survival skills — putting up tents, starting a fire, cooking food with few ingredients.
          </p>

          {/* What is Camping */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "28px 32px", marginBottom: 16, border: "1px solid #d1fae5" }}>
            <h3 style={{ fontWeight: 700, color: "#065f46", fontSize: "1.1rem", marginBottom: 10 }}>⛺ What is Camping?</h3>
            <p style={{ color: "#374151", lineHeight: 1.8, margin: 0 }}>
              Camping is an outdoor activity that includes staying overnight in a shelter, in a camping tent, or a recreational vehicle, away from home. Camping in the outdoors has always captured the imagination of all generations. Participants abandon comfortable daily environments to enjoy the outdoors in more natural areas. A minimum of an overnight stay will be considered "camping", which distinguishes it from day trips, picnics, and other short-term recreational activities. One can enjoy all four seasons of camping.
            </p>
          </div>

          {/* What is Campsite */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "28px 32px", marginBottom: 40, border: "1px solid #d1fae5" }}>
            <h3 style={{ fontWeight: 700, color: "#065f46", fontSize: "1.1rem", marginBottom: 10 }}>📍 What is a Campsite?</h3>
            <p style={{ color: "#374151", lineHeight: 1.8, margin: 0 }}>
              A campsite describes several outdoor approaches. Survival campers leave with as little gear as possible, while leisure vehicles come to the camping site with all amenities. Camping paired with hiking, as in backpacking, often includes canoeing, fishing, and hunting. Running and camping requires fastpacking. So, we can say that camping is the perfect activity for families with children, hikers, trekkers, outdoor enthusiasts, and adventure seekers.
            </p>
          </div>

          {/* 5 Reasons */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
            {whyReasons.map((r) => (
              <div key={r.num} style={{ background: "#fff", borderRadius: 16, padding: "24px 28px", border: "1px solid #d1fae5" }}>
                <div style={{ width: 40, height: 40, background: "#059669", color: "#fff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.1rem", marginBottom: 14 }}>
                  {r.num}
                </div>
                <h4 style={{ fontWeight: 700, color: "#064e3b", fontSize: "1rem", marginBottom: 8 }}>{r.title}</h4>
                <p style={{ color: "#374151", lineHeight: 1.75, fontSize: "0.9rem", margin: 0 }}>{r.body}</p>
              </div>
            ))}
          </div>

          {/* Do's and Don'ts */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "28px 32px", marginTop: 40, border: "1px solid #d1fae5" }}>
            <h3 style={{ fontWeight: 700, color: "#065f46", fontSize: "1.1rem", marginBottom: 14 }}>✅ Do's and Don'ts of Camping</h3>
            <ul style={{ color: "#374151", lineHeight: 2, paddingLeft: 20, margin: 0 }}>
              <li>Don't forget the essential campsite items.</li>
              <li>Leave a copy of your route; verify the pet rule of the campsite.</li>
              <li>Arrive before evening.</li>
              <li>Follow fire safety procedures at all times.</li>
              <li>Do not leave food unattended.</li>
              <li>Make your contribution to minimizing your environmental footprint.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── LOCATION SPOTLIGHTS ── */}
      <div style={{ background: "#fff", padding: "60px 0" }}>
        <div className="container">
          <h2 style={{ fontWeight: 800, color: "#064e3b", textAlign: "center", fontSize: "clamp(1.4rem,3vw,2rem)", marginBottom: 8 }}>
            Camping Near Mumbai &amp; Pune — Location Guides
          </h2>
          <p style={{ textAlign: "center", color: "#6b7280", maxWidth: 560, margin: "0 auto 44px", lineHeight: 1.7 }}>
            If you are looking for camping tours in India then Gadvede Trekkers has the best camping packages — some of the most unique adventure trips available.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 24 }}>
            {locationSpotlights.map((s) => (
              <div key={s.title} style={{ background: "#f0fdf4", borderRadius: 16, padding: "24px 26px", border: "1px solid #bbf7d0" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icon}</div>
                <h3 style={{ fontWeight: 700, color: "#064e3b", fontSize: "1rem", marginBottom: 10 }}>{s.title}</h3>
                <p style={{ color: "#374151", lineHeight: 1.75, fontSize: "0.87rem", margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
