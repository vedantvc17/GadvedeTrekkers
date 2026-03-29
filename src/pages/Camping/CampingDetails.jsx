import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAdminItems, normaliseItem } from "../../data/adminStorage";

const CAMPING_PREVIEW_KEY = "gt_camping_preview";

/* ─── Rich data for each campsite ─── */
const campingData = {
  "alibaug-camping": {
    name: "Alibaug Camping | Music | Barbecue | Bonfire",
    shortName: "Alibaug Beach Camping",
    location: "Alibaug near Nagaon Beach, Maharashtra",
    type: "Beach",
    duration: "Overnight",
    price: 400,
    originalPrice: 699,
    childPrice: 699,
    adultPrice: 1199,
    coupon: "3 offers",
    badge: "Best Budget",
    availability: "Available for every Saturday-Sunday",
    nextDates: ["25 Mar, 4:00 PM", "26 Mar, 4:00 PM", "27 Mar, 4:00 PM"],
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    ],
    offers: [
      { code: "GDCAMP100", desc: "Save on group of 6 and more" },
      { code: "GDCAMP50",  desc: "Save on group of 4 and more" },
      { code: "EARLY75",   desc: "Early Booking Discount" },
    ],
    about: `Famous among beach lovers, Alibaug is a gorgeous beach town with a restful and peaceful break from the hustle-bustle of city life. Whether it is about sparkling beaches, a fun journey on curved roads, amazingly delectable seafood preparations, attractive sunsets, and green cover, all this makes it the just right long weekend escape from Mumbai.

When it comes to the most favorable time for planning a trip to Alibaug Beach, it is from November to May. You can also come here anytime in August, September, and October — during these months you can best enjoy the green splendor of this place.

Are you looking for the best option for beach camping near Mumbai and Pune? Located about 13 km ahead of Alibaug, Nagaon Beach is famous for Alibaug beach camping.`,
    howToReach: [
      "From Mumbai: Catch a ferry boat from Gateway of India to Mandwa Jetty. From Mandwa Jetty, a bus will take you to Alibaug (bus fare included in ferry ticket). From Alibaug, catch a rickshaw directly to the campsite.",
      "From Pune: Catch a bus directly to Alibaug. From Alibaug, catch a rickshaw directly to the campsite.",
      "Private Vehicle: A GPS location will be shared one day before the event. GPS coordinates can be used to navigate to the campsite.",
      "M2M Ferries from Ferry Wharf or Bhaucha Dhakka reach Mandwa in 60 minutes and can accommodate almost any type of vehicle. Pets are allowed. Drive to campsite from Mandwa jetty using GPS coordinates.",
    ],
    eventDetails: [
      "Camping Location: Alibaug near Nagaon Beach",
      "Western Toilet with Shower",
      "Live Music (Saturday & Christmas Day)",
      "Movie Screening by the beach",
      "Beachside Camping Under the Stars",
      "BBQ (Veg/Non-Veg Limited)",
      "Bonfire (limited)",
      "Music & Tent Stay",
      "Fun Games & Night Walk on the beach",
      "Please be aware that this is not a pet-friendly campsite",
    ],
    itinerary: [
      {
        day: "Day 1 — Alibaug Tent Camping",
        items: [
          "04:00–04:30 PM — Reach the campsite. Enjoy Arrival Refreshment (Kokum Sharbat)",
          "04:30–05:00 PM — Free time, explore campsite and beach",
          "05:00 PM — High Tea and Snacks (Misal Pav)",
          "Sunset — Beach Walk and enjoy the beautiful sunset",
          "08:00 PM — BBQ (Limited)",
          "09:00–10:00 PM — Music and dance floor",
          "10:00 PM — Dinner",
          "11:00–11:30 PM — Live Music",
          "12:00–12:30 AM — Movie Screening",
          "Bonfire time with friends and family",
        ],
      },
      {
        day: "Day 2 — Alibaug Tent Camping",
        items: [
          "08:00–08:30 AM — Freshen up",
          "09:00 AM — Breakfast served (Hot tea + full tummy breakfast with sea view)",
          "10:00 AM — Enjoy the morning beachside, play games, take a dip, or do water sports",
          "11:00 AM — Check Out with Sweet & Lovable Memories!",
        ],
      },
    ],
    foodMenu: [
      { icon: "☀️", label: "Welcome Drink", detail: "Refreshing Kokum Sharbat" },
      { icon: "🍽️", label: "Evening Snacks", detail: "Misal Pav with Hot Tea" },
      {
        icon: "🔥", label: "BBQ (Limited)",
        detail: "Non-Veg: Juicy Chicken (180-200g) | Veg: Grilled Corn, Potato, or Sweet Potato (180-200g)",
      },
      {
        icon: "🍛", label: "Dinner",
        detail: "Non-Veg: Chicken Gravy, Chapati, Rice, Salad | Veg: Matar Paneer, Chole Bhaji, Dal, Chapati, Rice, Salad",
      },
      { icon: "🌅", label: "Breakfast", detail: "Tea & Kanda Poha" },
    ],
    highlights: [
      {
        title: "Camp Bonfire at Beach",
        desc: "As night approaches, you get a chance to see the exotic sky full of shining stars. Light up a camp bonfire under the starry sky and have great fun with fellow campers.",
      },
      {
        title: "Barbeque at Camp",
        desc: "Try your hand at the barbeque and enjoy the moment. There's nothing better than a lip-smacking meal in chill night-time air with your camping buddies.",
      },
      {
        title: "Watch Sunrise & Sunset",
        desc: "Walk to the beach early morning for a breathtaking sunrise. In the evening, enjoy the sunset view from your beachside tent — a delight for the senses.",
      },
    ],
    included: [
      "Welcome Drinks & Snacks",
      "BBQ Limited (Approx 180-200 Grams)",
      "Unlimited Dinner (Veg/Non-Veg/Jain)",
      "Tent Stay (Blanket and Pillows)",
      "Movie Screening",
      "Live Music (Only on Saturday Night)",
      "Breakfast (On Day 2)",
    ],
    notIncluded: [
      "Any transportation",
      "Mineral water / Lime Water purchased for personal consumption",
      "All kinds of Extra Meals / soft drinks ordered",
      "Water sports adventure activity",
      "Any kind of personal expenses",
      "Any cost not mentioned in the inclusions above",
      "Expenses due to unforeseen circumstances like roadblocks, bad weather",
      "Any medical / emergency evacuations if required",
    ],
    thingsToCarry: [
      "Valid Photo ID", "Cap or Hat", "Personal Medicine", "Sunscreen and Insect Repellent",
      "Torch", "Power Bank", "Water Bottle", "Face Mask or Shield", "Sanitizer",
      "Extra pair of clothes & towel", "Warm clothing (during winter)", "Mosquito repellent cream",
    ],
    cancellation: [
      "50% refund if notified via phone conversation 10 days prior to the event date.",
      "No refund if cancellation is requested less than 6 days prior to the event date.",
      "No show — No Refund.",
      "Event tickets cannot be transferred to another date against cancellation.",
      "Event tickets cannot be transferred to another person against cancellation.",
      "If the event gets cancelled, we will refund the trek amount only.",
      "If the event is cancelled due to any natural calamity, political unrest or other reasons beyond our control, the same cancellation policy will apply.",
    ],
    rules: [
      "Kindly carry one Identity proof for the trek with your address.",
      "The leader's decision will be final; all members should abide by it.",
      "Do not destroy or dirty archaeological, historical monuments, or natural habitats.",
      "Swimming is not allowed in the lake or water tank on forts.",
      "Any addiction is strictly prohibited (drinking, smoking, chewing tobacco). Anyone caught will be asked to exit without a refund.",
      "Do not carry or wear any valuables, ornaments, or jewellery.",
      "Listening to music on earphones or Bluetooth speakers is not allowed while trekking.",
      "Bluetooth speakers not allowed inside the campsite tents.",
      "Drinking/smoking/eating is not allowed inside the tents.",
      "If you damage the tent or break tent poles, you will have to pay for a whole new tent at MRP.",
      "If you are late for bus pickup and unreachable on phone, the trek leader will leave without you — no refund.",
      "Please check things to carry and wear trekking shoes on our treks.",
    ],
    waterSports: [
      "Parasailing", "Scuba Diving", "Kayaking", "Speed Boat Rides",
      "Banana Boat Rides", "Jet Skiing", "Dolphin Sightseeing",
      "Stand-Up Paddle Boarding", "Kite Surfing", "Bumper Cars",
    ],
    ferrySchedule: [
      {
        operator: "Gateway Ganga",
        from: "8:00am, 10:00am, 12:00pm, 2:00pm, 4:00pm, 6:00pm",
        return: "6:30am, 8:30am, 10:30am, 12:30pm, 2:30pm, 4:30pm, 6:30pm",
        fare: "₹155 one-way | ₹280 round-trip",
      },
      {
        operator: "Mumbai Alibaug Fast Ferry",
        from: "8:00am, 10:00am, 12:00pm, 2:00pm, 4:00pm",
        return: "6:30am, 8:30am, 10:30am, 12:30pm, 2:30pm",
        fare: "₹130 one-way | ₹230 round-trip",
      },
      {
        operator: "Mandwa Alibaug Water Transport",
        from: "8:00am, 9:30am, 11:00am, 12:30pm, 2:00pm, 3:30pm, 5:00pm",
        return: "6:30am, 8:00am, 9:30am, 11:00am, 12:30pm, 2:00pm, 3:30pm",
        fare: "₹130 one-way | ₹230 round-trip",
      },
    ],
    faqs: [
      { q: "Can you tell me about Alibaug beach camping?", a: "Beach camping Alibaug is a relaxing activity where you enjoy the seaside ambience and camping adventure simultaneously. Usually undertaken through winter and summer, it gives a unique opportunity to surf the remote tides, watch gorgeous sunsets, and experience the calmness of the region." },
      { q: "Things to do in Alibaug?", a: "Alibaug has many famous beaches like Nagaon Beach, Kihim Beach, Kashid Beach, and Akshi Beach. Visit sea forts by boat, or walk to Kolaba Fort during low tide. Visit the fish market for fresh daily catch. Water sports are available on all popular beaches." },
      { q: "Is Alibaug camping available during monsoon?", a: "Beach Camping in Alibaug is closed during the monsoon season (June–September) as the sea is rough and high winds make camping difficult. Winter (November–February) is the most popular period and sells out quickly — book in advance!" },
      { q: "How far is the Alibaug campsite from the beach?", a: "The Alibaug campsite is approximately 50 meters from the beach. This closeness provides a chance to spend a remarkable time on the shore, gazing at the impressive scenery and fascinating seacoast." },
      { q: "Is the Alibaug campsite safe for solo travellers and females?", a: "Alibaug Beach Camping is safe for females. Our property has good lighting, and the staff is always available throughout the night. For solo travellers, we provide beach tents with different accommodation for women and men. Please enquire before booking." },
      { q: "Is Alibaug camping for couples safe?", a: "Yes! Alibaug Beach Camping is couple-friendly. Our team manages night security throughout your stay. Whether an experienced camper or a beginner, it is essential to be aware of the risks and take necessary precautions for a safe and memorable vacation." },
      { q: "Are pickup and drop facilities available?", a: "Pickup and Drop options are not available from Mumbai or Pune for Alibaug Camping Beach. We will provide Google Map coordinates and campsite manager number. For guests arriving by Ferry, we have the option for pickup and drop from Mandwa Jetty." },
      { q: "Best season to visit Alibaug Beach Camping?", a: "For hot weather and beach activities: April–June (summer). For cooler weather and outdoor activities: November–February (winter). Monsoon (June–September) brings heavy rain and strong winds — not ideal for camping. Winter sells out fast — book in advance!" },
    ],
    nearbyPlaces: [
      "Pawna Lake Camping", "Kashid Beach Camping", "Revdanda Beach Camping",
      "Devkund Waterfall Camping", "Igatpuri Camping", "Kelva Beach Camping",
      "Bhandardara Camping", "Matheran Camping", "Karjat Riverside Camping",
    ],
  },
};

/* ─── Fallback generic data for other camps ─── */
function getGenericData(id) {
  const nameMap = {
    "pawna-lake-camping": { name: "Pawna Lake Camping 2026", location: "Pawna Lake — Keware Village", price: 1099, image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7" },
    "igatpuri-camping": { name: "Igatpuri Secret Camping", location: "Igatpuri, Maharashtra", price: 899, image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e" },
    "bhandardara-camping": { name: "Bhandardara Lake Camping", location: "Bhandardara, Maharashtra", price: 999, image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff" },
    "stargazing-camping": { name: "Stargazing Camping Dehene", location: "Dehene, Maharashtra", price: 1699, image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee" },
    "panshet-camping": { name: "Panshet Dam Camping", location: "Panshet, Maharashtra", price: 849, image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21" },
    "kalsubai-camping": { name: "Kalsubai Camping", location: "Bari, Maharashtra", price: 1299, image: "https://images.unsplash.com/photo-1587474260584-136574528ed5" },
    "revdanda-camping": { name: "Revdanda Beach Camping", location: "Revdanda Beach, Maharashtra", price: 300, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" },
    "rajmachi-camping": { name: "Rajmachi Camping", location: "Udhewadi, Maharashtra", price: 1599, image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470" },
  };
  return nameMap[id] || null;
}

export default function CampingDetails() {
  const { id } = useParams();
  const [activeImg, setActiveImg] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [guests, setGuests] = useState(2);
  const [selectedDate, setSelectedDate] = useState("");
  const [bookingDone, setBookingDone] = useState(false);

  const previewCamp = id === "preview"
    ? (() => {
        try {
          return JSON.parse(sessionStorage.getItem(CAMPING_PREVIEW_KEY) || "null");
        } catch {
          return null;
        }
      })()
    : null;

  const adminCamp =
    id !== "preview"
      ? getAdminItems("gt_camping")
          .map(normaliseItem)
          .find((entry) => entry.id === id)
      : null;

  const camp = previewCamp || campingData[id];
  const generic = !camp ? adminCamp || getGenericData(id) : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    if (camp) document.title = `${camp.shortName} | Gadvede Trekkers`;
    else if (generic) document.title = `${generic.name} | Gadvede Trekkers`;
  }, [id]);

  if (!camp && !generic) {
    return (
      <div className="container py-5 text-center">
        <h2>Campsite not found</h2>
        <Link to="/camping" className="btn btn-success mt-3">Back to Camping</Link>
      </div>
    );
  }

  /* ── Generic fallback page ── */
  if (!camp && generic) {
    return (
      <div>
        <div style={{ background: "linear-gradient(135deg,#064e3b,#065f46)", padding: "56px 0 40px", color: "#fff", textAlign: "center" }}>
          <div className="container">
            <p style={{ fontSize: "0.8rem", marginBottom: 14, opacity: 0.7 }}>
              <Link to="/" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Home</Link>
              {" › "}<Link to="/camping" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Camping</Link>
              {" › "}<span style={{ color: "#6ee7b7" }}>{generic.name}</span>
            </p>
            <h1 style={{ fontWeight: 900, fontSize: "clamp(1.8rem,4vw,2.8rem)", marginBottom: 12 }}>{generic.name}</h1>
            <p style={{ opacity: 0.85, marginBottom: 24 }}>📍 {generic.location}</p>
            <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#6ee7b7" }}>Starting ₹{generic.price.toLocaleString()}/person</span>
          </div>
        </div>
        <div className="container py-5 text-center">
          <img src={`${generic.image}?auto=format&fit=crop&w=900&q=80`} alt={generic.name} style={{ width: "100%", maxHeight: 400, objectFit: "cover", borderRadius: 16, marginBottom: 32 }} />
          <h3 style={{ fontWeight: 700, color: "#065f46", marginBottom: 16 }}>Ready to Book?</h3>
          <p style={{ color: "#374151", maxWidth: 500, margin: "0 auto 24px" }}>Chat with us on WhatsApp for detailed information, upcoming dates, and group booking discounts.</p>
          <a href="https://wa.me/919856112727" target="_blank" rel="noopener noreferrer"
            style={{ background: "#25d366", color: "#fff", padding: "12px 28px", borderRadius: 10, fontWeight: 700, textDecoration: "none", display: "inline-block" }}>
            Chat on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>

      {/* ── HERO ── */}
      <div style={{ background: "linear-gradient(135deg,#064e3b 0%,#065f46 60%,#047857 100%)", padding: "48px 0 36px", color: "#fff" }}>
        <div className="container">
          <p style={{ fontSize: "0.8rem", marginBottom: 14, opacity: 0.7 }}>
            <Link to="/" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Home</Link>
            {" › "}<Link to="/camping" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Upcoming Events</Link>
            {" › "}<span style={{ color: "#6ee7b7" }}>{camp.name}</span>
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
            <span style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 999, padding: "4px 14px", fontSize: "0.78rem", fontWeight: 600 }}>
              ⏱ {camp.duration}
            </span>
            <span style={{ background: "#d1fae5", color: "#065f46", borderRadius: 999, padding: "4px 14px", fontSize: "0.78rem", fontWeight: 700 }}>
              ⛺ {camp.type} Camping
            </span>
            <span style={{ background: "#fef3c7", color: "#92400e", borderRadius: 999, padding: "4px 14px", fontSize: "0.78rem", fontWeight: 700 }}>
              🎟 {camp.coupon}
            </span>
          </div>
          <h1 style={{ fontWeight: 900, fontSize: "clamp(1.5rem,3.5vw,2.4rem)", lineHeight: 1.2, marginBottom: 10 }}>
            {camp.name}
          </h1>
          <p style={{ opacity: 0.85, fontSize: "0.95rem", marginBottom: 20 }}>📍 {camp.location}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div>
              <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>Starting From</span>
              <div><span style={{ fontSize: "2rem", fontWeight: 900, color: "#6ee7b7" }}>₹{camp.price}</span><span style={{ fontSize: "0.85rem", opacity: 0.7, marginLeft: 6 }}>/person</span></div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, fontSize: "0.78rem", opacity: 0.85 }}>
              {["✅ Best Price Guaranteed", "🔒 Secure & Easy Booking", "😊 1000+ Happy Customers"].map((t) => (
                <span key={t} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "3px 12px" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32, alignItems: "start" }}>

          {/* ── LEFT COLUMN ── */}
          <div>

            {/* Photo Gallery */}
            <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 32 }}>
              <div style={{ position: "relative" }}>
                <img src={camp.images[activeImg]} alt={camp.shortName} style={{ width: "100%", height: 380, objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ display: "flex", gap: 8, padding: "10px 0" }}>
                {camp.images.map((img, i) => (
                  <div key={i} onClick={() => setActiveImg(i)}
                    style={{ width: 72, height: 52, borderRadius: 8, overflow: "hidden", cursor: "pointer", border: i === activeImg ? "2.5px solid #059669" : "2px solid #e2e8f0", flexShrink: 0 }}>
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Overview */}
            <section style={{ marginBottom: 36 }}>
              <h2 style={{ fontWeight: 800, color: "#065f46", marginBottom: 4, fontSize: "1.3rem" }}>Overview</h2>
              <h3 style={{ fontWeight: 700, color: "#1e293b", marginBottom: 16, fontSize: "1.05rem" }}>About {camp.shortName}</h3>
              {camp.about.split("\n\n").map((p, i) => (
                <p key={i} style={{ color: "#374151", lineHeight: 1.85, fontSize: "0.93rem", marginBottom: 14 }}>{p}</p>
              ))}
            </section>

            {/* How to Reach */}
            <section style={{ marginBottom: 36, background: "#f0fdf4", borderRadius: 16, padding: "24px 28px" }}>
              <h3 style={{ fontWeight: 800, color: "#065f46", marginBottom: 16, fontSize: "1.1rem" }}>🗺 How to Reach {camp.shortName}</h3>
              <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
                {camp.howToReach.map((item, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, marginBottom: 12, fontSize: "0.88rem", color: "#374151", lineHeight: 1.7 }}>
                    <span style={{ color: "#059669", fontWeight: 700, flexShrink: 0 }}>→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Upcoming Batches + Cost */}
            <section style={{ marginBottom: 36 }}>
              <h3 style={{ fontWeight: 800, color: "#1e293b", marginBottom: 12, fontSize: "1.1rem" }}>📅 Upcoming Batches</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                <span style={{ background: "#f0fdf4", color: "#065f46", border: "1px solid #bbf7d0", borderRadius: 8, padding: "5px 14px", fontSize: "0.85rem", fontWeight: 600 }}>
                  Available every Saturday–Sunday
                </span>
                <span style={{ background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a", borderRadius: 8, padding: "5px 14px", fontSize: "0.85rem", fontWeight: 600 }}>
                  Weekday camping available without Live Music
                </span>
              </div>
              <h3 style={{ fontWeight: 800, color: "#1e293b", marginBottom: 12, fontSize: "1.1rem" }}>💰 Camping Cost (without transport)</h3>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 20px" }}>
                  <div style={{ fontSize: "0.78rem", color: "#6b7280" }}>Child (5–9 years)</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#059669" }}>₹{camp.childPrice}</div>
                  <div style={{ fontSize: "0.72rem", color: "#6b7280" }}>per person</div>
                </div>
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 20px" }}>
                  <div style={{ fontSize: "0.78rem", color: "#6b7280" }}>Adult (10 years+)</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#059669" }}>₹{camp.adultPrice}</div>
                  <div style={{ fontSize: "0.72rem", color: "#6b7280" }}>per person</div>
                </div>
              </div>
            </section>

            {/* Event Details */}
            <section style={{ marginBottom: 36 }}>
              <h3 style={{ fontWeight: 800, color: "#1e293b", marginBottom: 16, fontSize: "1.1rem" }}>⛺ Event Details</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {camp.eventDetails.map((d, i) => (
                  <span key={i} style={{ background: "#f1f5f9", color: "#374151", borderRadius: 8, padding: "6px 14px", fontSize: "0.83rem", fontWeight: 500 }}>
                    ✓ {d}
                  </span>
                ))}
              </div>
            </section>

            {/* Itinerary */}
            <section style={{ marginBottom: 36 }}>
              <h3 style={{ fontWeight: 800, color: "#1e293b", marginBottom: 20, fontSize: "1.1rem" }}>🗓 Event Itinerary</h3>
              {camp.itinerary.map((day) => (
                <div key={day.day} style={{ marginBottom: 20 }}>
                  <div style={{ fontWeight: 700, color: "#065f46", background: "#f0fdf4", borderRadius: 10, padding: "10px 16px", marginBottom: 10, fontSize: "0.9rem", border: "1px solid #bbf7d0" }}>
                    {day.day}
                  </div>
                  <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
                    {day.items.map((item, i) => (
                      <li key={i} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: "0.87rem", color: "#374151", lineHeight: 1.6 }}>
                        <span style={{ color: "#059669", flexShrink: 0 }}>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            {/* Food Menu */}
            <section style={{ marginBottom: 36, background: "#fffbeb", borderRadius: 16, padding: "24px 28px", border: "1px solid #fde68a" }}>
              <h3 style={{ fontWeight: 800, color: "#92400e", marginBottom: 16, fontSize: "1.1rem" }}>🍽 Delicious Food Menu</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {camp.foodMenu.map((item) => (
                  <div key={item.label} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>{item.icon}</span>
                    <div>
                      <span style={{ fontWeight: 700, color: "#92400e", fontSize: "0.88rem" }}>{item.label}: </span>
                      <span style={{ color: "#374151", fontSize: "0.87rem", lineHeight: 1.6 }}>{item.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Dates & Rates */}
            <section style={{ marginBottom: 36 }}>
              <h3 style={{ fontWeight: 800, color: "#1e293b", marginBottom: 16, fontSize: "1.1rem" }}>📅 Dates & Rates</h3>
              <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "#f8fafc", padding: "10px 16px", fontWeight: 700, fontSize: "0.82rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  <span>Date & Duration</span><span>Availability</span><span>Price</span>
                </div>
                {camp.nextDates.map((date, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "12px 16px", borderTop: "1px solid #f1f5f9", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>{date}</div>
                      <div style={{ fontSize: "0.76rem", color: "#6b7280" }}>Overnight</div>
                    </div>
                    <span style={{ color: "#059669", fontWeight: 600, fontSize: "0.85rem" }}>✅ Available</span>
                    <span style={{ fontWeight: 800, color: "#059669", fontSize: "1.05rem" }}>₹ {camp.price}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Highlights */}
            <section style={{ marginBottom: 36 }}>
              <h3 style={{ fontWeight: 800, color: "#1e293b", marginBottom: 16, fontSize: "1.1rem" }}>🌟 Highlights</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
                {camp.highlights.map((h) => (
                  <div key={h.title} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "18px 18px" }}>
                    <h4 style={{ fontWeight: 700, color: "#065f46", fontSize: "0.92rem", marginBottom: 8 }}>{h.title}</h4>
                    <p style={{ fontSize: "0.85rem", color: "#374151", lineHeight: 1.7, margin: 0 }}>{h.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Offers */}
            <section style={{ marginBottom: 36, background: "#f0fdf4", borderRadius: 16, padding: "24px 28px", border: "1px solid #bbf7d0" }}>
              <h3 style={{ fontWeight: 800, color: "#065f46", marginBottom: 4, fontSize: "1.1rem" }}>🎟 Discount Offers</h3>
              <p style={{ fontSize: "0.82rem", color: "#6b7280", marginBottom: 16 }}>Use any one code to avail this offer</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {camp.offers.map((o) => (
                  <div key={o.code} style={{ background: "#fff", border: "1.5px dashed #059669", borderRadius: 10, padding: "10px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                    <code style={{ background: "#d1fae5", color: "#065f46", padding: "2px 10px", borderRadius: 6, fontWeight: 800, fontSize: "0.9rem", letterSpacing: 1 }}>
                      {o.code}
                    </code>
                    <span style={{ fontSize: "0.83rem", color: "#374151" }}>{o.desc}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Inclusions / Exclusions */}
            <section style={{ marginBottom: 36 }}>
              <h3 style={{ fontWeight: 800, color: "#1e293b", marginBottom: 16, fontSize: "1.1rem" }}>✅ What's Included / ❌ What's Not</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ background: "#f0fdf4", borderRadius: 14, padding: "18px 20px", border: "1px solid #bbf7d0" }}>
                  <h4 style={{ fontWeight: 700, color: "#065f46", marginBottom: 12, fontSize: "0.9rem" }}>✅ Included</h4>
                  {camp.included.map((item) => (
                    <div key={item} style={{ display: "flex", gap: 8, marginBottom: 7, fontSize: "0.84rem", color: "#374151" }}>
                      <span style={{ color: "#059669" }}>✓</span><span>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: "#fff5f5", borderRadius: 14, padding: "18px 20px", border: "1px solid #fecaca" }}>
                  <h4 style={{ fontWeight: 700, color: "#dc2626", marginBottom: 12, fontSize: "0.9rem" }}>❌ Not Included</h4>
                  {camp.notIncluded.map((item) => (
                    <div key={item} style={{ display: "flex", gap: 8, marginBottom: 7, fontSize: "0.84rem", color: "#374151" }}>
                      <span style={{ color: "#dc2626" }}>✗</span><span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Things to Carry */}
            <section style={{ marginBottom: 36 }}>
              <h3 style={{ fontWeight: 800, color: "#1e293b", marginBottom: 16, fontSize: "1.1rem" }}>🎒 Things to Carry</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {camp.thingsToCarry.map((item) => (
                  <span key={item} style={{ background: "#f1f5f9", color: "#374151", borderRadius: 8, padding: "5px 12px", fontSize: "0.82rem", fontWeight: 500 }}>
                    {item}
                  </span>
                ))}
              </div>
            </section>

            {/* Water Sports */}
            <section style={{ marginBottom: 36, background: "#eff6ff", borderRadius: 16, padding: "24px 28px", border: "1px solid #bfdbfe" }}>
              <h3 style={{ fontWeight: 800, color: "#1d4ed8", marginBottom: 12, fontSize: "1.1rem" }}>🌊 Water Sports in Alibaug</h3>
              <p style={{ fontSize: "0.88rem", color: "#374151", lineHeight: 1.75, marginBottom: 14 }}>
                Guests can enjoy watersports on Sunday at the beach. Many options are available — from the exhilarating jet-skiing to thrilling parasailing at Nagaon Beach, giving you a 360-degree view of the coastal town.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {camp.waterSports.map((ws) => (
                  <span key={ws} style={{ background: "#dbeafe", color: "#1d4ed8", borderRadius: 8, padding: "5px 12px", fontSize: "0.82rem", fontWeight: 600 }}>
                    🌊 {ws}
                  </span>
                ))}
              </div>
            </section>

            {/* Ferry Schedule */}
            <section style={{ marginBottom: 36 }}>
              <h3 style={{ fontWeight: 800, color: "#1e293b", marginBottom: 16, fontSize: "1.1rem" }}>⛴ Ferry Service — Gateway of India to Alibaug (2025)</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {camp.ferrySchedule.map((f) => (
                  <div key={f.operator} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "16px 20px" }}>
                    <div style={{ fontWeight: 700, color: "#065f46", marginBottom: 8 }}>{f.operator}</div>
                    <div style={{ fontSize: "0.83rem", color: "#374151", marginBottom: 4 }}>
                      <span style={{ fontWeight: 600 }}>From Mumbai: </span>{f.from}
                    </div>
                    <div style={{ fontSize: "0.83rem", color: "#374151", marginBottom: 6 }}>
                      <span style={{ fontWeight: 600 }}>From Mandwa: </span>{f.return}
                    </div>
                    <span style={{ background: "#d1fae5", color: "#065f46", borderRadius: 6, padding: "2px 10px", fontSize: "0.78rem", fontWeight: 700 }}>
                      {f.fare}
                    </span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: 10 }}>
                * Schedules and fares are subject to change. Always check with the ferry operator before travel.
              </p>
            </section>

            {/* Nearby Camps */}
            <section style={{ marginBottom: 36 }}>
              <h3 style={{ fontWeight: 800, color: "#1e293b", marginBottom: 12, fontSize: "1.1rem" }}>⛺ Top 10 Camping Spots Near Mumbai</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {camp.nearbyPlaces.map((place, i) => (
                  <span key={place} style={{ background: "#f1f5f9", color: "#374151", borderRadius: 8, padding: "5px 14px", fontSize: "0.82rem", fontWeight: 500 }}>
                    {i + 1}. {place}
                  </span>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section style={{ marginBottom: 36 }}>
              <h3 style={{ fontWeight: 800, color: "#1e293b", marginBottom: 16, fontSize: "1.1rem" }}>❓ Frequently Asked Questions</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {camp.faqs.map((faq, i) => (
                  <div key={i} style={{ border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      style={{
                        width: "100%", textAlign: "left", padding: "14px 18px",
                        background: openFaq === i ? "#f0fdf4" : "#fff",
                        border: "none", cursor: "pointer", display: "flex",
                        justifyContent: "space-between", alignItems: "center",
                        fontWeight: 600, fontSize: "0.88rem", color: openFaq === i ? "#065f46" : "#1e293b",
                      }}
                    >
                      {faq.q}
                      <span style={{ fontSize: "1.1rem", flexShrink: 0, marginLeft: 8 }}>{openFaq === i ? "−" : "+"}</span>
                    </button>
                    {openFaq === i && (
                      <div style={{ padding: "12px 18px 16px", background: "#f0fdf4", fontSize: "0.87rem", color: "#374151", lineHeight: 1.75, borderTop: "1px solid #bbf7d0" }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Cancellation */}
            <section style={{ marginBottom: 36, background: "#fff5f5", borderRadius: 16, padding: "24px 28px", border: "1px solid #fecaca" }}>
              <h3 style={{ fontWeight: 800, color: "#dc2626", marginBottom: 14, fontSize: "1.1rem" }}>⚠️ Cancellation Policy</h3>
              <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
                {camp.cancellation.map((item, i) => (
                  <li key={i} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: "0.86rem", color: "#374151" }}>
                    <span style={{ color: "#dc2626", flexShrink: 0 }}>•</span><span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Rules */}
            <section style={{ marginBottom: 36, background: "#f8fafc", borderRadius: 16, padding: "24px 28px", border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontWeight: 800, color: "#1e293b", marginBottom: 14, fontSize: "1.1rem" }}>📋 Rules & Regulations</h3>
              <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
                {camp.rules.map((rule, i) => (
                  <li key={i} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: "0.86rem", color: "#374151", lineHeight: 1.6 }}>
                    <span style={{ color: "#059669", fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span><span>{rule}</span>
                  </li>
                ))}
              </ul>
            </section>

          </div>

          {/* ── RIGHT COLUMN — BOOKING CARD ── */}
          <div style={{ position: "sticky", top: 80 }}>
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20, padding: "24px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>

              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: "0.82rem", color: "#6b7280" }}>Starting From</div>
                <div>
                  <span style={{ fontSize: "2rem", fontWeight: 900, color: "#059669" }}>₹{camp.price}</span>
                  <span style={{ fontSize: "0.8rem", color: "#9ca3af", textDecoration: "line-through", marginLeft: 8 }}>₹{camp.originalPrice}</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>per person · {camp.duration?.toLowerCase() || "overnight"}</div>
              </div>

              {bookingDone ? (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>✅</div>
                  <h5 style={{ fontWeight: 700, color: "#065f46", marginBottom: 8 }}>Booking Confirmed!</h5>
                  <p style={{ fontSize: "0.85rem", color: "#374151", marginBottom: 16 }}>
                    We'll reach you on WhatsApp within 30 minutes.
                  </p>
                  <a href="https://wa.me/919856112727" target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#25d366", color: "#fff", padding: "9px 20px", borderRadius: 8, fontWeight: 700, fontSize: "0.85rem", textDecoration: "none" }}>
                    Chat on WhatsApp →
                  </a>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); if (id !== "preview") setBookingDone(true); }}>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Select Date</label>
                    <select className="form-select form-select-sm" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} required>
                      <option value="">— Choose a date —</option>
                      {camp.nextDates.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Number of Guests</label>
                    <select className="form-select form-select-sm" value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
                      {[1,2,3,4,5,6,7,8,9,10].map((n) => <option key={n} value={n}>{n} person{n > 1 ? "s" : ""}</option>)}
                    </select>
                  </div>
                  <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "12px 14px", marginBottom: 14, border: "1px solid #bbf7d0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: "0.83rem", color: "#6b7280" }}>
                      <span>₹{camp.adultPrice} × {guests} person{guests > 1 ? "s" : ""}</span>
                      <span>₹{(camp.adultPrice * guests).toLocaleString()}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #d1fae5", paddingTop: 8, fontWeight: 700, fontSize: "0.88rem", color: "#065f46" }}>
                      <span>Total</span>
                      <span>₹{(camp.adultPrice * guests).toLocaleString()}</span>
                    </div>
                  </div>
                  <button type="submit" style={{ width: "100%", background: "#059669", color: "#fff", border: "none", borderRadius: 10, padding: "13px", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", marginBottom: 10 }}>
                    {id === "preview" ? "Preview Mode" : "Book Now"}
                  </button>
                  <a href="https://wa.me/919856112727" target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "#f0fdf4", color: "#065f46", border: "1px solid #bbf7d0", borderRadius: 10, padding: "11px", fontWeight: 600, fontSize: "0.88rem", textDecoration: "none" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Enquire on WhatsApp
                  </a>
                </form>
              )}

              {/* Offers strip */}
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: 8 }}>Available Offers:</div>
                {camp.offers.map((o) => (
                  <div key={o.code} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                    <code style={{ background: "#d1fae5", color: "#065f46", padding: "1px 8px", borderRadius: 4, fontWeight: 700, fontSize: "0.78rem" }}>{o.code}</code>
                    <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>{o.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .container > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="position: sticky"] {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
}
