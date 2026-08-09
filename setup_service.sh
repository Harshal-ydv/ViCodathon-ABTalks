#!/bin/bash
# ProofTalk EC2 Setup Script
# Usage: bash setup_service.sh YOUR_GROQ_API_KEY

if [ -z "$1" ]; then
    echo "❌ Usage: bash setup_service.sh YOUR_GROQ_API_KEY"
    echo "   Example: bash setup_service.sh gsk_abc123xyz..."
    exit 1
fi

GROQ_KEY="$1"

echo "📝 Writing systemd service file..."

sudo tee /etc/systemd/system/prooftalk.service > /dev/null <<ENDOFFILE
[Unit]
Description=ProofTalk FastAPI Backend Daemon
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/ProofTalk/backend
Environment="PATH=/home/ubuntu/ProofTalk/backend/.venv/bin"
Environment="GROQ_API_KEY=${GROQ_KEY}"
ExecStart=/home/ubuntu/ProofTalk/backend/.venv/bin/python run.py
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
ENDOFFILE

echo "🔄 Reloading and restarting service..."
sudo systemctl daemon-reload
sudo systemctl enable prooftalk
sudo systemctl restart prooftalk

echo "⏳ Waiting 3 seconds for service to start..."
sleep 3

echo ""
echo "📊 Service status:"
sudo systemctl status prooftalk --no-pager

echo ""
echo "🧪 Testing backend API..."
curl -s http://localhost:8000/api/health

echo ""
echo ""
echo "✅ Done! If status shows 'active (running)' and health check returns ok, your backend is ready."
