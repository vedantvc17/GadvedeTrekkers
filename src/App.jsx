import { useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const { pathname } = useLocation();
  const isAdmin  = pathname.startsWith("/admin");
  const isTicket = pathname === "/ticket";

  return (
    <div className="d-flex flex-column min-vh-100">
      {!isAdmin && !isTicket && <Header />}
      <main className="flex-fill">
        <AppRoutes />
      </main>
      {!isAdmin && !isTicket && <Footer />}
    </div>
  );
}

export default App;
