import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import FeedbackCards from '../components/FeedbackCards';
import InterviewAnalytics from '../components/InterviewAnalytics';
import './FeedbackPage.css';

function FeedbackPage() {
  const navigate = useNavigate();
  const { candidate, feedback, transcript, resetSession } = useSession();

  useEffect(() => {
    if (!candidate) {
      navigate('/candidates');
    }
  }, [candidate, navigate]);

  if (!candidate) return null;

  const handleTryAnother = () => {
    resetSession();
    navigate('/candidates');
  };

  const handleHome = () => {
    resetSession();
    navigate('/');
  };

  return (
    <div className="feedback-page">
      <div className="feedback-header">
        <div className="success-icon">✓</div>
        <div className="header-info">
          <h2>Evaluation Complete</h2>
          <p className="text-muted">
            Personalized competency feedback report and conversation analytics for <strong>{candidate.member.name}</strong> ({candidate.member.jobRole}).
          </p>
        </div>
      </div>

      <div className="feedback-layout">
        {/* Left Column: Qualitative LLM Feedback */}
        <div className="feedback-left-column">
          {feedback ? (
            <FeedbackCards feedback={feedback} />
          ) : (
            <div className="no-feedback card">
              <h4>Direct Transcript Summary</h4>
              <p className="text-muted text-sm">
                Qualitative report was not generated for this session. Review the conversation analytics panel on the right for quantitative performance indices.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Quantitative Transcript Analytics */}
        <div className="feedback-right-column">
          <div className="analytics-wrapper card">
            <InterviewAnalytics transcript={transcript} />
          </div>
        </div>
      </div>

      <div className="feedback-actions">
        <button onClick={handleTryAnother} className="action-btn primary">
          Try Another Candidate &rarr;
        </button>
        <button onClick={handleHome} className="action-btn secondary">
          Back to Dashboard Home
        </button>
      </div>
    </div>
  );
}

export default FeedbackPage;
