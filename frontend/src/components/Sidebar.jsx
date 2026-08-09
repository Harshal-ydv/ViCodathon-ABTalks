import { NavLink } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import './Sidebar.css';

function Sidebar() {
  const { candidate } = useSession();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-name">Proof<span className="text-indigo">Talk</span></span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group">
          <span className="nav-group-title">General</span>
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="nav-icon">📊</span>
            Dashboard
          </NavLink>
          <NavLink to="/candidates" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="nav-icon">👥</span>
            Candidates
          </NavLink>
        </div>

        <div className="nav-group">
          <span className="nav-group-title">Learning Tools</span>
          {candidate ? (
            <>
              <NavLink to={`/journey/${candidate.member.id}`} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                <span className="nav-icon">🗺️</span>
                Learning Journey
              </NavLink>
              <NavLink to="/pre-interview" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                <span className="nav-icon">🎙️</span>
                Setup Interview
              </NavLink>
            </>
          ) : (
            <>
              <span className="nav-item disabled" title="Select a candidate first">
                <span className="nav-icon">🗺️</span>
                Learning Journey
              </span>
              <span className="nav-item disabled" title="Select a candidate first">
                <span className="nav-icon">🎙️</span>
                Setup Interview
              </span>
            </>
          )}
        </div>

        {candidate && (
          <div className="nav-group">
            <span className="nav-group-title">Active Candidate</span>
            <div className="active-candidate-badge">
              <div className="cand-indicator"></div>
              <div className="cand-info">
                <span className="cand-name">{candidate.member.name}</span>
                <span className="cand-role">{candidate.member.jobRole}</span>
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="sidebar-footer">
        <span className="text-muted text-xs">ProofTalk Agent v1.1</span>
      </div>
    </aside>
  );
}

export default Sidebar;
