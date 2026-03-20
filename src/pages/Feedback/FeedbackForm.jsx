import { useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { submitFeedback, getFeedbackSettings } from "../../data/feedbackStorage";

const STAR_LABELS = { 1: "Poor", 2: "Fair", 3: "Good", 4: "Great", 5: "Excellent" };

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="fb-star-row">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`fb-star ${n <= (hover || value) ? "fb-star--on" : ""}`}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          aria-label={`${n} star`}
        >★</button>
      ))}
      {(hover || value) > 0 && (
        <span className="fb-star-label">{STAR_LABELS[hover || value]}</span>
      )}
    </div>
  );
}

export default function FeedbackForm() {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  /* Accept data from URL params or router state */
  const bookingId   = searchParams.get("bookingId")   || location.state?.bookingId   || "";
  const trekName    = searchParams.get("trek")        || location.state?.trekName    || "";
  const customerName= searchParams.get("name")        || location.state?.customerName|| "";
  const customerId  = searchParams.get("customerId")  || location.state?.customerId  || "";

  const settings = getFeedbackSettings();

  const [rating,   setRating]   = useState(0);
  const [comments, setComments] = useState("");
  const [answers,  setAnswers]  = useState(settings.questions.map(() => ""));
  const [submitted, setSubmitted] = useState(false);
  const [error,    setError]    = useState("");

  if (!settings.enabled) {
    return (
      <section className="fb-page">
        <div className="container py-5 text-center">
          <div style={{ fontSize: 48 }}>🔒</div>
          <h2 className="mt-3">Feedback Unavailable</h2>
          <p className="text-muted">The feedback system is currently disabled. Please check back later.</p>
        </div>
      </section>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) { setError("Please select a rating before submitting."); return; }
    setError("");
    submitFeedback({ bookingId, customerId, customerName, trekName, rating, comments, answers });
    setSubmitted(true);
  };

  if (submitted) {
    const isPositive = rating >= 4;
    return (
      <section className="fb-page">
        <div className="container py-5">
          <div className="fb-result-card">
            <div className="fb-result-stars">
              {[1,2,3,4,5].map((n) => (
                <span key={n} className={`fb-result-star ${n <= rating ? "fb-result-star--on" : ""}`}>★</span>
              ))}
            </div>

            {isPositive ? (
              <>
                <h2 className="fb-result-title">Thank you, {customerName || "Explorer"}! 🎉</h2>
                <p className="fb-result-sub">
                  We're thrilled you had a great experience on <strong>{trekName || "your trek"}</strong>!
                  Your kind words mean the world to our team.
                </p>
                <p className="fb-result-sub">Help other adventurers discover Gadvede Trekkers by leaving a Google review:</p>
                <a
                  href={settings.googleReviewLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-warning fw-semibold px-4 mt-2"
                  style={{ borderRadius: 24 }}
                >
                  ⭐ Write a Google Review
                </a>
              </>
            ) : (
              <>
                <h2 className="fb-result-title">Thank you for your feedback.</h2>
                <p className="fb-result-sub">
                  We sincerely appreciate you taking the time to share your experience.
                </p>
                <div className="fb-improvement-msg">
                  We have noted your feedback and will work hard to improve our services.
                  Our team will review your comments and ensure a better experience for your next adventure.
                </div>
              </>
            )}

            <div className="mt-4">
              <a href="/" className="btn btn-outline-success btn-sm me-2">🏠 Home</a>
              <a href="/treks" className="btn btn-success btn-sm">🥾 Explore More Treks</a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="fb-page">
      <div className="container py-4 py-md-5">
        <div className="fb-hero mb-4">
          <span className="fb-kicker">Share Your Experience</span>
          <h1>How Was Your Trek?</h1>
          {trekName && <p>We'd love to hear about your <strong>{trekName}</strong> experience.</p>}
        </div>

        <div className="fb-form-card">
          <form onSubmit={handleSubmit}>

            {/* Overall Rating */}
            <div className="fb-section">
              <label className="fb-label">Overall Rating <span className="text-danger">*</span></label>
              <StarRating value={rating} onChange={setRating} />
              {error && <p className="text-danger mt-2" style={{ fontSize: 13 }}>{error}</p>}
            </div>

            {/* Service Questions */}
            {settings.questions.map((q, i) => (
              <div key={i} className="fb-section">
                <label className="fb-label">{q}</label>
                <div className="fb-options-row">
                  {["Excellent","Good","Average","Poor"].map((opt) => (
                    <label key={opt} className={`fb-option ${answers[i] === opt ? "fb-option--on" : ""}`}>
                      <input
                        type="radio"
                        name={`q_${i}`}
                        value={opt}
                        checked={answers[i] === opt}
                        onChange={() => setAnswers((a) => a.map((v, j) => j === i ? opt : v))}
                        style={{ display: "none" }}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {/* Comments */}
            <div className="fb-section">
              <label className="fb-label">Additional Comments</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Share anything else about your experience — what you loved, what could be better…"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-success px-5 py-2 fw-semibold" style={{ borderRadius: 24 }}>
              Submit Feedback →
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
