import curriculum from '../data/curriculum.json';
import './DayDetailPanel.css';

function DayDetailPanel({ dayNum, mission }) {
  // Find curriculum details
  const dayInfo = curriculum.days.find(d => d.day === dayNum);

  if (!dayInfo) {
    return (
      <div className="day-detail-panel card">
        <p className="text-muted">Select a day from the learning timeline to view curriculum objectives and AI questioning strategy.</p>
      </div>
    );
  }

  // Determine status and bucket details
  let statusText = 'Not Attempted';
  let statusClass = 'text-muted';
  let signalText = 'No telemetry signals recorded.';
  let strategyText = 'N/A';

  if (mission) {
    if (mission.skipped) {
      statusText = 'Skipped';
      statusClass = 'text-amber';
      signalText = 'Candidate skipped this mission during the cohort.';
      strategyText = 'Frame conceptually: "Even though you did not complete this setup, conceptually how would you handle..."';
    } else if (mission.passed) {
      const attempts = mission.attempts || 1;
      statusText = `Completed (${attempts} ${attempts === 1 ? 'attempt' : 'attempts'})`;
      statusClass = 'text-emerald';
      
      if (attempts <= 2) {
        signalText = `Candidate completed mission quickly (attempts: ${attempts}). Demonstrates high confidence.`;
        strategyText = 'Probe with architectural trade-offs: "Why choose this approach over alternatives? What are the latency or scalability implications?"';
      } else {
        signalText = `Candidate passed but required ${attempts} attempts. Topic was challenging.`;
        strategyText = 'Probe failure modes & foundational details: "What was the trickiest part? How do you debug or handle failures in this area?"';
      }
    } else {
      statusText = 'Attempted (Failed)';
      statusClass = 'text-danger';
      signalText = `Candidate attempted this day but did not pass (attempts: ${mission.attempts}).`;
      strategyText = 'Assess foundational gaps: "What was the main blocker you encountered, and how would you conceptually resolve it?"';
    }
  }

  return (
    <div className="day-detail-panel card">
      <div className="panel-header">
        <span className="day-label">Day {dayNum}</span>
        <span className={`status-badge ${statusClass}`}>{statusText}</span>
      </div>

      <h3 className="panel-title">{dayInfo.title}</h3>

      <div className="panel-section">
        <h5>📚 Curriculum Concepts</h5>
        <ul className="concepts-list">
          {dayInfo.objectives?.map((obj, i) => (
            <li key={i}>{obj}</li>
          ))}
        </ul>
      </div>

      {dayInfo.tools && dayInfo.tools.length > 0 && (
        <div className="panel-section">
          <h5>🛠️ Cohort Tools</h5>
          <div className="tools-badges">
            {dayInfo.tools.map((tool, i) => (
              <span key={i} className="tool-badge">{tool}</span>
            ))}
          </div>
        </div>
      )}

      <div className="panel-section highlight-box border-emerald">
        <h5>📈 Cohort Telemetry Signal</h5>
        <p className="signal-text text-sm">{signalText}</p>
      </div>

      <div className="panel-section highlight-box border-indigo">
        <h5>🎯 AI Interview Strategy</h5>
        <p className="strategy-text text-sm">{strategyText}</p>
      </div>
    </div>
  );
}

export default DayDetailPanel;
