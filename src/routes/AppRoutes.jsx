import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* Main Pages */}
      <Route
        path="/treks"
        element={<h1 className="text-center mt-5">All Treks</h1>}
      />
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
