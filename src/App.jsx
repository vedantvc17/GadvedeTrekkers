import { useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import WebsiteNotificationBridge from "./components/WebsiteNotificationBridge";
import { ToastProvider } from "./components/Toast";
import { ConfirmProvider } from "./components/ConfirmModal";

function AppInner() {
  const { pathname } = useLocation();
  const isAdmin    = pathname.startsWith("/admin");
  const isTicket   = pathname === "/ticket";
  const isEmployee = pathname.startsWith("/employee");

  const hideChrome = isAdmin || isTicket || isEmployee;

  return (
    <div className="d-flex flex-column min-vh-100">
      <WebsiteNotificationBridge />
      {!hideChrome && <Header />}
      <main className="flex-fill">
        <AppRoutes />
      </main>
      {!hideChrome && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <AppInner />
      </ConfirmProvider>
    </ToastProvider>
  );
}

export default App;
