import { Routes, Route } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';
import Sidebar from './components/Sidebar';
import LandingPage from './routes/LandingPage';
import CandidateSelectPage from './routes/CandidateSelectPage';
import PreInterviewPage from './routes/PreInterviewPage';
import InterviewRoomPage from './routes/InterviewRoomPage';
import FeedbackPage from './routes/FeedbackPage';
import JourneyPage from './routes/JourneyPage';
import './App.css';

function App() {
  return (
    <SessionProvider>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/candidates" element={<CandidateSelectPage />} />
            <Route path="/pre-interview" element={<PreInterviewPage />} />
            <Route path="/interview" element={<InterviewRoomPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/journey/:candidateId" element={<JourneyPage />} />
          </Routes>
        </main>
      </div>
    </SessionProvider>
  );
}

export default App;
