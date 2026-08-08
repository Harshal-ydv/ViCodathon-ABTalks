import { Routes, Route } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './routes/LandingPage';
import CandidateSelectPage from './routes/CandidateSelectPage';
import PreInterviewPage from './routes/PreInterviewPage';
import InterviewRoomPage from './routes/InterviewRoomPage';
import FeedbackPage from './routes/FeedbackPage';
import './App.css';

function App() {
  return (
    <SessionProvider>
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/candidates" element={<CandidateSelectPage />} />
            <Route path="/pre-interview" element={<PreInterviewPage />} />
            <Route path="/interview" element={<InterviewRoomPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </SessionProvider>
  );
}

export default App;
