import { useState } from 'react';
import './TruGenAvatar.css';

function TruGenAvatar() {
  const agentId = import.meta.env.VITE_TRUGEN_AGENT_ID;
  const customEmbedUrl = import.meta.env.VITE_TRUGEN_EMBED_URL;
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Construct iframe embed URL
  let embedUrl = '';
  if (customEmbedUrl) {
    embedUrl = customEmbedUrl.includes('{AGENT_ID}') 
      ? customEmbedUrl.replace('{AGENT_ID}', agentId) 
      : `${customEmbedUrl.replace(/\/$/, '')}/${agentId}`;
  } else if (agentId && (agentId.startsWith('http://') || agentId.startsWith('https://'))) {
    embedUrl = agentId;
  } else if (agentId) {
    embedUrl = `https://trugen.ai/embed/${agentId}`;
  }

  if (!agentId) {
    return (
      <div className="trugen-avatar-container trugen-fallback">
        <div className="avatar-placeholder">
          <span className="camera-icon">🎥</span>
          <h4>TruGen AI Video Avatar</h4>
          <p className="text-muted text-sm">
            Agent ID not configured. Set <code>VITE_TRUGEN_AGENT_ID</code> in <code>frontend/.env</code> to activate live video mode.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="trugen-avatar-container">
      <div className="trugen-header-cover">
        <span className="cover-title"><span className="text-indigo">Proof</span>Talk AI Interviewer</span>
      </div>
      {!iframeLoaded && (
        <div className="avatar-loading">
          <div className="spinner"></div>
          <p>Connecting to TruGen AI Avatar...</p>
        </div>
      )}
      <iframe
        src={embedUrl}
        title="TruGen AI Interviewer Avatar"
        className={`trugen-iframe ${iframeLoaded ? 'loaded' : ''}`}
        onLoad={() => setIframeLoaded(true)}
        allow="camera; microphone; autoplay; encrypted-media; display-capture"
        allowFullScreen
      />
    </div>
  );
}

export default TruGenAvatar;
