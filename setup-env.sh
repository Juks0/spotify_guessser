#!/bin/bash

# Setup environment variables for Spotify Guesser
echo "Setting up environment variables..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
# Spotify Configuration
SPOTIFY_CLIENT_ID=560440ae985b45a8b13e61974617bd05
SPOTIFY_CLIENT_SECRET=7f262b78be8148c194110fad34f96616

# Server Configuration
NODE_ENV=development
AUTH_PORT=8888

# URL Configuration
FRONTEND_URL=https://192.168.0.93:5173
BACKEND_URL=https://192.168.0.93:8888
SERVER_BACKEND_URL=https://192.168.0.93:8888

# Supabase Configuration (replace with your actual values)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_key_here
EOF
    echo "✅ .env file created successfully!"
else
    echo "⚠️  .env file already exists. Please check the values manually."
fi

echo ""
echo "🔧 Environment setup complete!"
echo "📝 Please update the Supabase values in .env with your actual credentials."
echo "🚀 You can now run your development servers."
