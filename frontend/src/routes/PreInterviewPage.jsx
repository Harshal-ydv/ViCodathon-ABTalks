import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import CandidateCard from '../components/CandidateCard';
import './PreInterviewPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function PreInterviewPage() {
  const navigate = useNavigate();
  const { candidate, interviewMode, setInterviewMode, startNewSession, addMessage } = useSession();

  useEffect(() => {
    if (!candidate) {
      navigate('/candidates');
    }
  }, [candidate, navigate]);

  if (!candidate) return null;

  const handleBegin = async () => {
    const sessionId = startNewSession();
    
    // Optimistically navigate
    navigate('/interview');
    
    try {
      const res = await fetch(`${API_URL}/api/interview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          candidate
        })
      });
      const data = await res.json();
      
      addMessage({
        role: 'interviewer',
        content: data.reply,
        topic_day: data.topicDay
      });
    } catch (err) {
      console.error('Failed to start interview:', err);
      addMessage({
        role: 'interviewer',
        content: 'Error connecting to the interview server. Please try again later.'
      });
    }
  };

  const hasVideoMode = !!import.meta.env.VITE_TRUGEN_AGENT_ID;

  return (
    <div className="pre-interview-page">
      <div className="briefing-container">
        <div className="briefing-left">
          <h2 className="section-title">Selected Profile</h2>
          <CandidateCard candidate={candidate} isSelected={true} onClick={() => {}} />
        </div>
        
        <div className="briefing-right">
          <h2 className="section-title">Interview Briefing</h2>
          <div className="rules-card">
            <ul className="rules-list">
              <li>⏱️ Estimated duration: 10-15 minutes</li>
              <li>🧠 8-12 adaptive technical questions</li>
              <li>📚 Covers at least 4 curriculum topics</li>
              <li>💬 Intelligent follow-up questions</li>
            </ul>
          </div>
          
          <div className="mode-selector">
            <h3>Interview Mode</h3>
            <div className="mode-options">
              <label className={`mode-option ${interviewMode === 'text' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="mode" 
                  value="text" 
                  checked={interviewMode === 'text'} 
                  onChange={() => setInterviewMode('text')} 
                />
                <div className="mode-content">
                  <span className="mode-icon">📝</span>
                  <span className="mode-text">Text Mode</span>
                </div>
              </label>
              
              <label className={`mode-option ${interviewMode === 'video' ? 'active' : ''} ${!hasVideoMode ? 'disabled' : ''}`}>
                <input 
                  type="radio" 
                  name="mode" 
                  value="video" 
                  checked={interviewMode === 'video'} 
                  onChange={() => hasVideoMode && setInterviewMode('video')} 
                  disabled={!hasVideoMode}
                />
                <div className="mode-content">
                  <span className="mode-icon">🎥</span>
                  <span className="mode-text">Video Mode {!hasVideoMode && '(Coming Soon)'}</span>
                </div>
              </label>
            </div>
          </div>
          
          <button className="begin-btn" onClick={handleBegin}>
            Begin Interview &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

export default PreInterviewPage;
