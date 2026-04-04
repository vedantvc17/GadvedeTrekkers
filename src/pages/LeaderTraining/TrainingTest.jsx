import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DEFAULT_TEST_QUESTIONS,
  getMaxTestScore,
  getTrainingQuestions,
} from "../../data/trainingData";
import { saveAttempt, getCertificationLabel } from "../../data/leaderStorage";
import { getTrainingUpdateEventName } from "../../data/trainingAdminStorage";

/* ─── Option button ──────────────────────────────────────────── */
function OptionBtn({ opt, selected, revealed, onClick }) {
  let bg = "#fff", border = "1.5px solid #e5e7eb", color = "#1f2937";

  if (revealed) {
    if (selected) {
      const isGood = opt.weight >= 3;
      bg = isGood ? "#f0fdf4" : "#fef2f2";
      border = `1.5px solid ${isGood ? "#16a34a" : "#dc2626"}`;
      color = isGood ? "#14532d" : "#dc2626";
    }
  } else if (selected) {
    bg = "#eff6ff"; border = "1.5px solid #3b82f6"; color = "#1d4ed8";
  }

  return (
    <button
      onClick={onClick}
      disabled={revealed}
      style={{
        width: "100%", background: bg, border, color,
        borderRadius: 10, padding: "0.75rem 1rem",
        textAlign: "left", cursor: revealed ? "default" : "pointer",
        fontSize: "0.92rem", lineHeight: 1.5, transition: "all 0.15s",
        marginBottom: "0.5rem", display: "block",
      }}
    >
      {opt.text}
    </button>
  );
}

/* ─── Question card ──────────────────────────────────────────── */
function QuestionCard({ question, qIndex, total, answer, onAnswer, onNext, isLast }) {
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (optIdx) => {
    if (revealed || answer !== null) return;
    onAnswer(qIndex, optIdx);
    setRevealed(true);
  };

  const chosen = answer !== null ? question.options[answer] : null;

  return (
    <div>
      {/* Progress */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span className="small text-muted">Question {qIndex + 1} of {total}</span>
        <span className="small text-muted">
          {Math.round(((qIndex) / total) * 100)}% done
        </span>
      </div>
      <div style={{ height: 5, background: "#e5e7eb", borderRadius: 3, marginBottom: "1.25rem" }}>
        <div
          style={{
            height: 5, borderRadius: 3, background: "#16a34a",
            width: `${Math.round((qIndex / total) * 100)}%`, transition: "width 0.3s",
          }}
        />
      </div>

      {/* Scenario tag */}
      {question.scenario && (
        <div
          className="small mb-2 px-2 py-1 rounded-2 fw-semibold"
          style={{ background: "#fffbeb", color: "#92400e", display: "inline-block" }}
        >
          📍 Scenario: {question.scenario}
        </div>
      )}

      {/* Question */}
      <h5 className="fw-bold mb-3" style={{ lineHeight: 1.5, fontSize: "1rem" }}>
        {question.question}
      </h5>

      {/* Options */}
      {question.options.map((opt, i) => (
        <OptionBtn
          key={i}
          opt={opt}
          selected={answer === i}
          revealed={revealed}
          onClick={() => handleSelect(i)}
        />
      ))}

      {/* Explanation */}
      {revealed && question.explanation && (
        <div
          style={{
            background: "#f0fdf4", borderRadius: 10, padding: "0.85rem 1rem",
            marginTop: "0.5rem", fontSize: "0.88rem", color: "#14532d",
            border: "1px solid #bbf7d0",
          }}
        >
          💡 {question.explanation}
        </div>
      )}

      {/* Next button */}
      {revealed && (
        <div className="d-flex justify-content-end mt-3">
          <button
            className="btn btn-success px-4"
            onClick={onNext}
            style={{ borderRadius: 8 }}
          >
            {isLast ? "See Results 🎓" : "Next Question →"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Results screen ─────────────────────────────────────────── */
function ResultScreen({ attempt }) {
  const cert = getCertificationLabel(attempt.percent);

  return (
    <div style={{ textAlign: "center", padding: "1rem 0" }}>
      <div style={{ fontSize: "4rem", marginBottom: "0.5rem" }}>{cert.badge}</div>
      <h3 className="fw-bold mb-1" style={{ color: cert.color }}>
        {cert.level}
      </h3>
      <div style={{ fontSize: "2.5rem", fontWeight: 800, color: cert.color, margin: "0.5rem 0" }}>
        {attempt.percent}%
      </div>
      <div className="text-muted mb-4">
        Score: {attempt.score} / {attempt.maxScore}
      </div>

      <div
        style={{
          background: cert.color + "12",
          border: `2px solid ${cert.color}30`,
          borderRadius: 14, padding: "1.25rem",
          maxWidth: 420, margin: "0 auto 2rem",
          textAlign: "left",
        }}
      >
        {attempt.percent >= 90 && (
          <p className="mb-0">
            🏆 <strong>Outstanding!</strong> You have demonstrated expert-level leadership knowledge.
            You are certified to lead Gadvede treks independently.
          </p>
        )}
        {attempt.percent >= 70 && attempt.percent < 90 && (
          <p className="mb-0">
            ✅ <strong>Well done!</strong> You have passed the certification. You are approved to lead
            treks with standard supervision.
          </p>
        )}
        {attempt.percent < 70 && (
          <p className="mb-0">
            🔄 <strong>More practice needed.</strong> Review the training modules and retake the test
            to improve your score. A minimum of 70% is required for approval.
          </p>
        )}
      </div>

      <div className="d-flex gap-3 justify-content-center flex-wrap">
        <Link
          to="/leader-training/certification"
          className="btn btn-lg"
          style={{
            background: cert.color, color: "#fff",
            borderRadius: 10, fontWeight: 700, padding: "0.75rem 2rem",
          }}
        >
          View Certificate →
        </Link>
        <Link
          to="/leader-training"
          className="btn btn-lg btn-outline-secondary"
          style={{ borderRadius: 10, padding: "0.75rem 2rem" }}
        >
          Back to Training
        </Link>
      </div>

      {attempt.percent < 70 && (
        <div className="mt-3">
          <Link to="/leader-training/test" className="btn btn-outline-danger">
            🔄 Retake Test
          </Link>
        </div>
      )}
    </div>
  );
}

/* ─── Main Test Page ─────────────────────────────────────────── */
export default function TrainingTest() {
  const navigate = useNavigate();
  const topRef = useRef(null);

  const [questions, setQuestions] = useState(DEFAULT_TEST_QUESTIONS);
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({}); // { qIndex: optionIndex }
  const [attempt, setAttempt] = useState(null);

  const total = questions.length;

  useEffect(() => {
    const syncTrainingState = () => setQuestions(getTrainingQuestions());
    syncTrainingState();
    window.scrollTo({ top: 0, behavior: "auto" });
    const updateEvent = getTrainingUpdateEventName();
    window.addEventListener(updateEvent, syncTrainingState);
    return () => window.removeEventListener(updateEvent, syncTrainingState);
  }, []);

  const handleAnswer = (qIndex, optIdx) => {
    setAnswers((a) => ({ ...a, [qIndex]: optIdx }));
  };

  const handleNext = () => {
    if (currentQ < total - 1) {
      setCurrentQ((q) => q + 1);
      setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } else {
      // Calculate score
      let score = 0;
      questions.forEach((q, i) => {
        const chosen = answers[i];
        if (chosen !== undefined) {
          score += q.options[chosen].weight || 0;
        }
      });
      const result = saveAttempt({ score, maxScore: getMaxTestScore(questions), answers });
      setAttempt(result);
    }
  };

  if (attempt) {
    return (
      <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
        <div className="container py-5" style={{ maxWidth: 680 }}>
          <ResultScreen attempt={attempt} />
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
        <div className="container py-5" style={{ maxWidth: 680, textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📝</div>
          <h2 className="fw-bold mb-3">Leader Certification Test</h2>
          <div
            style={{
              background: "#fff", borderRadius: 16, padding: "2rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)", marginBottom: "2rem",
              textAlign: "left",
            }}
          >
            <h5 className="fw-bold mb-3">Test Guidelines</h5>
            <ul className="list-unstyled" style={{ lineHeight: 2 }}>
              <li>📋 <strong>{total} questions</strong> — scenario-based, multiple choice</li>
              <li>⚖️ <strong>Weighted scoring</strong> — best answer scores highest</li>
              <li>⏱ <strong>No time limit</strong> — read each question carefully</li>
              <li>🔍 <strong>Explanations shown</strong> after each answer</li>
              <li>🎯 <strong>70%+ to pass</strong>, 90%+ for Expert certification</li>
              <li>🔄 <strong>Retake anytime</strong> — best score is kept</li>
            </ul>
            <div
              style={{
                background: "#fffbeb", border: "1px solid #fde68a",
                borderRadius: 10, padding: "0.85rem 1rem", marginTop: "0.5rem",
                fontSize: "0.9rem", color: "#92400e",
              }}
            >
              💡 Tip: There may be more than one reasonable answer — choose the BEST action a leader should take.
            </div>
          </div>
          <button
            className="btn btn-success btn-lg px-5"
            onClick={() => setStarted(true)}
            disabled={total === 0}
            style={{ borderRadius: 10, fontWeight: 700 }}
          >
            {total === 0 ? "No Questions Configured" : "Start Test →"}
          </button>
          <div className="mt-3">
            <Link to="/leader-training" className="text-muted small">
              ← Back to Training
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (total === 0) {
    return (
      <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
        <div className="container py-5 text-center" style={{ maxWidth: 680 }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📝</div>
          <h3 className="fw-bold mb-3">Certification Test Not Ready</h3>
          <p className="text-muted mb-4">
            No training questions are configured right now. Please add them from the CRM Training tab.
          </p>
          <Link to="/leader-training" className="btn btn-outline-success">
            ← Back to Training
          </Link>
        </div>
      </div>
    );
  }

  const question = questions[currentQ];

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }} ref={topRef}>
      {/* Header */}
      <div
        style={{
          background: "#14532d", color: "#fff",
          padding: "1rem 1.5rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        <span className="fw-bold" style={{ fontSize: "0.95rem" }}>🎓 Certification Test</span>
          <span className="small" style={{ opacity: 0.8 }}>
          {currentQ + 1}/{total}
        </span>
      </div>

      <div className="container py-4" style={{ maxWidth: 680 }}>
        <div
          style={{
            background: "#fff", borderRadius: 16, padding: "1.75rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <QuestionCard
            question={question}
            qIndex={currentQ}
            total={total}
            answer={answers[currentQ] !== undefined ? answers[currentQ] : null}
            onAnswer={handleAnswer}
            onNext={handleNext}
            isLast={currentQ === total - 1}
          />
        </div>

        {/* Quit */}
        <div className="text-center mt-3">
          <button
            className="btn btn-link text-muted small"
            onClick={() => {
              if (window.confirm("Quit the test? Your progress will be lost.")) {
                navigate("/leader-training");
              }
            }}
          >
            Quit Test
          </button>
        </div>
      </div>
    </div>
  );
}
