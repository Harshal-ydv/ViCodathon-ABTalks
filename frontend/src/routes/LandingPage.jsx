import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <section className="hero-section">
        <h1 className="hero-title">
          Build the interviewer,<br />
          <span className="text-indigo">not the interview.</span>
        </h1>
        <p className="hero-subtext">
          AI-powered technical interviews personalized to your actual learning journey. Not generic questions — real assessment based on what you built.
        </p>
        <button className="cta-button" onClick={() => navigate('/candidates')}>
          Start Your Interview &rarr;
        </button>
        <p className="hero-powered text-muted">Powered by ABtalks</p>
      </section>

      <section className="how-it-works">
        <div className="step-card">
          <div className="step-icon">📋</div>
          <h3>Select Profile</h3>
          <p className="text-muted">Choose your candidate profile built from your AI Cohort journey.</p>
        </div>
        <div className="step-card">
          <div className="step-icon">🎯</div>
          <h3>Face the Interview</h3>
          <p className="text-muted">Engage in a dynamic, adaptive technical interview.</p>
        </div>
        <div className="step-card">
          <div className="step-icon">📊</div>
          <h3>Get Feedback</h3>
          <p className="text-muted">Receive actionable insights on your strengths and knowledge gaps.</p>
        </div>
      </section>

      <section className="features-section">
        <div className="feature">
          <h3 className="text-emerald">Signal-Aware Questioning</h3>
          <p className="text-muted">Questions adapt based on your struggles and strengths.</p>
        </div>
        <div className="feature">
          <h3 className="text-emerald">Curriculum-Grounded</h3>
          <p className="text-muted">Every question traceable to a real cohort day.</p>
        </div>
        <div className="feature">
          <h3 className="text-emerald">Structured Feedback</h3>
          <p className="text-muted">Actionable strengths, gaps, and next steps.</p>
        </div>
        <div className="feature">
          <h3 className="text-emerald">Face-to-Face Ready</h3>
          <p className="text-muted">TruGen AI video avatar integration.</p>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
