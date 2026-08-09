import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-hero">
        <div className="hero-content">
          <span className="hero-badge">ViCodathon 2026 Submission</span>
          <h1 className="hero-title">
            Build the interviewer,<br />
            <span className="text-indigo">not the interview.</span>
          </h1>
          <p className="hero-subtext">
            ProofTalk conducts highly personalized, multi-turn technical interviews based on a candidate's actual 31-day AI Cohort journey. Signal-aware questioning that evaluates trade-offs, failures, and conceptual understanding.
          </p>
          <div className="hero-actions">
            <button className="hero-btn primary" onClick={() => navigate('/candidates')}>
              Select Candidate Profile &rarr;
            </button>
          </div>
        </div>

        {/* Visual Board Mockup (Pure CSS) */}
        <div className="hero-visual">
          <div className="board-mockup">
            <div className="mockup-header">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
              <span className="mockup-title">ProofTalk Assessment Platform</span>
            </div>
            <div className="mockup-body">
              <div className="mockup-stat-row">
                <div className="m-card">
                  <span className="m-label">Cohort Progress</span>
                  <span className="m-val text-emerald">30/31 Days</span>
                </div>
                <div className="m-card">
                  <span className="m-label">First-Try rate</span>
                  <span className="m-val text-indigo">93%</span>
                </div>
              </div>
              <div className="mockup-text-block">
                <span className="m-tag text-amber">Telemetry Signal</span>
                <p className="m-desc">Weak performance detected on Day 17 (RAG Chunking). Multiple attempts required.</p>
              </div>
              <div className="mockup-text-block">
                <span className="m-tag text-indigo">Interviewer Strategy</span>
                <p className="m-desc">"Probe candidate on chunk overlap selection, context windows, and vector similarity search trade-offs."</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cohort Stats Ribbon */}
      <section className="stats-ribbon">
        <div className="ribbon-item">
          <span className="ribbon-val">20</span>
          <span className="ribbon-label">Telemetry Candidate Profiles</span>
        </div>
        <div className="ribbon-item">
          <span className="ribbon-val">31</span>
          <span className="ribbon-label">Curriculum Days Grounded</span>
        </div>
        <div className="ribbon-item">
          <span className="ribbon-val">8</span>
          <span className="ribbon-label">AI Engineering Modules</span>
        </div>
        <div className="ribbon-item">
          <span className="ribbon-val">Groq</span>
          <span className="ribbon-label">Llama 3.3 70B Reasoning</span>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works-section">
        <h2 className="section-heading">How ProofTalk Works</h2>
        <div className="steps-grid">
          <div className="step-item">
            <span className="step-num">01</span>
            <h4>Select Profile</h4>
            <p className="text-muted">Choose a candidate profile. Data imports telemetry signals representing confident, challenging, or skipped days during their AI Cohort journey.</p>
          </div>
          <div className="step-item">
            <span className="step-num">02</span>
            <h4>Analyze Journey Map</h4>
            <p className="text-muted">Explore the interactive 31-day heatmap. View objectives and customized AI interview strategy for every single concept module.</p>
          </div>
          <div className="step-item">
            <span className="step-num">03</span>
            <h4>Conduct the Interview</h4>
            <p className="text-muted">Face the adaptive AI interviewer. Run a dynamic conversation (text or TruGen AI video avatar) focusing directly on target mastery areas.</p>
          </div>
          <div className="step-item">
            <span className="step-num">04</span>
            <h4>View Performance Analytics</h4>
            <p className="text-muted">Get structured feedback containing strengths, gaps, recommended next steps, response metrics, and answer depth analysis.</p>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="features-showcase">
        <h2 className="section-heading">Built For Real Assessments</h2>
        <div className="features-grid">
          <div className="feature-card card">
            <span className="feat-icon">📡</span>
            <h4>Signal-Aware</h4>
            <p className="text-muted">Adapts questions dynamically. Evaluates core concepts if skipped, probes failure states if challenged, tests trade-offs if confident.</p>
          </div>
          <div className="feature-card card">
            <span className="feat-icon">🔒</span>
            <h4>No Hallucinations</h4>
            <p className="text-muted">Directly grounded in the 31-day curriculum. Keeps the interviewer strictly focused on target concepts and tools.</p>
          </div>
          <div className="feature-card card">
            <span className="feat-icon">🎥</span>
            <h4>Face-to-Face Ready</h4>
            <p className="text-muted">Supports interactive text or real-time TruGen AI video avatar streaming for human-like conversational experience.</p>
          </div>
          <div className="feature-card card">
            <span className="feat-icon">📈</span>
            <h4>Detailed Analytics</h4>
            <p className="text-muted">Tracks confidence trends, average answer length, follow-up depth, and conceptual gaps dynamically from the conversation.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;
