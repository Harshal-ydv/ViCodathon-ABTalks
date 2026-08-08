import { useEffect, useRef } from 'react';
import './TranscriptPanel.css';

function TranscriptPanel({ transcript }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  return (
    <div className="transcript-panel" ref={scrollRef}>
      {transcript.length === 0 ? (
        <div className="empty-state">
          <p className="text-muted">The interview has not started yet.</p>
        </div>
      ) : (
        <div className="messages">
          {transcript.map((msg, idx) => {
            const isAI = msg.role === 'interviewer';
            return (
              <div key={idx} className={`message-wrapper ${isAI ? 'ai' : 'user'}`}>
                <div className="message-label">
                  {isAI ? 'ProofTalk' : 'You'}
                </div>
                <div className="message-bubble">
                  {msg.content}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TranscriptPanel;
