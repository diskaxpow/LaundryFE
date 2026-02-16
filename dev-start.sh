#!/bin/bash
# Development Server Setup

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 2. Check TypeScript
echo "🔍 Checking TypeScript..."
npx tsc --noEmit

# 3. Start development server
echo "🚀 Starting Expo development server..."
npm start

# Access at:
# - Android: Press 'a' in terminal (requires Android emulator)
# - iOS: Press 'i' in terminal (mac only, requires iOS simulator)
# - Web: Press 'w' in terminal
# - Mobile: Scan QR code with Expo Go app

# For production build:
# $ npm run build

# For linting:
# $ npm run lint
