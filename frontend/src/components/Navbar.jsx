import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="logo-icon">◆</span>
          <span className="logo-text"><span className="text-indigo">Proof</span>Talk</span>
        </div>
        <nav className="navbar-links">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Home
          </NavLink>
          <NavLink to="/candidates" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Candidates
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
