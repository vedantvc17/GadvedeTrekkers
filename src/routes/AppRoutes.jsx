import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";

/* ================= TREK PAGES ================= */
import Trek from "../pages/Treks/Trek";
import TrekDetails from "../pages/Treks/TrekDetails";

/* ================= TOUR PAGES ================= */
import Tours from "../pages/Tours/Tours";
import HimachalTours from "../pages/Tours/HimachalTours";
import UttarakhandTours from "../pages/Tours/UttarakhandTours";
import RajasthanTours from "../pages/Tours/RajasthanTours";
import NorthEastTours from "../pages/Tours/NorthEastTours";
import KashmirTours from "../pages/Tours/KashmirTours";
import SouthIndiaTours from "../pages/Tours/SouthIndiaTours";
import TourDetails from "../pages/Tours/TourDetails";

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
      <Route path="/tours/himachal" element={<HimachalTours />} />
      <Route path="/tours/uttarakhand" element={<UttarakhandTours />} />
      <Route path="/tours/rajasthan" element={<RajasthanTours />} />
      <Route path="/tours/northeast" element={<NorthEastTours />} />
      <Route path="/tours/kashmir" element={<KashmirTours />} />
      <Route path="/tours/southindia" element={<SouthIndiaTours />} />

      {/* Dynamic Tour Details */}
      <Route path="/tours/:category/:tourName" element={<TourDetails />} />

      {/* ================= OTHER SERVICES ================= */}
      <Route
        path="/rentals"
        element={<h1 className="text-center mt-5">Adventure Rentals</h1>}
      />
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