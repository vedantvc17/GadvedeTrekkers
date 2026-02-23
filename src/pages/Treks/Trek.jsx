import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

function Trek() {
  const location = useLocation();
  const selectedRegion = location.state?.region || null;

  const trekData = {
    mumbai: [
      {
        name: "Harihar Trek",
        location: "Nashik, Maharashtra",
        difficulty: "Medium",
        duration: "1 Day",
        altitude: "1120m",
        price: 999,
        originalPrice: 1499,
        nextDate: "22 Sept 2025",
        rating: 4.8,
        reviews: 132,
        image: "https://static.toiimg.com/thumb/msid-122145020%2Cwidth-1280%2Cheight-720%2Cresizemode-4/122145020.jpg",
      },
      {
        name: "Harishchandragad Trek",
        location: "Ahmednagar, Maharashtra",
        difficulty: "Medium",
        duration: "2 Days",
        altitude: "1424m",
        price: 1299,
        originalPrice: 1799,
        nextDate: "28 Sept 2025",
        rating: 4.9,
        reviews: 210,
        image: "https://images.openai.com/static-rsc-3/FhvkmQLmul7n4BK66eQcwU08W01U447486fmFPs0B2AYCfDCgo-tXqZf-aikC91nW-tmqCF3w5X0PDznr_wckh1uCKEsdw_SARE3Ah6f_OQ?purpose=fullsize&v=1",
      },
      {
        name: "Ratangad Trek",
        location: "Bhandardara",
        difficulty: "Medium",
        duration: "1 Day",
        altitude: "1297m",
        price: 999,
        originalPrice: 1399,
        nextDate: "20 Sept 2025",
        rating: 4.7,
        reviews: 98,
        image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff",
      },
      {
        name: "Kalsubai Trek",
        location: "Bari Village",
        difficulty: "Medium",
        duration: "1 Day",
        altitude: "1646m",
        price: 1099,
        originalPrice: 1599,
        nextDate: "25 Sept 2025",
        rating: 4.9,
        reviews: 340,
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5",
      },
      {
        name: "Sandhan Valley Trek",
        location: "Bhandardara",
        difficulty: "Hard",
        duration: "2 Days",
        altitude: "1300m",
        price: 1499,
        originalPrice: 1999,
        nextDate: "30 Sept 2025",
        rating: 4.8,
        reviews: 150,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      },
      {
        name: "Rajmachi Trek",
        location: "Lonavala",
        difficulty: "Easy",
        duration: "1 Day",
        altitude: "820m",
        price: 799,
        originalPrice: 1199,
        nextDate: "21 Sept 2025",
        rating: 4.6,
        reviews: 185,
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      },
      {
        name: "Kalu Waterfall Trek",
        location: "Malshej",
        difficulty: "Medium",
        duration: "1 Day",
        altitude: "1200m",
        price: 999,
        originalPrice: 1399,
        nextDate: "19 Sept 2025",
        rating: 4.5,
        reviews: 75,
        image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff",
      },
      {
        name: "Rajmachi Fireflies Trek",
        location: "Lonavala",
        difficulty: "Easy",
        duration: "1 Night",
        altitude: "820m",
        price: 1299,
        originalPrice: 1699,
        nextDate: "15 June 2025",
        rating: 4.9,
        reviews: 420,
        image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
      },
      {
        name: "Devkund Waterfall Trek",
        location: "Raigad",
        difficulty: "Easy",
        duration: "1 Day",
        altitude: "600m",
        price: 899,
        originalPrice: 1299,
        nextDate: "18 Sept 2025",
        rating: 4.7,
        reviews: 210,
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5",
      },
      {
        name: "Andharban Jungle Trek",
        location: "Tamhini",
        difficulty: "Medium",
        duration: "1 Day",
        altitude: "700m",
        price: 999,
        originalPrice: 1499,
        nextDate: "24 Sept 2025",
        rating: 4.6,
        reviews: 142,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      },
      {
        name: "Bhandardara Fireflies Camping",
        location: "Bhandardara",
        difficulty: "Easy",
        duration: "1 Night",
        altitude: "750m",
        price: 1499,
        originalPrice: 1999,
        nextDate: "10 June 2025",
        rating: 4.9,
        reviews: 300,
        image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff",
      },
      {
        name: "Aadrai Jungle Trek",
        location: "Malshej",
        difficulty: "Medium",
        duration: "1 Day",
        altitude: "900m",
        price: 1099,
        originalPrice: 1599,
        nextDate: "26 Sept 2025",
        rating: 4.8,
        reviews: 115,
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      },
    ],

    pune: [
      {
        name: "Harishchandragad Trek",
        location: "Pune, Maharashtra",
        difficulty: "Medium",
        duration: "2 Days",
        altitude: "1424m",
        price: 1199,
        originalPrice: 1699,
        nextDate: "29 Sept 2025",
        rating: 4.8,
        reviews: 190,
        image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
      },
      {
        name: "Rajmachi Trek",
        location: "Lonavala, Maharashtra",
        difficulty: "Easy",
        duration: "1 Day",
        altitude: "820m",
        price: 799,
        originalPrice: 1199,
        nextDate: "21 Sept 2025",
        rating: 4.6,
        reviews: 175,
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      },
      {
        name: "Kalsubai Trek",
        location: "Bari Village",
        difficulty: "Medium",
        duration: "1 Day",
        altitude: "1646m",
        price: 1099,
        originalPrice: 1599,
        nextDate: "25 Sept 2025",
        rating: 4.9,
        reviews: 330,
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5",
      },
      {
        name: "Rajmachi Fireflies Trek",
        location: "Lonavala",
        difficulty: "Easy",
        duration: "1 Night",
        altitude: "820m",
        price: 1299,
        originalPrice: 1699,
        nextDate: "15 June 2025",
        rating: 4.9,
        reviews: 410,
        image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
      },
      {
        name: "Ratangad Trek",
        location: "Bhandardara",
        difficulty: "Medium",
        duration: "1 Day",
        altitude: "1297m",
        price: 999,
        originalPrice: 1399,
        nextDate: "20 Sept 2025",
        rating: 4.7,
        reviews: 90,
        image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff",
      },
      {
        name: "Kalu Waterfall Trek",
        location: "Malshej",
        difficulty: "Medium",
        duration: "1 Day",
        altitude: "1200m",
        price: 999,
        originalPrice: 1399,
        nextDate: "19 Sept 2025",
        rating: 4.5,
        reviews: 70,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      },
      {
        name: "Bhandardara Fireflies Camping",
        location: "Bhandardara",
        difficulty: "Easy",
        duration: "1 Night",
        altitude: "750m",
        price: 1499,
        originalPrice: 1999,
        nextDate: "10 June 2025",
        rating: 4.9,
        reviews: 300,
        image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff",
      },
      {
        name: "Andharban Jungle Trek",
        location: "Tamhini",
        difficulty: "Medium",
        duration: "1 Day",
        altitude: "700m",
        price: 999,
        originalPrice: 1499,
        nextDate: "24 Sept 2025",
        rating: 4.6,
        reviews: 140,
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      },
      {
        name: "Aadrai Jungle Trek",
        location: "Malshej",
        difficulty: "Medium",
        duration: "1 Day",
        altitude: "900m",
        price: 1099,
        originalPrice: 1599,
        nextDate: "26 Sept 2025",
        rating: 4.8,
        reviews: 110,
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      },
      {
        name: "Devkund Waterfall",
        location: "Raigad",
        difficulty: "Easy",
        duration: "1 Day",
        altitude: "600m",
        price: 899,
        originalPrice: 1299,
        nextDate: "18 Sept 2025",
        rating: 4.7,
        reviews: 200,
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5",
      },
      {
        name: "Nanemachi Waterfall Trek",
        location: "Raigad",
        difficulty: "Easy",
        duration: "1 Day",
        altitude: "650m",
        price: 899,
        originalPrice: 1299,
        nextDate: "23 Sept 2025",
        rating: 4.6,
        reviews: 88,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      },
      {
        name: "Bhorgiri to Bhimashankar Trek",
        location: "Pune",
        difficulty: "Medium",
        duration: "1 Day",
        altitude: "1100m",
        price: 999,
        originalPrice: 1399,
        nextDate: "27 Sept 2025",
        rating: 4.7,
        reviews: 120,
        image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
      },
    ],

    himachal: [
      {
        name: "Sar Pass Trek",
        location: "Kasol",
        difficulty: "Medium",
        duration: "5 Days",
        altitude: "4220m",
        price: 6999,
        originalPrice: 8999,
        nextDate: "5 Oct 2025",
        rating: 4.8,
        reviews: 220,
        image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff",
      },
      {
        name: "Hampta Pass Trek",
        location: "Manali",
        difficulty: "Medium",
        duration: "5 Days",
        altitude: "4270m",
        price: 7499,
        originalPrice: 9999,
        nextDate: "12 Oct 2025",
        rating: 4.9,
        reviews: 310,
        image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
      },
      {
        name: "Hampta Pass with Chandratal",
        location: "Manali",
        difficulty: "Medium",
        duration: "6 Days",
        altitude: "4300m",
        price: 8499,
        originalPrice: 10999,
        nextDate: "20 Oct 2025",
        rating: 4.8,
        reviews: 180,
        image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff",
      },
      {
        name: "Bhrigu Lake Trek",
        location: "Manali",
        difficulty: "Medium",
        duration: "4 Days",
        altitude: "4300m",
        price: 6999,
        originalPrice: 8999,
        nextDate: "10 Oct 2025",
        rating: 4.7,
        reviews: 150,
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      },
      {
        name: "Beas Kund Trek",
        location: "Manali",
        difficulty: "Easy",
        duration: "3 Days",
        altitude: "3700m",
        price: 5999,
        originalPrice: 7999,
        nextDate: "8 Oct 2025",
        rating: 4.6,
        reviews: 100,
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5",
      },
      {
        name: "Kheerganga Trek",
        location: "Kasol",
        difficulty: "Easy",
        duration: "2 Days",
        altitude: "2950m",
        price: 3999,
        originalPrice: 4999,
        nextDate: "6 Oct 2025",
        rating: 4.5,
        reviews: 95,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      },
      {
        name: "Triund Trek",
        location: "Dharamshala",
        difficulty: "Easy",
        duration: "2 Days",
        altitude: "2850m",
        price: 3499,
        originalPrice: 4499,
        nextDate: "14 Oct 2025",
        rating: 4.7,
        reviews: 140,
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      },
      {
        name: "Kareri Lake Trek",
        location: "Dharamshala",
        difficulty: "Medium",
        duration: "3 Days",
        altitude: "2934m",
        price: 5999,
        originalPrice: 7499,
        nextDate: "16 Oct 2025",
        rating: 4.6,
        reviews: 85,
        image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff",
      },
    ],

    uttarakhand: [
      {
        name: "Valley of Flowers Trek",
        location: "Chamoli, Uttarakhand",
        difficulty: "Easy",
        duration: "4 Days",
        altitude: "3658m",
        price: 7499,
        originalPrice: 9499,
        nextDate: "18 Oct 2025",
        rating: 4.9,
        reviews: 280,
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5",
      },
      {
        name: "Kedarkantha Trek",
        location: "Sankri, Uttarakhand",
        difficulty: "Easy",
        duration: "5 Days",
        altitude: "3810m",
        price: 6999,
        originalPrice: 8999,
        nextDate: "12 Dec 2025",
        rating: 4.8,
        reviews: 350,
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      },
      {
        name: "Brahmatal Trek",
        location: "Lohajung, Uttarakhand",
        difficulty: "Medium",
        duration: "6 Days",
        altitude: "3735m",
        price: 7999,
        originalPrice: 9999,
        nextDate: "15 Jan 2026",
        rating: 4.7,
        reviews: 210,
        image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff",
      },
      {
        name: "Ali Bedni Bugyal Trek",
        location: "Chamoli, Uttarakhand",
        difficulty: "Medium",
        duration: "6 Days",
        altitude: "3350m",
        price: 8499,
        originalPrice: 10499,
        nextDate: "22 Oct 2025",
        rating: 4.8,
        reviews: 165,
        image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
      },
      {
        name: "Dayara Bugyal Trek",
        location: "Uttarkashi, Uttarakhand",
        difficulty: "Easy",
        duration: "4 Days",
        altitude: "3639m",
        price: 6999,
        originalPrice: 8999,
        nextDate: "5 Nov 2025",
        rating: 4.7,
        reviews: 190,
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5",
      },
      {
        name: "Kuari Pass Trek",
        location: "Joshimath, Uttarakhand",
        difficulty: "Medium",
        duration: "6 Days",
        altitude: "4264m",
        price: 8999,
        originalPrice: 10999,
        nextDate: "10 Nov 2025",
        rating: 4.8,
        reviews: 240,
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      },
      {
        name: "Kedarnath Trek",
        location: "Rudraprayag, Uttarakhand",
        difficulty: "Easy",
        duration: "3 Days",
        altitude: "3584m",
        price: 5999,
        originalPrice: 7499,
        nextDate: "3 Oct 2025",
        rating: 4.9,
        reviews: 500,
        image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff",
      },
      {
        name: "Tungnath Trek",
        location: "Chopta, Uttarakhand",
        difficulty: "Easy",
        duration: "2 Days",
        altitude: "3680m",
        price: 4999,
        originalPrice: 6499,
        nextDate: "8 Oct 2025",
        rating: 4.8,
        reviews: 260,
        image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
      },
    ],

    kashmir: [
      {
        name: "Kashmir Great Lakes Trek",
        location: "Srinagar, Kashmir",
        difficulty: "Hard",
        duration: "7 Days",
        altitude: "4200m",
        price: 9999,
        originalPrice: 12999,
        nextDate: "25 Oct 2025",
        rating: 4.9,
        reviews: 450,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      },
      {
        name: "Tarsar Marsar Trek",
        location: "Anantnag, Kashmir",
        difficulty: "Medium",
        duration: "7 Days",
        altitude: "4100m",
        price: 9499,
        originalPrice: 11999,
        nextDate: "30 Oct 2025",
        rating: 4.8,
        reviews: 210,
        image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff",
      },
      {
        name: "Nanemachi Waterfall Trek",
        location: "Pahalgam, Kashmir",
        difficulty: "Easy",
        duration: "1 Day",
        altitude: "800m",
        price: 1999,
        originalPrice: 2499,
        nextDate: "12 Oct 2025",
        rating: 4.6,
        reviews: 95,
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      },
    ],
  };

  const regions = Object.keys(trekData);

  const regionRefs = {
    mumbai: useRef(null),
    pune: useRef(null),
    himachal: useRef(null),
    uttarakhand: useRef(null),
    kashmir: useRef(null),
  };

  useEffect(() => {
    if (selectedRegion && regionRefs[selectedRegion]) {
      regionRefs[selectedRegion].current?.scrollIntoView({
        behavior: "smooth",
      });

      // 🔥 Clear state after scroll so it doesn’t persist
      window.history.replaceState({}, document.title);
    } else {
      // 🔥 If no region selected, always scroll to top
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [selectedRegion]);

  return (
    <div className="container py-5">
      <h2 className="fw-bold text-center mb-5 text-success">
        Explore Treks by Region
      </h2>

      {regions.map((region) => (
        <div key={region} ref={regionRefs[region]} className="mb-5">
          <h4 className="fw-bold mb-4 text-success text-capitalize">
            {region} Treks
          </h4>

          <div className="row g-4">
            {trekData[region].map((trek, index) => (
              <div className="col-md-4" key={index}>
                <div className="card shadow-lg border-0 rounded-4 overflow-hidden h-100">

                  {/* Image */}
                  <img
                    src={trek.image}
                    alt={trek.name}
                    style={{ height: "220px", objectFit: "cover" }}
                  />

                  <div className="card-body">

                    {/* Title */}
                    <h5 className="fw-bold">{trek.name}</h5>

                    {/* Location */}
                    <p className="text-muted small mb-2">
                      📍 {trek.location}
                    </p>

                    {/* Badges */}
                    <div className="d-flex gap-2 mb-3">
                      <span
                        className={`badge ${
                          trek.difficulty === "Easy"
                            ? "bg-success"
                            : trek.difficulty === "Medium"
                            ? "bg-warning text-dark"
                            : "bg-danger"
                        }`}
                      >
                        {trek.difficulty}
                      </span>

                      <span className="badge bg-light text-dark border">
                        ⏱ {trek.duration}
                      </span>

                      <span className="badge bg-light text-dark border">
                        🏔 {trek.altitude}
                      </span>
                    </div>

                    {/* Pricing */}
                    <div className="mb-2">
                      <span className="text-muted text-decoration-line-through me-2">
                        ₹{trek.originalPrice}
                      </span>
                      <span className="fw-bold fs-5">
                        ₹{trek.price}
                      </span>
                      <div className="small text-muted">
                        Starting from
                      </div>
                    </div>

                    {/* Next Date */}
                    <div className="small mb-3">
                      📅 <strong>Next:</strong> {trek.nextDate}
                    </div>

                    {/* Buttons */}
                    <div className="d-flex gap-2">
                      <button className="btn btn-success w-50">
                        Book Now
                      </button>

                      <Link
                        to={`/treks/${trek.name
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")}`}
                        className="btn btn-outline-success w-50"
                      >
                        View Details
                      </Link>
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

export default Trek;