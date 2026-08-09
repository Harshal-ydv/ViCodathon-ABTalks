import './LearningMap.css';

function LearningMap({ missions = [], activeDay = null, onSelectDay }) {
  // Create an array for days 1 to 31
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Helper to determine the status class for each day
  const getDayStatus = (dayNum) => {
    const mission = missions.find(m => m.day === dayNum);
    if (!mission) return 'status-inactive';

    if (mission.skipped) {
      return 'status-skipped';
    } else if (mission.passed) {
      if (mission.attempts <= 2) {
        return 'status-confident';
      } else {
        return 'status-struggled';
      }
    } else {
      return 'status-failed';
    }
  };

  // Helper to get attempts or label for tooltips
  const getAttemptsLabel = (dayNum) => {
    const mission = missions.find(m => m.day === dayNum);
    if (!mission) return 'No mission recorded';
    if (mission.skipped) return 'Skipped';
    if (mission.passed) return `Passed (${mission.attempts} ${mission.attempts === 1 ? 'attempt' : 'attempts'})`;
    return 'Attempted (Failed)';
  };

  return (
    <div className="learning-map-container card">
      <div className="map-header">
        <h4>Cohort Learning Timeline</h4>
        <div className="legend">
          <div className="legend-item"><span className="legend-cell status-confident"></span> Confident</div>
          <div className="legend-item"><span className="legend-cell status-struggled"></span> Struggled</div>
          <div className="legend-item"><span className="legend-cell status-skipped"></span> Skipped</div>
          <div className="legend-item"><span className="legend-cell status-inactive"></span> Unreleased</div>
        </div>
      </div>
      
      <div className="heatmap-grid">
        {days.map((dayNum) => {
          const statusClass = getDayStatus(dayNum);
          const tooltipText = `Day ${dayNum}: ${getAttemptsLabel(dayNum)}`;
          const isActive = activeDay === dayNum;

          return (
            <button
              key={dayNum}
              className={`grid-cell ${statusClass} ${isActive ? 'active' : ''}`}
              onClick={() => onSelectDay(dayNum)}
              title={tooltipText}
              type="button"
            >
              <span className="cell-number">{dayNum}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default LearningMap;
