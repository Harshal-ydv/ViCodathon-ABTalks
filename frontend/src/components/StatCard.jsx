import './StatCard.css';

function StatCard({ icon, label, value, subtext, type = 'normal' }) {
  return (
    <div className={`stat-card card border-${type}`}>
      <div className="stat-card-header">
        <span className="stat-label text-muted">{label}</span>
        {icon && <span className="stat-icon">{icon}</span>}
      </div>
      <div className="stat-card-body">
        <span className="stat-value">{value}</span>
        {subtext && <span className="stat-subtext text-muted">{subtext}</span>}
      </div>
    </div>
  );
}

export default StatCard;
