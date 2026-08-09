import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import StatCard from '../components/StatCard';
import LearningMap from '../components/LearningMap';
import DayDetailPanel from '../components/DayDetailPanel';
import './JourneyPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function JourneyPage() {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const { setCandidate } = useSession();
  
  const [candidateData, setCandidateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(1);

  useEffect(() => {
    fetchCandidate();
  }, [candidateId]);

  const fetchCandidate = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/candidates`);
      const data = await res.json();
      
      const list = Array.isArray(data) ? data : (data.candidates || []);
      const matched = list.find(c => c.member.id === candidateId);
      
      if (matched) {
        setCandidateData(matched);
        setCandidate(matched); // sync as active candidate in session
        
        // Default active day to first mission day if exists
        if (matched.missions && matched.missions.length > 0) {
          setActiveDay(matched.missions[0].day);
        }
      } else {
        console.error('Candidate not found');
        navigate('/candidates');
      }
    } catch (err) {
      console.error('Error fetching candidate for journey:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="journey-page loading-container">
        <div className="spinner"></div>
        <p className="text-muted">Loading learning journey...</p>
      </div>
    );
  }

  if (!candidateData) return null;

  const { member, missions, signals } = candidateData;

  // Compute stats
  const totalMissions = missions.length;
  const completedMissions = signals.missionsCompleted || missions.filter(m => m.passed).length;
  const skippedMissions = missions.filter(m => m.skipped).length;
  const successRate = totalMissions > 0 
    ? Math.round((signals.missionsFirstTry / completedMissions) * 100) 
    : 0;

  const activeMission = missions.find(m => m.day === activeDay);

  const handleStartInterview = () => {
    navigate('/pre-interview');
  };

  return (
    <div className="journey-page">
      <div className="journey-header">
        <div className="header-info">
          <h2>Candidate Learning Journey</h2>
          <p className="text-muted">
            Personalized 31-day activity heatmap and technical competency analysis for <strong>{member.name}</strong>.
          </p>
        </div>
        <button className="start-interview-btn" onClick={handleStartInterview}>
          Start AI Interview &rarr;
        </button>
      </div>

      {/* Stats Cards Section */}
      <div className="journey-stats-grid">
        <StatCard 
          icon="📚" 
          label="Missions Completed" 
          value={`${completedMissions}/31`} 
          subtext="Total curriculum completion"
          type="emerald"
        />
        <StatCard 
          icon="🎯" 
          label="First-Try Rate" 
          value={`${successRate}%`} 
          subtext={`${signals.missionsFirstTry} passed on first attempt`}
          type="indigo"
        />
        <StatCard 
          icon="📅" 
          label="Commit Days" 
          value={signals.commitDays} 
          subtext="Days with code commits"
          type="indigo"
        />
        <StatCard 
          icon="⚠️" 
          label="Skipped Missions" 
          value={skippedMissions} 
          subtext="Topics to test conceptually"
          type="amber"
        />
      </div>

      {/* Heatmap & Day Detail Split Panel */}
      <div className="journey-main-layout">
        <div className="heatmap-section">
          <LearningMap 
            missions={missions} 
            activeDay={activeDay} 
            onSelectDay={setActiveDay} 
          />
        </div>
        
        <div className="detail-section">
          <DayDetailPanel 
            dayNum={activeDay} 
            mission={activeMission} 
          />
        </div>
      </div>
    </div>
  );
}

export default JourneyPage;
