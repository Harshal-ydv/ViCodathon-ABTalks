import { useNavigate } from 'react-router-dom';
import './CandidateCard.css';

function CandidateCard({ candidate, isSelected, onClick }) {
  const navigate = useNavigate();
  const { member, signals } = candidate;

  const completed = signals.missionsCompleted || 0;
  const progressPercent = Math.min((completed / 31) * 100, 100);

  const handleViewJourney = (e) => {
    e.stopPropagation();
    navigate(`/journey/${member.id}`);
  };

  return (
    <div 
      className={`card candidate-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="candidate-card-header">
        <div className="title-area">
          <h3 className="candidate-name">{member.name}</h3>
          <span className="job-role-badge">{member.jobRole}</span>
        </div>
        <span className={`status-pill ${member.status.toLowerCase()}`}>
          {member.status}
        </span>
      </div>

      <div className="candidate-progress">
        <div className="progress-labels">
          <span className="text-xs text-muted">Cohort Completion</span>
          <span className="text-xs font-semibold">{completed}/31 Days</span>
        </div>
        <div className="card-progress-bar">
          <div 
            className="card-progress-fill" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      <div className="candidate-info">
        <p>🎓 {member.education}</p>
        <p>💼 {member.yearsExperience} years experience</p>
      </div>

      <div className="candidate-card-footer">
        <div className="candidate-stats">
          <div className="stat-badge" title="Missions completed">
            <span className="dot dot-emerald"></span>
            {completed}
          </div>
          <div className="stat-badge" title="Commit days">
            📅 {signals.commitDays}
          </div>
          <div className="stat-badge" title="Missions passed first try">
            🎯 {signals.missionsFirstTry}
          </div>
        </div>

        <button className="view-journey-btn" onClick={handleViewJourney}>
          View Journey &rarr;
        </button>
      </div>
    </div>
  );
}

export default CandidateCard;
