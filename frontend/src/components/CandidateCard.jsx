import './CandidateCard.css';

function CandidateCard({ candidate, isSelected, onClick }) {
  const { member, signals } = candidate;

  return (
    <div 
      className={`card candidate-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="candidate-card-header">
        <h3 className="candidate-name">{member.name}</h3>
        <span className="job-role-badge">{member.jobRole}</span>
      </div>
      <div className="candidate-info">
        <p>🎓 {member.education}</p>
        <p>💼 {member.yearsExperience} years experience</p>
      </div>
      <div className="candidate-stats">
        <div className="stat-badge">
          <span className="dot dot-emerald"></span>
          {signals.missionsCompleted} missions
        </div>
        <div className="stat-badge">
          📅 {signals.commitDays} days
        </div>
        <div className="stat-badge">
          🎯 {signals.missionsFirstTry} 1st try
        </div>
      </div>
    </div>
  );
}

export default CandidateCard;
