import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";

/* ================= TREK PAGES ================= */
import Trek from "../pages/Treks/Trek";
import TrekDetails from "../pages/Treks/TrekDetails";

/* ================= TOUR PAGES ================= */
import Tours from "../pages/Tours/Tours";
import TourDetails from "../pages/Tours/TourDetails";

/* ================= HERITAGE PAGES ================= */
import Heritage from "../pages/HeritageWalk/Heritage";
import HeritageDetails from "../pages/HeritageWalk/HeritageDetails";

/* ================= RENTAL PAGES ================= */
import Rental from "../pages/Rentals/Rental";
import RentalDetails from "../pages/Rentals/RentalDetails";

function AppRoutes() {
  return (
    <Routes>
      {/* ================= MAIN PAGES ================= */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* ================= TREKS ================= */}
      <Route path="/treks" element={<Trek />} />
      <Route path="/treks/:id" element={<TrekDetails />} />

      {/* ================= TOURS ================= */}
      <Route path="/tours" element={<Tours />} />
      <Route path="/tours/:id" element={<TourDetails />} />

      {/* ================= HERITAGE ================= */}
      <Route path="/heritage" element={<Heritage />} />
      <Route path="/heritage/:id" element={<HeritageDetails />} />

      {/* ================= RENTALS ================= */}
      <Route path="/rentals" element={<Rental />} />
      <Route path="/rentals/:id" element={<RentalDetails />} />
      
      {/* ================= OTHER SERVICES ================= */}
      <Route
        path="/corporate"
        element={
          <h1 className="text-center mt-5">
            School & Corporate Tours
          </h1>
        }
      />
    </Routes>
  );
}

export default AppRoutes;