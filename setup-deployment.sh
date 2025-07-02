#!/bin/bash

# Pro Guitar Tuner - Automated Vercel Deployment Setup
echo "🎸 Setting up Pro Guitar Tuner for Vercel deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Initializing git repository...${NC}"
    git init
    git add .
    git commit -m "Initial commit - Pro Guitar Tuner"
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Installing Vercel CLI...${NC}"
    npm install -g vercel
fi

echo -e "${BLUE}Deployment Options:${NC}"
echo "1. Quick Deploy (Manual)"
echo "2. GitHub + Vercel Integration (Automated)"
echo "3. Environment Setup Only"

read -p "Choose deployment method (1-3): " choice

case $choice in
    1)
        echo -e "${GREEN}Starting quick deployment...${NC}"
        echo "Please run: vercel login"
        echo "Then run: vercel --prod"
        ;;
    2)
        echo -e "${GREEN}Setting up GitHub integration...${NC}"
        echo "📋 Setup Instructions:"
        echo ""
        echo "1. Push this code to GitHub:"
        echo "   git remote add origin https://github.com/YOUR_USERNAME/pro-guitar-tuner.git"
        echo "   git push -u origin main"
        echo ""
        echo "2. Go to vercel.com and:"
        echo "   - Sign in with GitHub"
        echo "   - Import your repository"
        echo "   - Deploy automatically"
        echo ""
        echo "3. For GitHub Actions (optional):"
        echo "   - Go to GitHub repo Settings > Secrets"
        echo "   - Add VERCEL_TOKEN (get from vercel.com/account/tokens)"
        echo "   - Push code to trigger automatic deployment"
        ;;
    3)
        echo -e "${GREEN}Environment setup complete!${NC}"
        echo "All configuration files are ready."
        echo "Run this script again to deploy."
        ;;
    *)
        echo -e "${RED}Invalid option. Please run the script again.${NC}"
        ;;
esac

echo ""
echo -e "${GREEN}🚀 Your Pro Guitar Tuner is ready for deployment!${NC}"
echo -e "${BLUE}Project files:${NC}"
ls -la | grep -E "\.(html|css|js|json|md)$"

echo ""
echo -e "${YELLOW}Need help? Check deploy.md for detailed instructions.${NC}"