import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import ProgressTracker from '../components/ProgressTracker';
import TranscriptPanel from '../components/TranscriptPanel';
import TruGenAvatar from '../components/TruGenAvatar';
import './InterviewRoomPage.css';

const API_URL = import.meta.env.VITE_API_URL || '';

function InterviewRoomPage() {
  const navigate = useNavigate();
  const { sessionId, transcript, addMessage, setFeedback, setInterviewDone, interviewMode, candidate } = useSession();
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTextFallback, setShowTextFallback] = useState(false);
  
  const textareaRef = useRef(null);
  
  const turnCount = transcript.filter(m => m.role === 'interviewer').length;

  const coveredDays = useMemo(() => {
    const days = [];
    transcript.forEach(m => {
      if (m.role === 'interviewer' && m.topic_day && !days.includes(m.topic_day)) {
        days.push(m.topic_day);
      }
    });
    return days;
  }, [transcript]);

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
        addMessage({ 
          role: 'interviewer', 
          content: data.reply,
          topic_day: data.topicDay 
        });
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

  const isVideoMode = interviewMode === 'video';
  const showVoicePanel = isVideoMode && !showTextFallback;

  return (
    <div className="interview-room">
      <ProgressTracker turnCount={turnCount} maxTurns={8} coveredDays={coveredDays} onEndInterview={handleEndInterview} />
      
      <div className={`room-main ${isVideoMode ? 'split-layout' : ''}`}>
        {isVideoMode && (
          <div className="video-panel">
            <TruGenAvatar />
          </div>
        )}
        
        {showVoicePanel ? (
          <div className="voice-control-panel-container">
            <div className="voice-control-panel card">
              <div className="voice-header">
                <span className="live-badge"><span className="pulse-dot"></span> LIVE VOICE FEED</span>
                <h4>WebRTC Interview Connected</h4>
              </div>

              <div className="equalizer-container">
                <div className="equalizer-bar bar-1"></div>
                <div className="equalizer-bar bar-2"></div>
                <div className="equalizer-bar bar-3"></div>
                <div className="equalizer-bar bar-4"></div>
                <div className="equalizer-bar bar-5"></div>
                <div className="equalizer-bar bar-6"></div>
              </div>

              <div className="voice-instructions">
                <h5>🎙️ Voice Conversation Mode:</h5>
                <ul>
                  <li>Speak directly into your microphone after the avatar finishes talking.</li>
                  <li>The TruGen AI avatar conducts, transcribes, and evaluates your responses verbally.</li>
                  <li>The side chat panel is temporarily disabled to prevent conflicting parallel LLM threads.</li>
                </ul>
              </div>

              <button className="fallback-toggle-btn" onClick={() => setShowTextFallback(true)}>
                ⌨️ Switch to Text Chat Fallback
              </button>
            </div>
          </div>
        ) : (
          <TranscriptPanel transcript={transcript} />
        )}
      </div>

      {!showVoicePanel ? (
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
      ) : (
        <div className="voice-call-status-bar">
          <span className="text-muted text-sm">🎙️ Live WebRTC Voice Channel Active — Speak directly to the avatar</span>
        </div>
      )}
    </div>
  );
}

export default InterviewRoomPage;
