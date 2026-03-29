import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { uniqueTreks, slugifyTrekName } from "../data/treks";
import { campingList } from "../data/campingData";
import { rentalsList } from "../data/rentalsData";
import { isHeritageEnabled } from "../data/featureFlags";
import { ivDestinations } from "../data/industrialVisitsData";
import EnquiryModal from "../components/EnquiryModal";
import { getAdminItems, normaliseItem } from "../data/adminStorage";

const CAMPING_ROUTE_BY_NAME = {
  "Alibaug Camping | Music | Barbecue | Bonfire": "alibaug-camping",
  "Pawna Lake Camping 2026": "pawna-lake-camping",
  "Igatpuri Secret Camping and Water Sports": "igatpuri-camping",
  "Bhandardara Lake Camping": "bhandardara-camping",
  "Stargazing Camping Dehene Asangaon": "stargazing-camping",
  "Panshet Dam Camping | Camping near Pune": "panshet-camping",
  "Kalsubai Camping from Kasara": "kalsubai-camping",
  "Revdanda Beach Camping": "revdanda-camping",
  "Rajmachi Camping | Treks and Trails India": "rajmachi-camping",
};

// ─── HomeTrekCard ─────────────────────────────────────────────────────────────
function HomeTrekCard({ trek }) {
  const [imgIdx, setImgIdx] = useState(0);
  const intervalRef = useRef(null);
  const images = trek.gallery.slice(0, 3);
  const discountPct = Math.round(
    ((trek.originalPrice - trek.price) / trek.originalPrice) * 100
  );
  const isPopular = trek.reviews >= 200;

  const handleMouseEnter = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setImgIdx((prev) => (prev + 1) % images.length);
    }, 800);
  };

  const handleMouseLeave = () => {
    clearInterval(intervalRef.current);
    setImgIdx(0);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <article
      className="trek-card ht-trek-card"
      data-difficulty={trek.difficulty}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ height: "100%" }}
    >
      <div className="trek-card-media">
        <span className="trek-season-tag">{trek.seasonalTag}</span>
        {discountPct > 0 && (
          <span className="trek-discount-badge">{discountPct}% OFF</span>
        )}
        {isPopular && (
          <span className="trek-popular-badge">🔥 Popular</span>
        )}
        <div className="trek-gallery">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${trek.name} - view ${i + 1}`}
              className="trek-gallery-image"
              style={{
                opacity: i === imgIdx ? 1 : 0,
                transform: i === imgIdx ? "scale(1.05)" : "scale(1.02)",
                transition: "opacity 0.5s ease, transform 0.6s ease",
              }}
              loading="lazy"
            />
          ))}
        </div>
        <div className="trek-gallery-dots" aria-hidden="true">
          {images.map((_, i) => (
            <span
              key={i}
              className="trek-gallery-dot"
              style={{
                background: i === imgIdx ? "#fff" : "rgba(255,255,255,0.5)",
                transform: i === imgIdx ? "scale(1.35)" : "scale(1)",
                transition: "transform 0.3s ease, background 0.3s ease",
              }}
            />
          ))}
        </div>
        <div className="trek-card-overlay">
          <Link
            to="/book"
            state={{ trek }}
            className="trek-overlay-btn trek-overlay-book"
            tabIndex="-1"
            aria-hidden="true"
          >
            Book Now
          </Link>
          <Link
            to={`/treks/${slugifyTrekName(trek.name)}`}
            className="trek-overlay-btn trek-overlay-details"
            tabIndex="-1"
            aria-hidden="true"
          >
            Details
          </Link>
        </div>
      </div>

      <div className="trek-card-body">
        <div className="trek-card-topline">
          <div>
            <h2 className="trek-card-title">{trek.name}</h2>
            <p className="trek-location">📍 {trek.location}</p>
          </div>
          <div className="trek-rating">
            <span className="trek-rating-star" aria-hidden="true">★</span>
            <span>{trek.rating.toFixed(1)}</span>
            <span className="trek-rating-count">({trek.reviews})</span>
          </div>
        </div>

        <div className="trek-chip-row">
          <span
            className={`trek-chip ${
              trek.difficulty === "Easy"
                ? "chip-easy"
                : trek.difficulty === "Medium"
                ? "chip-medium"
                : "chip-hard"
            }`}
          >
            {trek.difficulty}
          </span>
          <span className="trek-chip chip-neutral">⏱ {trek.duration}</span>
          <span className="trek-chip chip-neutral">🏔 {trek.altitude}</span>
        </div>

        <div className="trek-pricing">
          <span className="trek-original-price">₹{trek.originalPrice}</span>
          <span className="trek-current-price">₹{trek.price}</span>
          <span className="trek-starting-text">per person</span>
        </div>

        <div className="trek-next-date">
          <span className="trek-next-label">📅 Next</span>
          <span>{trek.nextDate}</span>
        </div>

        <div className="trek-card-actions">
          <Link to="/book" state={{ trek }} className="btn trek-primary-btn">
            Book Now
          </Link>
          <Link
            to={`/treks/${slugifyTrekName(trek.name)}`}
            className="btn trek-secondary-btn"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

// ─── TourTile (unchanged) ────────────────────────────────────────────────────
function TourTile({ title, images, region, path = "/tours", btnLabel = "VIEW TOURS" }) {
  const [current, setCurrent] = useState(0);
  const [prevIdx, setPrevIdx] = useState(null);
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      advanceTo((c) => (c + 1) % images.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [images.length]);

  function advanceTo(nextFn) {
    const next = nextFn(current);
    if (animating || next === current) return;
    setPrevIdx(current);
    setCurrent(next);
    setAnimating(true);
    setTimeout(() => { setPrevIdx(null); setAnimating(false); }, 900);
  }

  const go = () => navigate(path, region ? { state: { region } } : undefined);

  return (
    <div className="col-6 col-md-3">
      <div className="weekend-tile" onClick={go}>
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={title}
            className={`weekend-tile-img ${i === current ? "wt-active" : ""} ${i === prevIdx ? "wt-prev" : ""}`}
          />
        ))}
        <div className="weekend-tile-overlay" />
        <div className="weekend-tile-content">
          <h4 className="weekend-tile-title">{title}</h4>
          <div className="weekend-tile-dots">
            {images.map((_, i) => (
              <span
                key={i}
                className={`weekend-dot ${i === current ? "active" : ""}`}
                onClick={(e) => { e.stopPropagation(); advanceTo(() => i); }}
              />
            ))}
          </div>
          <button
            className="weekend-tile-btn"
            onClick={(e) => { e.stopPropagation(); go(); }}
          >
            {btnLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── IVDestCard ───────────────────────────────────────────────────────────────
function IVDestCard({ dest, idx, onEnquire }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: hovered ? "0 20px 48px rgba(29,78,216,0.16)" : "0 2px 14px rgba(0,0,0,0.07)",
        border: `1.5px solid ${hovered ? "#93c5fd" : "#e5e7eb"}`,
        transform: hovered ? "translateY(-8px) scale(1.01)" : "translateY(0) scale(1)",
        transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        animationDelay: `${idx * 0.08}s`,
        animationFillMode: "both",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 2×2 image grid with zoom on hover */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, height: 180, overflow: "hidden", position: "relative" }}>
        {dest.images.slice(0, 4).map((img, i) => (
          <div key={i} style={{ overflow: "hidden", position: "relative" }}>
            <img
              src={img.src}
              alt={img.caption}
              style={{
                width: "100%", height: "100%", objectFit: "cover", display: "block",
                transform: hovered ? "scale(1.08)" : "scale(1)",
                transition: "transform 0.5s ease",
              }}
            />
          </div>
        ))}
        {/* duration badge overlay */}
        <div style={{
          position: "absolute", top: 10, left: 10, zIndex: 2,
          background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
          color: "#fff", borderRadius: 8, padding: "3px 10px",
          fontSize: "0.7rem", fontWeight: 700, letterSpacing: 0.5,
        }}>
          ⏱ {dest.duration}
        </div>
      </div>

      <div style={{ padding: "14px 16px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: "0.7rem", color: "#6b7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.8 }}>
          {dest.subtitle}
        </div>
        <h6 style={{ fontWeight: 800, fontSize: "0.95rem", color: "#111827", marginBottom: 8, lineHeight: 1.35 }}>
          {dest.icon} {dest.title}
        </h6>

        {/* Best For badge */}
        <div style={{ marginBottom: 10 }}>
          <span style={{ background: "#f0fdf4", color: "#065f46", border: "1px solid #bbf7d0", borderRadius: 20, padding: "3px 10px", fontSize: "0.7rem", fontWeight: 600 }}>
            🎓 {dest.bestFor.split("&")[0].trim()}
          </span>
        </div>

        {/* Highlights */}
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 14px", flex: 1 }}>
          {dest.highlights.slice(0, 3).map((h) => (
            <li key={h} style={{ fontSize: "0.78rem", color: "#374151", marginBottom: 5, display: "flex", gap: 7, alignItems: "flex-start" }}>
              <span style={{ color: "#059669", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✔</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={onEnquire}
          style={{
            display: "block", width: "100%",
            background: hovered ? "linear-gradient(135deg,#1e40af,#2563eb)" : "linear-gradient(135deg,#1d4ed8,#3b82f6)",
            color: "#fff", border: "none", textAlign: "center",
            padding: "10px", borderRadius: 10, fontSize: "0.82rem", fontWeight: 700,
            cursor: "pointer", letterSpacing: 0.3,
            boxShadow: hovered ? "0 6px 18px rgba(29,78,216,0.35)" : "0 2px 8px rgba(29,78,216,0.2)",
            transition: "all 0.25s ease",
          }}
        >
          Enquire Now →
        </button>
      </div>
    </div>
  );
}

function SlidingCards({ items, visibleCount = 3, interval = 4200, renderCard }) {
  const [index, setIndex] = useState(visibleCount);
  const [transition, setTransition] = useState(true);

  const safeItems = Array.isArray(items) ? items : [];

  useEffect(() => {
    if (safeItems.length <= visibleCount) return undefined;
    const timer = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, interval);
    return () => clearInterval(timer);
  }, [interval, safeItems.length, visibleCount]);

  useEffect(() => {
    setIndex(visibleCount);
    setTransition(true);
  }, [safeItems.length, visibleCount]);

  if (safeItems.length === 0) {
    return null;
  }

  if (safeItems.length <= visibleCount) {
    return (
      <div className="row g-4">
        {safeItems.map((item, itemIndex) => (
          <div className={`col-12 col-md-${12 / visibleCount}`} key={item.id || item.name || itemIndex}>
            {renderCard(item, itemIndex)}
          </div>
        ))}
      </div>
    );
  }

  const extended = [
    ...safeItems.slice(-visibleCount),
    ...safeItems,
    ...safeItems.slice(0, visibleCount),
  ];

  const next = () => setIndex((prev) => prev + 1);
  const prev = () => setIndex((prev) => prev - 1);

  const handleTransitionEnd = () => {
    if (index >= safeItems.length + visibleCount) {
      setTransition(false);
      setIndex(visibleCount);
      requestAnimationFrame(() => requestAnimationFrame(() => setTransition(true)));
    } else if (index < visibleCount) {
      setTransition(false);
      setIndex(safeItems.length + visibleCount - 1);
      requestAnimationFrame(() => requestAnimationFrame(() => setTransition(true)));
    }
  };

  return (
    <div className="trek-slider-container">
      <button className="trek-slider-btn left" onClick={prev} aria-label="Previous">❮</button>
      <div className="trek-slider-wrapper">
        <div
          className="trek-slider-track"
          style={{
            transform: `translateX(-${index * (100 / visibleCount)}%)`,
            transition: transition ? "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extended.map((item, itemIndex) => (
            <div className="trek-slide" key={`${item.id || item.name || "item"}-${itemIndex}`}>
              {renderCard(item, itemIndex)}
            </div>
          ))}
        </div>
      </div>
      <button className="trek-slider-btn right" onClick={next} aria-label="Next">❯</button>
    </div>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────
function Home() {
  const CPP = 4;
  const [loadedCount, setLoadedCount] = useState(CPP);
  const [page, setPage]               = useState(0);
  const [slideAnim, setSlideAnim]     = useState("");
  const [enquiryDest, setEnquiryDest] = useState(null);
  const gridRef = useRef(null);

  const loadedTreks  = uniqueTreks.slice(0, loadedCount);
  const totalPages   = Math.ceil(loadedCount / CPP);
  const visibleTreks = loadedTreks.slice(page * CPP, (page + 1) * CPP);
  const canPrev = page > 0;
  const canNext = page < totalPages - 1;
  const hasMore = loadedCount < uniqueTreks.length;

  const animateAndGo = useCallback((dir, cb) => {
    setSlideAnim(dir === "next" ? "ht-slide-out-left" : "ht-slide-out-right");
    setTimeout(() => {
      cb();
      setSlideAnim(dir === "next" ? "ht-slide-in-right" : "ht-slide-in-left");
      setTimeout(() => setSlideAnim(""), 320);
    }, 260);
  }, []);

  const goNext = () => { if (!canNext) return; animateAndGo("next", () => setPage((p) => p + 1)); };
  const goPrev = () => { if (!canPrev) return; animateAndGo("prev", () => setPage((p) => p - 1)); };

  const loadMore = () => {
    const newCount = Math.min(loadedCount + CPP, uniqueTreks.length);
    setLoadedCount(newCount);
    setPage(Math.floor(loadedCount / CPP));
  };

  const arrowStyle = (side) => ({
    position: "absolute",
    [side]: "-18px",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "#fff",
    border: "none",
    boxShadow: "0 4px 18px rgba(0,0,0,0.18)",
    fontSize: "1.4rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#198754",
    transition: "box-shadow 0.2s ease",
  });

  const tourTiles = [
    {
      title: "Manali",
      region: "himachal",
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
        "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800&q=80",
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80",
      ],
    },
    {
      title: "Rajasthan",
      region: "rajasthan",
      images: [
        "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80",
        "https://images.unsplash.com/photo-1524230572899-a752b3835840?w=800&q=80",
        "https://images.unsplash.com/photo-1599030399935-8e03c7b6dccc?w=800&q=80",
        "https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?w=800&q=80",
      ],
    },
    {
      title: "Kerala",
      region: "kerala",
      images: [
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
        "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800&q=80",
        "https://images.unsplash.com/photo-1545109808-7c2b27ad7869?w=800&q=80",
        "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=800&q=80",
      ],
    },
    {
      title: "Hampi",
      path: "/tours/hampi-tour",
      region: null,
      images: [
        "https://images.unsplash.com/photo-1600100399425-c7f41f02d5c8?w=800&q=80",
        "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80",
        "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=800&q=80",
        "https://images.unsplash.com/photo-1584825975702-a7c5e1fb8ff8?w=800&q=80",
      ],
    },
    {
      title: "Hampi — Gokarna",
      path: "/tours/hampi-gokarna-murudeshwar",
      region: null,
      images: [
        "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80",
        "https://images.unsplash.com/photo-1600100399425-c7f41f02d5c8?w=800&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
        "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&q=80",
      ],
    },
    {
      title: "Gokarna — Murdeshwar",
      path: "/tours/gokarna-honnavar-murudeshwar",
      region: null,
      images: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
        "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&q=80",
        "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",
      ],
    },
    {
      title: "Malvan — Tarkarli",
      path: "/tours/malvan-tarkarli-with-scuba-diving-and-watersports",
      region: null,
      images: [
        "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
        "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
        "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800&q=80",
      ],
    },
    {
      title: "Goa",
      path: "/tours/goa-backpacking",
      region: null,
      images: [
        "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=800&q=80",
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
        "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80",
        "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80",
      ],
    },
  ];

  const services = [
    {
      icon: "🥾",
      title: "Trekking",
      desc: "Join weekend treks, monsoon treks, and winter treks from Pune and Mumbai with expert guidance, safety, and affordable pricing.",
      link: "/treks",
    },
    {
      icon: "⛺",
      title: "Camping & Adventure",
      desc: "Experience camping near Pune and Mumbai with scenic locations, tents, and exciting outdoor activities for individuals and groups.",
      link: "/camping",
    },
    {
      icon: "🏢",
      title: "Corporate & Team Outings",
      desc: "We organize corporate treks, team outings, day outings, and team building activities designed for fun, bonding, and adventure.",
      link: "/corporate",
    },
    {
      icon: "🎒",
      title: "School / College / Industrial Visits",
      desc: "We conduct school trips, college tours, and industrial visits with safe, engaging, and well-planned experiences.",
      link: "/corporate",
    },
    ...(isHeritageEnabled() ? [{
      icon: "🏛️",
      title: "Heritage Walks",
      desc: "Explore history through curated heritage walks that showcase forts, culture, and local experiences.",
      link: "/heritage",
    }] : []),
    {
      icon: "🏡",
      title: "Villa Rental",
      desc: "Book villas on rent in Lonavala, Alibag, Dapoli, and Karjat for group stays and weekend getaways.",
      link: "/rentals",
    },
    {
      icon: "🏕️",
      title: "Tent Rental",
      desc: "Get tents on rent in Pune for trekking, camping, and outdoor adventures.",
      link: "/rentals",
    },
  ];

  const adminCampsites = getAdminItems("gt_camping")
    .filter((camp) => camp.active !== false)
    .map(normaliseItem);
  const allCampsites = [...campingList, ...adminCampsites];
  const campsiteCards = allCampsites.slice(0, 8).map((camp) => ({
    id: CAMPING_ROUTE_BY_NAME[camp.name],
    name: camp.shortName || camp.name,
    price: `Starting ₹${camp.price}`,
    img: camp.image,
    location: camp.location,
  }));
  const adminRentals = getAdminItems("gt_rentals")
    .filter((item) => item.active !== false)
    .map(normaliseItem);
  const tentRentalCards = [...rentalsList, ...adminRentals]
    .filter((item) => item.category === "Tents")
    .slice(0, 8)
    .map((item, idx) => ({
      id: item.id || `tent-rental-${idx}`,
      name: item.name,
      price: `Starting ₹${Number(item.price || item.pricePerDay || 0).toLocaleString("en-IN")}/day`,
      img: item.image,
      location: item.location,
      item,
    }));

  return (
    <>
      {/* ─── Global styles ───────────────────────────────────────────────────── */}
      <style>{`
        .ht-trek-card:hover .trek-gallery-image { animation: none !important; }
        .ht-grid-wrap { transition: opacity 0.26s ease, transform 0.26s ease; }
        .ht-slide-out-left  { opacity: 0; transform: translateX(-40px); }
        .ht-slide-out-right { opacity: 0; transform: translateX(40px); }
        .ht-slide-in-right  { opacity: 0; transform: translateX(40px); }
        .ht-slide-in-left   { opacity: 0; transform: translateX(-40px); }

        /* Hero */
        .ht-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(160deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.28) 100%);
        }
        .ht-hero-content { position: relative; z-index: 2; }
        .ht-hero-kicker {
          display: inline-block;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.25);
          color: #fff;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          padding: 6px 16px;
          border-radius: 999px;
          margin-bottom: 18px;
        }
        .ht-hero-headline {
          font-size: clamp(2.2rem, 5.5vw, 4rem);
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: #fff;
          margin-bottom: 18px;
        }
        .ht-hero-headline .ht-accent {
          color: #4ade80;
          position: relative;
        }
        .ht-hero-sub {
          font-size: clamp(0.95rem, 2vw, 1.15rem);
          color: rgba(255,255,255,0.88);
          max-width: 560px;
          margin: 0 auto 28px;
          line-height: 1.65;
        }
        .ht-hero-cta {
          display: inline-flex; align-items: center; gap: 8px;
          background: #16a34a;
          color: #fff;
          font-weight: 700;
          font-size: 1rem;
          padding: 14px 32px;
          border-radius: 999px;
          text-decoration: none;
          box-shadow: 0 8px 28px rgba(22,163,74,0.4);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .ht-hero-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 36px rgba(22,163,74,0.5);
          color: #fff;
        }
        .ht-hero-cta-outline {
          display: inline-flex; align-items: center; gap: 6px;
          border: 2px solid rgba(255,255,255,0.7);
          color: #fff;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 13px 28px;
          border-radius: 999px;
          text-decoration: none;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .ht-hero-cta-outline:hover { background: #fff; color: #16a34a; }

        /* Service cards */
        .ht-svc-card {
          border-radius: 18px;
          padding: 28px 24px;
          background: #fff;
          border: 1px solid #e8f5e9;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          height: 100%;
          display: flex; flex-direction: column;
        }
        .ht-svc-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 36px rgba(0,0,0,0.1);
        }
        .ht-svc-icon {
          font-size: 2.2rem;
          margin-bottom: 14px;
          width: 52px; height: 52px;
          display: flex; align-items: center; justify-content: center;
          background: #f0fdf4;
          border-radius: 14px;
        }

        /* SEO chips */
        .ht-seo-chip {
          display: inline-block;
          background: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 5px 14px;
          border-radius: 999px;
          white-space: nowrap;
        }

        /* Hero slide BG zoom */
        @keyframes htZoom {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
        .ht-hero-bg { animation: htZoom 22s ease-in-out infinite; }
      `}</style>

      {/* ================= HERO ================= */}
      <div
        id="heroCarousel"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
        data-bs-interval="6000"
      >
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active"></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2"></button>
        </div>

        <div className="carousel-inner">

          {/* Slide 1 — Primary SEO Hero */}
          <div className="carousel-item active">
            <div
              className="d-flex align-items-center justify-content-center text-center position-relative"
              style={{ height: "90vh", overflow: "hidden" }}
            >
              <div
                className="ht-hero-bg"
                style={{
                  position: "absolute", inset: 0,
                  backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="ht-hero-overlay" />
              <div className="ht-hero-content px-3">
                <span className="ht-hero-kicker">Sahyadri Trekking Experts</span>
                <h1 className="ht-hero-headline">
                  Escape the City.{" "}
                  <span className="ht-accent">Trek the Sahyadris.</span>
                </h1>
                <p className="ht-hero-sub">
                  Join budget-friendly treks, camping, and adventure experiences with departures from{" "}
                  <strong style={{ color: "#fff" }}>Pune, Mumbai, Thane, Navi Mumbai,</strong> and{" "}
                  <strong style={{ color: "#fff" }}>Kasara</strong>.
                </p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <Link to="/treks" className="ht-hero-cta">
                    Explore Treks →
                  </Link>
                  <Link to="/contact" className="ht-hero-cta-outline">
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 2 */}
          <div className="carousel-item">
            <div
              className="d-flex align-items-center justify-content-center text-center position-relative"
              style={{ height: "90vh", overflow: "hidden" }}
            >
              <div
                className="ht-hero-bg"
                style={{
                  position: "absolute", inset: 0,
                  backgroundImage: "url('https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1920&q=80')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="ht-hero-overlay" />
              <div className="ht-hero-content px-3">
                <span className="ht-hero-kicker">Himalayan Escapes</span>
                <h1 className="ht-hero-headline">
                  Himalayan <span className="ht-accent">Adventures</span>
                </h1>
                <p className="ht-hero-sub">
                  Explore breathtaking landscapes across Himachal, Uttarakhand, and Kashmir with curated group tours.
                </p>
                <Link to="/tours" className="ht-hero-cta">
                  Explore Tours →
                </Link>
              </div>
            </div>
          </div>

          {/* Slide 3 */}
          <div className="carousel-item">
            <div
              className="d-flex align-items-center justify-content-center text-center position-relative"
              style={{ height: "90vh", overflow: "hidden" }}
            >
              <div
                className="ht-hero-bg"
                style={{
                  position: "absolute", inset: 0,
                  backgroundImage: "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1920&q=80')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="ht-hero-overlay" />
              <div className="ht-hero-content px-3">
                <span className="ht-hero-kicker">Corporate & School Groups</span>
                <h1 className="ht-hero-headline">
                  Team Outings &{" "}
                  <span className="ht-accent">School Trips</span>
                </h1>
                <p className="ht-hero-sub">
                  Safe, customized, and affordable corporate treks, team building activities, and school/college tours.
                </p>
                <Link to="/corporate" className="ht-hero-cta">
                  Plan Your Trip →
                </Link>
              </div>
            </div>
          </div>

        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      {/* ================= TREKS & CAMPING (Premium Section) ================= */}
      <section
        className="py-5"
        style={{ background: "linear-gradient(160deg, #f0fdf4 0%, #fff 60%)" }}
      >
        <div className="container">

          {/* Section header */}
          <div className="text-center mb-4">
            <span
              style={{
                color: "#16a34a",
                fontWeight: 700,
                fontSize: "0.8rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Featured Experiences
            </span>
            <h2 className="fw-bold mt-1 mb-3">— TREKS &amp; CAMPING —</h2>

            {/* SEO-rich description */}
            <p
              className="mx-auto"
              style={{ maxWidth: "680px", color: "#555", lineHeight: 1.7, fontSize: "0.97rem" }}
            >
              Discover the best treks near Pune and Mumbai with budget-friendly weekend treks
              across the Sahyadri mountains. Join monsoon treks, winter treks, and
              beginner-friendly hiking experiences with a trusted trekking community.
            </p>
          </div>

          {/* Paginated grid with prev/next arrows */}
          <div style={{ position: "relative" }}>

            {canPrev && (
              <button onClick={goPrev} style={arrowStyle("left")} aria-label="Previous treks">‹</button>
            )}

            <div ref={gridRef} className={`row g-3 ht-grid-wrap ${slideAnim}`}>
              {visibleTreks.map((trek) => (
                <div className="col-12 col-sm-6 col-md-3" key={trek.name}>
                  <HomeTrekCard trek={trek} />
                </div>
              ))}
            </div>

            {canNext && (
              <button onClick={goNext} style={arrowStyle("right")} aria-label="Next treks">›</button>
            )}
          </div>

          {/* Page dots */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center gap-2 mt-3">
              {Array.from({ length: totalPages }).map((_, i) => (
                <span
                  key={i}
                  style={{
                    width: "8px", height: "8px", borderRadius: "50%",
                    background: i === page ? "#198754" : "#ccc",
                    display: "inline-block",
                    transition: "background 0.3s ease",
                  }}
                />
              ))}
            </div>
          )}

          {/* Load More + View All */}
          <div className="text-center mt-4 d-flex justify-content-center align-items-center gap-3 flex-wrap">
            {hasMore && (
              <button
                onClick={loadMore}
                className="btn btn-outline-success fw-semibold px-4 py-2"
                style={{ borderRadius: "999px" }}
              >
                Load More Treks
              </button>
            )}
            <Link to="/treks" className="btn btn-success fw-semibold px-4 py-2" style={{ borderRadius: "999px" }}>
              View All Treks →
            </Link>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="py-5" style={{ background: "#f8fffe" }}>
        <div className="container">
          <div className="text-center mb-5">
            <span
              style={{
                color: "#16a34a",
                fontWeight: 700,
                fontSize: "0.8rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              What We Offer
            </span>
            <h2 className="fw-bold mt-1 mb-2">Our Adventure Services</h2>
            <p className="text-muted">
              Everything you need — from weekend treks to corporate outings and villa stays.
            </p>
          </div>

          <div className="row g-4">
            {services.map((svc, i) => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={i}>
                <div className="ht-svc-card">
                  <div className="ht-svc-icon">{svc.icon}</div>
                  <h5 className="fw-bold mb-2" style={{ fontSize: "1rem" }}>{svc.title}</h5>
                  <p className="text-muted mb-3" style={{ fontSize: "0.875rem", lineHeight: 1.65, flex: 1 }}>
                    {svc.desc}
                  </p>
                  <Link
                    to={svc.link}
                    className="btn btn-outline-success btn-sm"
                    style={{ borderRadius: "999px", alignSelf: "flex-start" }}
                  >
                    Learn More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= POPULAR TOURS ================= */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">— POPULAR TOURS —</h2>
          <div className="row g-4">
            {tourTiles.map((tile) => (
              <TourTile key={tile.title} {...tile} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= POPULAR CAMPSITES ================= */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold">Explore Campsites</h2>
          <p className="text-center text-muted mb-5">Discover beach, lake, mountain, and forest camping getaways.</p>
          <SlidingCards
            items={campsiteCards}
            visibleCount={3}
            renderCard={(camp) => (
              <div className="card border-0 shadow-sm h-100 text-center">
                <img src={camp.img} className="card-img-top standard-img" alt={camp.name} />
                <div className="card-body">
                  <h5>{camp.name}</h5>
                  <p className="text-muted small mb-2">{camp.location}</p>
                  <h6 className="fw-bold text-success">{camp.price}</h6>
                  <Link to={`/camping/${camp.id || "alibaug-camping"}`} className="btn btn-success mt-3">Explore →</Link>
                </div>
              </div>
            )}
          />

          <div className="text-center mt-4">
            <Link to="/camping" className="btn btn-outline-success px-4">View All Campsites →</Link>
          </div>
        </div>
      </section>

      {/* ================= HERITAGE WALKS ================= */}
      {isHeritageEnabled() && <section className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold">Explore Pune Heritage Walks</h2>
          <p className="text-center text-muted mb-5">Discover history, culture, and hidden gems of Pune.</p>

          {(() => {
            const heritage = [
              { name: "Old Pune City Walk",     price: "Starting ₹399", img: "/HeritageImages/pune.png",           state: { category: "city" } },
              { name: "Forts & Landmarks Walk",  price: "Starting ₹699", img: "/HeritageImages/shanivaarwada.png",  state: { category: "forts" } },
              { name: "Temple & Cultural Walk",  price: "Starting ₹299", img: "/HeritageImages/cultural.png",       state: { category: "temples" } },
            ];
            return (
              <div className="row g-4">
                {heritage.map((item, i) => (
                  <div className="col-md-4" key={i}>
                    <div className="card border-0 shadow-sm h-100 text-center">
                      <img src={item.img} className="card-img-top standard-img" alt={item.name} />
                      <div className="card-body">
                        <h5>{item.name}</h5>
                        <h6 className="fw-bold text-success">{item.price}</h6>
                        <Link to="/heritage" state={item.state} className="btn btn-success mt-3">Explore →</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

          <div className="text-center mt-4">
            <Link to="/heritage" className="btn btn-outline-success px-4">View All Heritage Walks →</Link>
          </div>
        </div>
      </section>}

      {/* ================= RENTALS ================= */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold">Adventure Rentals & Essentials</h2>
          <p className="text-center text-muted mb-5">Browse listed tent rentals ready for your next trek, campsite, or outdoor event.</p>

          <SlidingCards
            items={tentRentalCards}
            visibleCount={3}
            renderCard={(item) => (
              <div className="card border-0 shadow-sm h-100 text-center">
                <img src={item.img} className="card-img-top standard-img" alt={item.name} />
                <div className="card-body d-flex flex-column">
                  <h5>{item.name}</h5>
                  <p className="text-muted small mb-2">{item.location}</p>
                  <h6 className="fw-bold text-success">{item.price}</h6>
                  <Link to={`/rentals/${item.id}`} state={{ item: item.item }} className="btn btn-success mt-auto">Explore →</Link>
                </div>
              </div>
            )}
          />

          <div className="text-center mt-4">
            <Link to="/rentals" className="btn btn-outline-success px-4">View All Rentals →</Link>
          </div>
        </div>
      </section>

      {/* ================= CORPORATE / BUDGET TOURS ================= */}
      <section className="py-5" style={{ background: "linear-gradient(180deg,#f0fdf4 0%,#eff6ff 100%)" }}>
        <div className="container">
          <div className="text-center mb-4">
            <span style={{ background: "#dbeafe", color: "#1d4ed8", borderRadius: 20, padding: "4px 16px", fontSize: "0.75rem", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
              🎓 School & College Packages
            </span>
            <h2 className="fw-bold mt-2 mb-1">Budget Tours for Schools &amp; Corporate Groups</h2>
            <p className="text-muted mb-0">Safe, affordable &amp; customizable PAN-India tours.</p>
          </div>

          <div style={{ marginBottom: 32 }}>
            <SlidingCards
              items={ivDestinations}
              visibleCount={3}
              renderCard={(dest, idx) => (
                <IVDestCard dest={dest} idx={idx} onEnquire={() => setEnquiryDest(dest)} />
              )}
            />
          </div>

          <div className="text-center">
            <Link to="/industrial-visits" className="btn btn-primary px-5 py-2 fw-bold" style={{ borderRadius: 30, background: "linear-gradient(135deg,#1d4ed8,#2563eb)", border: "none", boxShadow: "0 4px 16px rgba(29,78,216,0.25)" }}>
              View All Packages →
            </Link>
          </div>
        </div>
      </section>

      {enquiryDest && (
        <EnquiryModal dest={enquiryDest} category="Industrial Visit" onClose={() => setEnquiryDest(null)} />
      )}

      {/* ================= LOCAL SEO SECTION ================= */}
      <section
        className="py-4"
        style={{ background: "#f0fdf4", borderTop: "1px solid #d1fae5", borderBottom: "1px solid #d1fae5" }}
      >
        <div className="container">
          <div className="text-center mb-3">
            <p className="text-muted mb-2" style={{ fontSize: "0.9rem" }}>
              Treks available from{" "}
              <strong>Pune, Mumbai, Thane, Navi Mumbai, Kasara, Pimpri-Chinchwad, Hinjewadi,</strong> and{" "}
              <strong>Kharadi</strong>.
            </p>
            <p className="text-muted mb-3" style={{ fontSize: "0.82rem" }}>Popular searches:</p>
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {[
                "Treks near Pune",
                "Treks near Mumbai",
                "Budget Treks Maharashtra",
                "Monsoon Treks",
                "Weekend Treks near Pune",
              ].map((tag) => (
                <span key={tag} className="ht-seo-chip">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Floating WhatsApp button ── */}
      <a
        href="https://wa.me/919856112727"
        target="_blank"
        rel="noopener noreferrer"
        title="Chat on WhatsApp"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
          backgroundColor: "#25D366",
          borderRadius: "50%",
          width: "58px",
          height: "58px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
        </svg>
      </a>
    </>
  );
}

export default Home;
