import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import FeedbackCards from '../components/FeedbackCards';
import './FeedbackPage.css';

function FeedbackPage() {
  const navigate = useNavigate();
  const { candidate, feedback, resetSession } = useSession();

  useEffect(() => {
    if (!candidate) {
      navigate('/');
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
        <h2>Interview Complete</h2>
        <p className="text-muted">
          Feedback report for {candidate.member.name} ({candidate.member.jobRole})
        </p>
      </div>

      {feedback ? (
        <FeedbackCards feedback={feedback} />
      ) : (
        <div className="no-feedback">
          <p>No detailed feedback was generated for this session.</p>
        </div>
      )}

      <div className="feedback-actions">
        <button onClick={handleTryAnother} className="action-btn primary">
          Try Another Candidate &rarr;
        </button>
        <button onClick={handleHome} className="action-btn secondary">
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default FeedbackPage;
