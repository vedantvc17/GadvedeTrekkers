import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { getAdminItems, normaliseItem } from "../../data/adminStorage";

function Rental() {
  const location = useLocation();
  const selectedCategory = location.state?.category || null;

  const rentalData = {
    Tents: [
      {
        name: "2 Person Camping Tent",
        location: "Pune",
        price: 299,
        originalPrice: 499,
        rating: 4.7,
        reviews: 120,
        image: "/images/rentals/tent.jpg",
      },
      {
        name: "4 Person Dome Tent",
        location: "Mumbai",
        price: 499,
        originalPrice: 799,
        rating: 4.8,
        reviews: 95,
        image: "/images/rentals/tent.jpg",
      },
    ],

    Gear: [
      {
        name: "Sleeping Bag",
        location: "Pune",
        price: 149,
        originalPrice: 299,
        rating: 4.6,
        reviews: 80,
        image: "/images/rentals/sleepingbag.jpg",
      },
      {
        name: "Trekking Shoes",
        location: "Mumbai",
        price: 199,
        originalPrice: 399,
        rating: 4.7,
        reviews: 140,
        image: "/images/rentals/shoes.jpg",
      },
      {
        name: "Rucksack (60L)",
        location: "Pune",
        price: 249,
        originalPrice: 399,
        rating: 4.8,
        reviews: 110,
        image: "/images/rentals/bag.jpg",
      },
    ],

    Villas: [
      {
        name: "Luxury Villa Lonavala",
        location: "Lonavala",
        price: 5999,
        originalPrice: 7999,
        rating: 4.9,
        reviews: 210,
        image: "/images/rentals/villa.jpg",
      },
      {
        name: "Pool Villa Alibaug",
        location: "Alibaug",
        price: 6999,
        originalPrice: 8999,
        rating: 4.8,
        reviews: 180,
        image: "/images/rentals/villa.jpg",
      },
    ],
  };

  /* Merge admin-created rentals */
  getAdminItems("gt_rentals").filter((r) => r.active !== false).forEach((r) => {
    const item = normaliseItem(r);
    const cat = item.category || "Tents";
    if (!rentalData[cat]) rentalData[cat] = [];
    rentalData[cat].push(item);
  });

  const categories = Object.keys(rentalData);

  const categoryRefs = {
    Tents: useRef(null),
    Gear: useRef(null),
    Villas: useRef(null),
  };

  useEffect(() => {
    if (selectedCategory && categoryRefs[selectedCategory]) {
      categoryRefs[selectedCategory].current?.scrollIntoView({
        behavior: "smooth",
      });
      window.history.replaceState({}, document.title);
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [selectedCategory]);

  return (
    <div className="container py-5">
      <h2 className="fw-bold text-center mb-5 text-success">
        Adventure Rentals & Essentials
      </h2>

      {categories.map((category) => (
        <div key={category} ref={categoryRefs[category]} className="mb-5">

          <h4 className="fw-bold mb-4 text-success">
            {category === "Tents"
              ? "Tents on Rent"
              : category === "Gear"
              ? "Trekking Gear"
              : "Villas on Rent"}
          </h4>

          <div className="row g-4">
            {rentalData[category].map((item, index) => (
              <div className="col-md-4" key={index}>

                <div className="card shadow-lg border-0 rounded-4 overflow-hidden h-100">

                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ height: "220px", objectFit: "cover" }}
                  />

                  <div className="card-body">

                    {/* Title */}
                    <h5 className="fw-bold">{item.name}</h5>

                    {/* Location */}
                    <p className="text-muted small mb-2">
                      📍 {item.location}
                    </p>

                    {/* Rating */}
                    <div className="mb-2">
                      ⭐ {item.rating} ({item.reviews} reviews)
                    </div>

                    {/* Pricing */}
                    <div className="mb-3">
                      <span className="text-muted text-decoration-line-through me-2">
                        ₹{item.originalPrice}
                      </span>
                      <span className="fw-bold fs-5">
                        ₹{item.price}
                      </span>
                      <div className="small text-muted">
                        per day / night
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="d-flex gap-2">
                      <button className="btn btn-success w-50">
                        Book Now
                      </button>

                      <Link
                        to={`/rentals/${item.name
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")}`}
                        state={{ item }}
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

export default Rental;