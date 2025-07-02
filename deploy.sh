#!/bin/bash

# Guitar Tuner Pro Deployment Script
echo "🎸 Guitar Tuner Pro - Deployment Script"
echo "========================================"

# Function to display menu
show_menu() {
    echo ""
    echo "Choose deployment option:"
    echo "1) Test locally (Node.js server)"
    echo "2) Test with simple HTTP server"
    echo "3) Deploy to GitHub Pages"
    echo "4) Deploy to Netlify (manual)"
    echo "5) Deploy to Vercel"
    echo "6) Show deployment info"
    echo "7) Exit"
    echo ""
}

# Function to test locally with Node.js
test_local() {
    echo "🚀 Starting local Node.js server..."
    echo "📱 Make sure to allow microphone access!"
    echo "🌐 Opening http://localhost:8080"
    echo "💡 Press Ctrl+C to stop the server"
    echo ""
    node server.js
}

# Function to test with simple HTTP server
test_http() {
    echo "🚀 Starting simple HTTP server..."
    echo "📱 Make sure to allow microphone access!"
    echo "🌐 Opening http://localhost:8080"
    echo "💡 Press Ctrl+C to stop the server"
    echo ""
    if command -v python3 &> /dev/null; then
        python3 -m http.server 8080
    elif command -v python &> /dev/null; then
        python -m SimpleHTTPServer 8080
    elif command -v npx &> /dev/null; then
        npx http-server . -p 8080 -o
    else
        echo "❌ No suitable HTTP server found"
        echo "💡 Install Python or Node.js to run a local server"
    fi
}

# Function to deploy to GitHub Pages
deploy_github() {
    echo "🚀 Deploying to GitHub Pages..."
    
    if [ ! -d ".git" ]; then
        echo "❌ Not a git repository. Initialize git first:"
        echo "   git init"
        echo "   git add ."
        echo "   git commit -m 'Initial commit'"
        echo "   git remote add origin <your-repo-url>"
        echo "   git push -u origin main"
        return
    fi
    
    if command -v npm &> /dev/null; then
        npm install
        npm run deploy
        echo "✅ Deployed to GitHub Pages!"
        echo "🌐 Your app will be available at: https://yourusername.github.io/your-repo-name"
    else
        echo "❌ npm not found. Install Node.js first."
    fi
}

# Function to show deployment info
show_info() {
    echo "📋 Deployment Information"
    echo "========================"
    echo ""
    echo "📁 Files needed for deployment:"
    echo "   ✅ index.html (Main app)"
    echo "   ✅ styles.css (Styling)"
    echo "   ✅ tuner.js (JavaScript logic)"
    echo "   ✅ server.js (Node.js server - optional)"
    echo ""
    echo "🌐 Platform-specific instructions:"
    echo ""
    echo "📘 GitHub Pages:"
    echo "   1. Push code to GitHub repository"
    echo "   2. Run: npm run deploy"
    echo "   3. Enable GitHub Pages in repository settings"
    echo ""
    echo "🟢 Netlify:"
    echo "   1. Drag and drop folder to netlify.com/drop"
    echo "   2. Or connect GitHub repository"
    echo "   3. Build command: (leave empty)"
    echo "   4. Publish directory: . (root)"
    echo ""
    echo "▲ Vercel:"
    echo "   1. Install: npm i -g vercel"
    echo "   2. Run: vercel --prod"
    echo "   3. Follow prompts"
    echo ""
    echo "🟣 Heroku:"
    echo "   1. Add Procfile: echo 'web: node server.js' > Procfile"
    echo "   2. heroku create your-app-name"
    echo "   3. git push heroku main"
    echo ""
    echo "🔧 Requirements:"
    echo "   - Modern browser with Web Audio API"
    echo "   - Microphone access permission"
    echo "   - HTTPS for microphone access (in production)"
}

# Function to deploy to Vercel
deploy_vercel() {
    echo "🚀 Deploying to Vercel..."
    
    if command -v vercel &> /dev/null; then
        vercel --prod
        echo "✅ Deployed to Vercel!"
    else
        echo "❌ Vercel CLI not found. Install it first:"
        echo "   npm i -g vercel"
        echo "   Then run this script again"
    fi
}

# Main menu loop
while true; do
    show_menu
    read -p "Enter your choice (1-7): " choice
    
    case $choice in
        1)
            test_local
            ;;
        2)
            test_http
            ;;
        3)
            deploy_github
            ;;
        4)
            echo "🟢 Netlify Deployment (Manual):"
            echo "================================"
            echo "1. Go to https://netlify.com"
            echo "2. Drag and drop this entire folder"
            echo "3. Or connect your GitHub repository"
            echo "4. Your app will be live instantly!"
            echo ""
            echo "💡 For custom domain: Go to Domain settings in Netlify dashboard"
            ;;
        5)
            deploy_vercel
            ;;
        6)
            show_info
            ;;
        7)
            echo "👋 Thanks for using Guitar Tuner Pro!"
            echo "🎸 Happy tuning!"
            exit 0
            ;;
        *)
            echo "❌ Invalid option. Please choose 1-7."
            ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
done