import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import CandidateCard from '../components/CandidateCard';
import './CandidateSelectPage.css';

const API_URL = import.meta.env.VITE_API_URL || '';

function CandidateSelectPage() {
  const navigate = useNavigate();
  const { setCandidate, candidate } = useSession();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/candidates`);
      const data = await res.json();
      setCandidates(Array.isArray(data) ? data : (data.candidates || []));
    } catch (err) {
      console.error('Failed to fetch candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  // Compute unique roles from candidates list dynamically
  const uniqueRoles = useMemo(() => {
    const roles = candidates.map(c => c.member.jobRole);
    return ['ALL', ...new Set(roles)];
  }, [candidates]);

  // Combined filtering logic
  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      const matchesSearch = c.member.name.toLowerCase().includes(search.toLowerCase()) || 
                            c.member.jobRole.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || c.member.status === statusFilter;
      const matchesRole = roleFilter === 'ALL' || c.member.jobRole === roleFilter;
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [candidates, search, statusFilter, roleFilter]);

  const handleContinue = () => {
    if (candidate) {
      navigate('/pre-interview');
    }
  };

  return (
    <div className="candidate-page">
      <div className="candidate-header">
        <div className="header-text">
          <h2>Candidate Profiles</h2>
          <p className="text-muted">Select a candidate to inspect their 31-day AI Cohort learning journey and launch a personalized evaluation.</p>
        </div>
        <button 
          onClick={handleContinue} 
          disabled={!candidate}
          className="continue-btn"
        >
          Begin Setup &rarr;
        </button>
      </div>

      {/* Interactive Filters Panel */}
      <div className="filters-panel card">
        <div className="filter-item search-box">
          <label>Search Candidates</label>
          <input 
            type="text" 
            placeholder="Type name or role..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="filter-item select-box">
          <label>Filter by Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="IN_PROGRESS">In Progress</option>
          </select>
        </div>

        <div className="filter-item select-box">
          <label>Filter by Job Role</label>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            {uniqueRoles.map((role, idx) => (
              <option key={idx} value={role}>
                {role === 'ALL' ? 'All Roles' : role}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p className="text-muted">Loading candidate profiles...</p>
        </div>
      ) : (
        <>
          {filteredCandidates.length > 0 ? (
            <div className="candidate-grid">
              {filteredCandidates.map(c => (
                <CandidateCard 
                  key={c.member.id} 
                  candidate={c} 
                  isSelected={candidate?.member.id === c.member.id}
                  onClick={() => setCandidate(c)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state card">
              <span className="empty-icon">🔍</span>
              <h4>No Candidates Match Filters</h4>
              <p className="text-muted text-sm">Try resetting your search query or role filters.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CandidateSelectPage;
