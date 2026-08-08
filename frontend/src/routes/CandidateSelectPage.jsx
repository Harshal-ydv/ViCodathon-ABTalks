import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import CandidateCard from '../components/CandidateCard';
import './CandidateSelectPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function CandidateSelectPage() {
  const navigate = useNavigate();
  const { setCandidate, candidate } = useSession();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/candidates`);
      const data = await res.json();
      // backend returns a plain array; handle both array and wrapped {candidates:[]} defensively
      setCandidates(Array.isArray(data) ? data : (data.candidates || []));
    } catch (err) {
      console.error('Failed to fetch candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = candidates.filter(c => 
    c.member.name.toLowerCase().includes(search.toLowerCase()) || 
    c.member.jobRole.toLowerCase().includes(search.toLowerCase())
  );

  const handleContinue = () => {
    if (candidate) {
      navigate('/pre-interview');
    }
  };

  return (
    <div className="candidate-page">
      <div className="candidate-header">
        <h2>Select a Candidate Profile</h2>
        <p className="text-muted">Choose a candidate to experience a personalized technical interview based on their AI Cohort journey.</p>
      </div>

      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search by name or role..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p className="text-muted">Loading candidates...</p>
        </div>
      ) : (
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
      )}

      <div className="candidate-footer">
        <button 
          onClick={handleContinue} 
          disabled={!candidate}
          className="continue-btn"
        >
          Continue &rarr;
        </button>
      </div>
    </div>
  );
}

export default CandidateSelectPage;
