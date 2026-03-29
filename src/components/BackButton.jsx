import { useNavigate, useLocation } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (pathname === "/") {
    return null;
  }

  return (
    <div className="site-backbar">
      <div className="container">
        <button
          type="button"
          className="site-back-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

export default BackButton;
