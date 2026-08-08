import './FeedbackCards.css';

function FeedbackCards({ feedback }) {
  if (!feedback) return null;

  return (
    <div className="feedback-container">
      <div className="feedback-card summary-card">
        <h3>Interview Summary</h3>
        <p>{feedback.summary}</p>
      </div>
      
      <div className="feedback-grid">
        <div className="feedback-card strengths-card">
          <h4 className="text-emerald">Strengths Demonstrated</h4>
          <ul>
            {feedback.strengths?.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        
        <div className="feedback-card gaps-card">
          <h4 className="text-amber">Knowledge Gaps</h4>
          <ul>
            {feedback.gaps?.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        
        <div className="feedback-card next-steps-card">
          <h4 className="text-indigo">Recommended Next Steps</h4>
          <ul>
            {feedback.next?.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default FeedbackCards;
