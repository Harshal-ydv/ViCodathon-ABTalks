import { createContext, useState, useContext } from 'react';

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [sessionId, setSessionId] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [interviewDone, setInterviewDone] = useState(false);
  const [interviewMode, setInterviewMode] = useState('text');

  const addMessage = (message) => {
    setTranscript((prev) => [...prev, message]);
  };

  const resetSession = () => {
    setSessionId(null);
    setCandidate(null);
    setTranscript([]);
    setFeedback(null);
    setInterviewDone(false);
    setInterviewMode('text');
  };

  const generateSessionId = () => {
    const newId = crypto.randomUUID();
    setSessionId(newId);
    return newId;
  };

  const startNewSession = () => {
    const newId = crypto.randomUUID();
    setSessionId(newId);
    setTranscript([]);
    setFeedback(null);
    setInterviewDone(false);
    return newId;
  };

  return (
    <SessionContext.Provider
      value={{
        sessionId,
        candidate,
        transcript,
        feedback,
        interviewDone,
        interviewMode,
        setCandidate,
        addMessage,
        setFeedback,
        resetSession,
        setInterviewMode,
        generateSessionId,
        startNewSession,
        setInterviewDone
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
