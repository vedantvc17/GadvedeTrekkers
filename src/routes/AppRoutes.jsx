import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";

/* Trek Pages */
import Treks from "../pages/Treks/Treks";
import MumbaiTreks from "../pages/Treks/MumbaiTreks";
import PuneTreks from "../pages/Treks/PuneTreks";
import HimachalTreks from "../pages/Treks/HimachalTreks";
import UttarakhandTreks from "../pages/Treks/UttarakhandTreks";
import KashmirTreks from "../pages/Treks/KashmirTreks";
import TrekDetails from "../pages/Treks/TrekDetails";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* ================= TREKS ================= */}
      <Route path="/treks" element={<Treks />} />
      <Route path="/treks/mumbai" element={<MumbaiTreks />} />
      <Route path="/treks/pune" element={<PuneTreks />} />
      <Route path="/treks/himachal" element={<HimachalTreks />} />
      <Route path="/treks/uttarakhand" element={<UttarakhandTreks />} />
      <Route path="/treks/kashmir" element={<KashmirTreks />} />

      {/* Dynamic Individual Trek Page */}
      <Route path="/treks/:trekName" element={<TrekDetails />} />

      {/* ================= OTHER MAIN PAGES ================= */}
      <Route
        path="/tours"
        element={<h1 className="text-center mt-5">All Tours</h1>}
      />
      <Route
        path="/rentals"
        element={<h1 className="text-center mt-5">Adventure Rentals</h1>}
      />
      <Route
        path="/corporate"
        element={<h1 className="text-center mt-5">School & Corporate Tours</h1>}
      />
    </Routes>
  );
}

export default AppRoutes;
