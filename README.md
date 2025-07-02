# 🎸 Guitar Tuner Pro

A professional, real-time guitar tuner web application built with vanilla JavaScript, Web Audio API, and advanced pitch detection algorithms.

![Guitar Tuner Pro](https://img.shields.io/badge/Guitar%20Tuner-Pro-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Web Audio API](https://img.shields.io/badge/Web%20Audio%20API-✓-orange)

## ✨ Features

- **Real-time pitch detection** using autocorrelation algorithm
- **Visual tuning meter** with needle indicator
- **Standard guitar tuning** reference (E-A-D-G-B-E)
- **Cents precision** for accurate tuning
- **Responsive design** for desktop and mobile
- **Modern UI** with dark theme and smooth animations
- **Browser-based** - no downloads required
- **Microphone access** for live audio input

## 🚀 Quick Start

### Option 1: Run Locally

1. **Clone or download** this repository
2. **Open** `index.html` in a modern web browser
3. **Allow microphone access** when prompted
4. **Click "Start Tuning"** and play your guitar!

### Option 2: Use Development Server

```bash
# Install dependencies
npm install

# Start local server
npm start
```

The app will open at `http://localhost:8080`

### Option 3: Node.js Server

```bash
# Run with Node.js
node server.js
```

## 📱 How to Use

1. **Click "Start Tuning"** to activate the microphone
2. **Play a guitar string** near your device
3. **Watch the display** to see the detected note and frequency
4. **Use the tuning meter** to see if you're sharp (♯) or flat (♭)
5. **Tune your guitar** until the needle is centered and shows green
6. **Click on string references** to see target frequencies

### Visual Indicators

- **Green circle & needle**: Perfect tune! ✅
- **Red circle & needle**: Out of tune ❌
- **Needle left**: Too flat (♭) - tune up
- **Needle right**: Too sharp (♯) - tune down

## 🎯 Standard Guitar Tuning

| String | Note | Frequency |
|--------|------|-----------|
| 1st (E) | E4 | 329.6 Hz |
| 2nd (B) | B3 | 246.9 Hz |
| 3rd (G) | G3 | 196.0 Hz |
| 4th (D) | D3 | 146.8 Hz |
| 5th (A) | A2 | 110.0 Hz |
| 6th (E) | E2 | 82.4 Hz |

## 🔧 Technical Details

### Audio Processing
- **Sample Rate**: 44.1 kHz
- **FFT Size**: 4096 samples
- **Analysis Method**: Autocorrelation for pitch detection
- **Frequency Range**: 80-800 Hz (guitar range)
- **Accuracy**: ±10 cents tolerance

### Browser Compatibility
- ✅ **Chrome 66+**
- ✅ **Firefox 60+**
- ✅ **Safari 11.1+**
- ✅ **Edge 79+**

**Requirements:**
- Web Audio API support
- MediaDevices.getUserMedia() support
- Microphone access permission

## 🚀 Deployment Options

### GitHub Pages
```bash
# Deploy to GitHub Pages
npm run deploy
```

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.` (root)
4. Deploy automatically on push

### Heroku
```bash
# Add to package.json scripts
"start": "node server.js"

# Deploy to Heroku
heroku create your-app-name
git push heroku main
```

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🎵 Advanced Features

### Pitch Detection Algorithm
The app uses a sophisticated autocorrelation algorithm that:
- Analyzes audio samples in real-time
- Calculates pitch with high accuracy
- Filters out noise and harmonics
- Provides cents-level precision

### Visual Feedback
- **Gradient animations** for engaging UI
- **Real-time needle movement** for precise tuning
- **Color-coded indicators** for quick reference
- **Responsive design** for all devices

## 🔐 Privacy & Security

- **No data collection** - everything runs locally
- **Microphone access** only for audio analysis
- **No audio recording** - only real-time processing
- **No external dependencies** for core functionality

## 🛠️ Development

### File Structure
```
guitar-tuner-pro/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and animations
├── tuner.js           # Core tuning logic and Web Audio API
├── server.js          # Node.js server for deployment
├── package.json       # Node.js dependencies and scripts
└── README.md         # This file
```

### Key Components
- **GuitarTuner class**: Main application logic
- **Pitch detection**: Autocorrelation algorithm
- **UI updates**: Real-time visual feedback
- **Audio processing**: Web Audio API integration

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, fork the repository, and create pull requests.

### Ideas for Improvements
- Add alternative tuning modes (Drop D, DADGAD, etc.)
- Implement chord detection
- Add metronome functionality
- Support for other instruments
- Add audio recording capabilities

## 📞 Support

If you encounter any issues:
1. Check browser compatibility
2. Ensure microphone permissions are granted
3. Try refreshing the page
4. Check console for error messages

---

**Made with ❤️ for musicians everywhere** 🎸

*Perfect for guitar players, music students, and anyone who wants to keep their instrument in tune!*