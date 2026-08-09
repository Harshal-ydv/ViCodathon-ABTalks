import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import agentImg from '../agent.png';
import './LandingPage.css';

const COMPARISON_ROWS = [
  {
    feature: 'Personalization',
    us: 'Fully curriculum-grounded per candidate journey',
    them: 'Generic question banks or templates',
    themType: 'bad',
  },
  {
    feature: 'Telemetry Signals',
    us: 'Reads 31-day cohort signals — attempts, skips, struggles',
    them: 'No access to candidate learning history',
    themType: 'bad',
  },
  {
    feature: 'Adaptive Follow-ups',
    us: 'Probes deeper based on quality of each answer',
    them: 'Fixed, linear question flow',
    themType: 'warn',
  },
  {
    feature: 'Interview Modes',
    us: 'Text chat + TruGen AI video avatar (dual-mode)',
    them: 'Usually text-only or video-only',
    themType: 'warn',
  },
  {
    feature: 'Instant Analytics',
    us: 'Response depth, follow-up count, confidence trends',
    them: 'Basic pass/fail or manual review',
    themType: 'bad',
  },
  {
    feature: 'Curriculum Context',
    us: 'Every question traced to a specific cohort day & module',
    them: 'No curriculum or learning context',
    themType: 'bad',
  },
  {
    feature: 'Actionable Feedback',
    us: 'Strengths, gaps, and concrete next-study steps',
    them: 'Generic score or vague summary',
    themType: 'warn',
  },
];

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">

      {/* ── Hero ── */}
      <div className="landing-hero">
        <div className="hero-content">
          <span className="hero-badge">ProofTalk AI</span>
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

        {/* Agent Image Frame */}
        <div className="hero-visual">
          <div className="agent-frame">
            {/* Browser chrome bar */}
            <div className="agent-chrome">
              <span className="chrome-dot red"></span>
              <span className="chrome-dot yellow"></span>
              <span className="chrome-dot green"></span>
              <span className="chrome-title">ProofTalk · Live AI Interview</span>
              <span className="live-indicator"><span className="live-pulse"></span>LIVE</span>
            </div>

            {/* Agent Image */}
            <div className="agent-image-wrapper">
              <img
                src={agentImg}
                alt="ProofTalk AI Video Interview Agent"
                className="agent-photo"
              />



              {/* CTA overlay button */}
              <button className="agent-start-btn" onClick={() => navigate('/candidates')}>
                ▶ Start Interview
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Ribbon ── */}
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

      {/* ── Comparison Table ── */}
      <section className="comparison-section">
        <h2 className="section-heading">ProofTalk vs Other AI Interview Tools</h2>
        <p className="section-subtext text-muted">
          Most interview tools ask generic questions. ProofTalk knows exactly where each candidate struggled, skipped, or excelled — and interviews accordingly.
        </p>

        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="col-feature">Feature</th>
                <th className="col-us">
                  <div className="th-badge us-badge">
                    <span className="logo-dot">◆</span> ProofTalk Agent
                  </div>
                </th>
                <th className="col-them">
                  <div className="th-badge them-badge">
                    Other Interview Tools
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, i) => (
                <tr key={i} className="comparison-row">
                  <td className="feature-label">{row.feature}</td>
                  <td className="us-cell">
                    <span className="icon-check">✓</span>
                    <span>{row.us}</span>
                  </td>
                  <td className="them-cell">
                    <span className={`icon-cross ${row.themType}`}>
                      {row.themType === 'bad' ? '✕' : '⚠'}
                    </span>
                    <span>{row.them}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── How it Works ── */}
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

      {/* ── Platform Features ── */}
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
