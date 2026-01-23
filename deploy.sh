#!/bin/bash

# The Brunel Engine - Deployment Script
# Automates deployment to Vercel with environment variable setup

set -e

echo "🚀 The Brunel Engine - Deployment Script"
echo "========================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found."
    echo "📝 Creating from .env.example..."
    cp .env.example .env
    echo ""
    echo "⚙️  Please edit .env and add your API keys:"
    echo "   - ANTHROPIC_API_KEY (required)"
    echo "   - STRIPE_SECRET_KEY (optional)"
    echo "   - STRIPE_PUBLISHABLE_KEY (optional)"
    echo ""
    echo "Then run this script again."
    exit 1
fi

# Source environment variables
source .env

# Check for required API key
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "❌ ANTHROPIC_API_KEY not set in .env"
    echo "   Get your key from: https://console.anthropic.com/"
    exit 1
fi

echo "✅ Environment variables loaded"
echo ""

# Run build test
echo "🔨 Testing build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

echo "✅ Build successful"
echo ""

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo ""
echo "Choose deployment type:"
echo "  1) Preview deployment (test first)"
echo "  2) Production deployment"
echo ""
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        echo "📤 Creating preview deployment..."
        vercel
        ;;
    2)
        echo "📤 Creating production deployment..."

        # Set environment variables in Vercel
        echo "⚙️  Setting environment variables..."

        echo "$ANTHROPIC_API_KEY" | vercel env add ANTHROPIC_API_KEY production

        if [ ! -z "$STRIPE_SECRET_KEY" ]; then
            echo "$STRIPE_SECRET_KEY" | vercel env add STRIPE_SECRET_KEY production
        fi

        if [ ! -z "$STRIPE_PUBLISHABLE_KEY" ]; then
            echo "$STRIPE_PUBLISHABLE_KEY" | vercel env add STRIPE_PUBLISHABLE_KEY production
        fi

        # Deploy to production
        vercel --prod
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Test your deployment at the URL shown above"
echo "   2. Visit /brunel to test The Brunel Engine"
echo "   3. Complete a test interview to verify report generation"
echo "   4. Set up custom domain in Vercel dashboard (if desired)"
echo ""
echo "📚 Documentation:"
echo "   - Deployment guide: DEPLOY.md"
echo "   - Technical setup: BRUNEL_SETUP.md"
echo ""
