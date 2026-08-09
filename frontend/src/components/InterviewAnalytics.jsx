import { useMemo } from 'react';
import './InterviewAnalytics.css';

function InterviewAnalytics({ transcript = [] }) {
  const stats = useMemo(() => {
    const userMessages = transcript.filter(m => m.role === 'user');
    const interviewerMessages = transcript.filter(m => m.role === 'interviewer');

    const totalQuestions = userMessages.length;
    
    // Calculate word counts
    let totalWords = 0;
    let avgWords = 0;
    let longestWords = 0;
    let longestResponse = 'No responses recorded.';

    userMessages.forEach(msg => {
      const words = msg.content.trim().split(/\s+/).filter(Boolean);
      totalWords += words.length;
      if (words.length > longestWords) {
        longestWords = words.length;
        longestResponse = msg.content;
      }
    });

    if (totalQuestions > 0) {
      avgWords = Math.round(totalWords / totalQuestions);
    }

    // Topics covered (unique days tagged in transcript)
    const uniqueDays = new Set();
    transcript.forEach(turn => {
      if (turn.topic_day) {
        uniqueDays.add(turn.topic_day);
      }
    });

    // Follow-ups count
    // A follow-up is an interviewer message that is not the initial question of a topic.
    // Since planner queues days, if we see consecutive questions on the same topic_day, it represents a follow-up.
    let followUpCount = 0;
    let lastDay = null;
    let questionsPerDay = {};

    transcript.forEach(turn => {
      if (turn.role === 'interviewer' && turn.topic_day) {
        questionsPerDay[turn.topic_day] = (questionsPerDay[turn.topic_day] || 0) + 1;
      }
    });

    Object.values(questionsPerDay).forEach(count => {
      if (count > 1) {
        followUpCount += (count - 1);
      }
    });

    // Compute simple confidence score
    // More follow-ups means the candidate struggled slightly initially.
    let confidenceRating = 'High';
    if (followUpCount >= 3) {
      confidenceRating = 'Needs Work';
    } else if (followUpCount >= 1) {
      confidenceRating = 'Moderate';
    }

    return {
      totalQuestions,
      avgWords,
      longestWords,
      longestResponse,
      topicsCount: uniqueDays.size,
      followUpCount,
      confidenceRating
    };
  }, [transcript]);

  if (transcript.length === 0) return null;

  return (
    <div className="interview-analytics">
      <h3 className="analytics-title">Session Performance Analytics</h3>
      
      <div className="analytics-grid">
        <div className="analytics-card">
          <span className="card-label">Questions Answered</span>
          <span className="card-value">{stats.totalQuestions}</span>
          <span className="card-subtext">Total turns evaluated</span>
        </div>

        <div className="analytics-card">
          <span className="card-label">Topics Explored</span>
          <span className="card-value">{stats.topicsCount}</span>
          <span className="card-subtext">Unique curriculum days</span>
        </div>

        <div className="analytics-card">
          <span className="card-label">Avg Answer Length</span>
          <span className="card-value">{stats.avgWords} <span className="value-unit">words</span></span>
          <span className="card-subtext">Response depth indicator</span>
        </div>

        <div className="analytics-card">
          <span className="card-label">Follow-up Depth</span>
          <span className="card-value">{stats.followUpCount}</span>
          <span className="card-subtext">Probing questions asked</span>
        </div>
      </div>

      <div className="longest-answer-section card">
        <h4>💡 Deepest Response Profile</h4>
        <div className="longest-answer-meta">
          <span className="text-muted text-xs">Response Length: {stats.longestWords} words</span>
        </div>
        <blockquote className="response-quote">
          "{stats.longestResponse.length > 250 ? `${stats.longestResponse.substring(0, 250)}...` : stats.longestResponse}"
        </blockquote>
      </div>

      <div className="analytics-indicators">
        <div className="indicator-box">
          <span className="ind-label">Confidence Trend:</span>
          <span className={`ind-badge rating-${stats.confidenceRating.toLowerCase().replace(' ', '-')}`}>
            {stats.confidenceRating}
          </span>
        </div>
      </div>
    </div>
  );
}

export default InterviewAnalytics;
