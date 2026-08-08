import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import ProgressTracker from '../components/ProgressTracker';
import TranscriptPanel from '../components/TranscriptPanel';
import './InterviewRoomPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function InterviewRoomPage() {
  const navigate = useNavigate();
  const { sessionId, transcript, addMessage, setFeedback, setInterviewDone, interviewMode, candidate } = useSession();
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [coveredDays, setCoveredDays] = useState([]);
  
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!sessionId) {
      navigate('/candidates');
    }
  }, [sessionId, navigate]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMessage = input.trim();
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    addMessage({ role: 'user', content: userMessage });
    setIsTyping(true);
    setTurnCount(prev => prev + 1);
    
    try {
      const res = await fetch(`${API_URL}/api/interview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: userMessage
        })
      });
      
      const data = await res.json();
      
      if (data.reply) {
        addMessage({ role: 'interviewer', content: data.reply });
      }
      
      if (data.done) {
        setInterviewDone(true);
        if (data.feedback) {
          setFeedback(data.feedback);
        }
        navigate('/feedback');
      }
      
    } catch (err) {
      console.error('Interview error:', err);
      addMessage({ role: 'interviewer', content: 'Sorry, I encountered an error. Let us try to continue.' });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleEndInterview = () => {
    setInterviewDone(true);
    navigate('/feedback');
  };

  if (!sessionId) return null;

  return (
    <div className="interview-room">
      <div className="room-header-actions">
        <button className="end-btn" onClick={handleEndInterview}>End Interview</button>
      </div>
      <ProgressTracker turnCount={turnCount} maxTurns={8} coveredDays={coveredDays} />
      
      <div className={`room-main ${interviewMode === 'video' ? 'split-layout' : ''}`}>
        {interviewMode === 'video' && (
          <div className="video-panel">
            <div className="trugen-placeholder">
              <span className="camera-icon">🎥</span>
              <p>TruGen AI Avatar</p>
              <p className="text-muted text-sm">Waiting for connection...</p>
            </div>
          </div>
        )}
        
        <TranscriptPanel transcript={transcript} />
      </div>

      <div className="input-area">
        <div className="input-container">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder="Type your answer... (Press Enter to send)"
            disabled={isTyping}
            rows={1}
          />
          <button 
            className="send-btn" 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
          >
            Send
          </button>
        </div>
        {isTyping && (
          <div className="typing-indicator">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}
      </div>
    </div>
  );
}

export default InterviewRoomPage;
