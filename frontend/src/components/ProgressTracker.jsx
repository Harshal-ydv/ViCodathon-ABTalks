import './ProgressTracker.css';

function ProgressTracker({ turnCount = 0, maxTurns = 8, coveredDays = [], onEndInterview }) {
  const progressPercent = Math.min((turnCount / maxTurns) * 100, 100);

  return (
    <div className="progress-tracker">
      <div className="progress-left">
        <span className="progress-text">Questions: {turnCount}/{maxTurns}</span>
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
      <div className="progress-right">
        <span className="progress-text text-muted">Covered Topics:</span>
        <div className="days-container">
          {coveredDays.length > 0 ? (
            coveredDays.map((day, idx) => (
              <span key={idx} className="day-chip">Day {day}</span>
            ))
          ) : (
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>None yet</span>
          )}
        </div>
        {onEndInterview && (
          <button className="end-btn-inline" onClick={onEndInterview}>
            End Interview
          </button>
        )}
      </div>
    </div>
  );
}

export default ProgressTracker;
