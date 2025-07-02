class GuitarTuner {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.dataArray = null;
        this.isListening = false;
        this.animationId = null;
        
        // Guitar tuning frequencies (standard tuning)
        this.guitarNotes = [
            { note: 'E', octave: 2, frequency: 82.41, string: 6 },
            { note: 'A', octave: 2, frequency: 110.00, string: 5 },
            { note: 'D', octave: 3, frequency: 146.83, string: 4 },
            { note: 'G', octave: 3, frequency: 196.00, string: 3 },
            { note: 'B', octave: 3, frequency: 246.94, string: 2 },
            { note: 'E', octave: 4, frequency: 329.63, string: 1 }
        ];
        
        // All musical notes for broader detection
        this.noteFrequencies = this.generateNoteFrequencies();
        
        // DOM elements
        this.noteText = document.getElementById('noteText');
        this.octave = document.getElementById('octave');
        this.frequency = document.getElementById('frequency');
        this.needle = document.getElementById('needle');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.statusText = document.getElementById('statusText');
        this.startButton = document.getElementById('startButton');
        this.stopButton = document.getElementById('stopButton');
        this.noteCircle = this.noteText.parentElement;
        
        this.tuningThreshold = 10; // Hz tolerance for "in tune"
        
        this.initEventListeners();
    }
    
    generateNoteFrequencies() {
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const frequencies = [];
        
        // Generate frequencies for octaves 0-8
        for (let octave = 0; octave <= 8; octave++) {
            for (let noteIndex = 0; noteIndex < notes.length; noteIndex++) {
                const frequency = 440 * Math.pow(2, (octave - 4) + (noteIndex - 9) / 12);
                if (frequency >= 20 && frequency <= 20000) { // Human hearing range
                    frequencies.push({
                        note: notes[noteIndex],
                        octave: octave,
                        frequency: frequency
                    });
                }
            }
        }
        
        return frequencies.sort((a, b) => a.frequency - b.frequency);
    }
    
    initEventListeners() {
        this.startButton.addEventListener('click', () => this.startTuning());
        this.stopButton.addEventListener('click', () => this.stopTuning());
        
        // Add click listeners to string items for reference
        document.querySelectorAll('.string-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.string-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                const targetFreq = parseFloat(item.dataset.freq);
                const targetNote = item.dataset.note;
                this.highlightTargetString(targetNote, targetFreq);
            });
        });
    }
    
    async startTuning() {
        try {
            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            
            // Configure analyser
            this.analyser.fftSize = 4096;
            this.analyser.smoothingTimeConstant = 0.8;
            
            // Create microphone source
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.microphone.connect(this.analyser);
            
            // Create data array for frequency analysis
            this.dataArray = new Float32Array(this.analyser.fftSize);
            
            // Update UI
            this.isListening = true;
            this.startButton.disabled = true;
            this.stopButton.disabled = false;
            this.statusText.textContent = 'Listening... Play a string!';
            
            // Start analysis loop
            this.analyze();
            
        } catch (error) {
            console.error('Error accessing microphone:', error);
            this.statusText.textContent = 'Microphone access denied or not available';
            this.statusIndicator.className = 'status-indicator out-of-tune';
        }
    }
    
    stopTuning() {
        this.isListening = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        
        if (this.microphone) {
            this.microphone.disconnect();
            this.microphone = null;
        }
        
        // Reset UI
        this.startButton.disabled = false;
        this.stopButton.disabled = true;
        this.statusText.textContent = 'Click "Start Tuning" to begin';
        this.statusIndicator.className = 'status-indicator';
        this.noteText.textContent = '-';
        this.octave.textContent = '';
        this.frequency.textContent = '0 Hz';
        this.needle.style.left = 'calc(50% - 2px)';
        this.noteCircle.className = 'note-circle';
        
        // Remove active string highlighting
        document.querySelectorAll('.string-item').forEach(item => {
            item.classList.remove('active');
        });
    }
    
    analyze() {
        if (!this.isListening) return;
        
        // Get frequency data
        this.analyser.getFloatTimeDomainData(this.dataArray);
        
        // Detect pitch using autocorrelation
        const pitch = this.detectPitch(this.dataArray, this.audioContext.sampleRate);
        
        if (pitch > 0) {
            this.updateDisplay(pitch);
        } else {
            // No clear pitch detected
            this.statusText.textContent = 'Play a string louder or closer to the microphone';
            this.statusIndicator.className = 'status-indicator';
        }
        
        // Continue analysis
        this.animationId = requestAnimationFrame(() => this.analyze());
    }
    
    detectPitch(buffer, sampleRate) {
        // Autocorrelation pitch detection
        const bufferSize = buffer.length;
        const halfBuffer = Math.floor(bufferSize / 2);
        const correlations = new Float32Array(halfBuffer);
        
        // Calculate autocorrelation
        for (let lag = 0; lag < halfBuffer; lag++) {
            let sum = 0;
            for (let index = 0; index < halfBuffer; index++) {
                const indexLagged = index + lag;
                if (indexLagged < bufferSize) {
                    sum += buffer[index] * buffer[indexLagged];
                }
            }
            correlations[lag] = sum;
        }
        
        // Find the peak (excluding lag 0)
        let maxCorrelation = 0;
        let bestLag = 0;
        
        // Look for peaks starting from a reasonable minimum frequency (80 Hz)
        const minLag = Math.floor(sampleRate / 800); // 800 Hz max
        const maxLag = Math.floor(sampleRate / 80);  // 80 Hz min
        
        for (let lag = minLag; lag < Math.min(maxLag, halfBuffer); lag++) {
            if (correlations[lag] > maxCorrelation) {
                maxCorrelation = correlations[lag];
                bestLag = lag;
            }
        }
        
        // Check if we have a strong enough correlation
        if (maxCorrelation > 0.01 && bestLag > 0) {
            return sampleRate / bestLag;
        }
        
        return -1; // No pitch detected
    }
    
    updateDisplay(detectedFreq) {
        // Find closest note
        const closestNote = this.findClosestNote(detectedFreq);
        
        if (!closestNote) return;
        
        // Calculate cents difference (1200 cents = 1 octave)
        const centsOff = 1200 * Math.log2(detectedFreq / closestNote.frequency);
        
        // Update display
        this.noteText.textContent = closestNote.note;
        this.octave.textContent = closestNote.octave;
        this.frequency.textContent = `${detectedFreq.toFixed(1)} Hz`;
        
        // Update needle position (-50 to +50 cents for display)
        const needlePosition = Math.max(-50, Math.min(50, centsOff));
        const needlePercent = 50 + (needlePosition / 50) * 25; // 25% to 75% range
        this.needle.style.left = `calc(${needlePercent}% - 2px)`;
        
        // Determine if in tune
        const isInTune = Math.abs(centsOff) < 10; // 10 cents tolerance
        
        // Update visual feedback
        if (isInTune) {
            this.noteCircle.className = 'note-circle in-tune';
            this.statusIndicator.className = 'status-indicator in-tune';
            this.statusText.textContent = '🎯 Perfect! In Tune!';
            
            // Highlight matching guitar string
            this.highlightMatchingString(closestNote);
        } else {
            this.noteCircle.className = 'note-circle out-of-tune';
            this.statusIndicator.className = 'status-indicator out-of-tune';
            
            if (centsOff > 0) {
                this.statusText.textContent = `📈 Too Sharp (+${Math.abs(centsOff).toFixed(0)} cents)`;
            } else {
                this.statusText.textContent = `📉 Too Flat (${Math.abs(centsOff).toFixed(0)} cents)`;
            }
            
            // Remove string highlighting when out of tune
            document.querySelectorAll('.string-item').forEach(item => {
                item.classList.remove('active');
            });
        }
    }
    
    findClosestNote(frequency) {
        let closestNote = null;
        let minDifference = Infinity;
        
        for (const note of this.noteFrequencies) {
            const difference = Math.abs(frequency - note.frequency);
            if (difference < minDifference) {
                minDifference = difference;
                closestNote = note;
            }
        }
        
        // Only return if reasonably close (within 50 Hz)
        return (minDifference < 50) ? closestNote : null;
    }
    
    highlightMatchingString(detectedNote) {
        document.querySelectorAll('.string-item').forEach(item => {
            const stringNote = item.dataset.note;
            const stringFreq = parseFloat(item.dataset.freq);
            
            // Check if this string matches the detected note (within 5 Hz)
            if (stringNote === detectedNote.note && Math.abs(stringFreq - detectedNote.frequency) < 5) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    highlightTargetString(note, frequency) {
        this.statusText.textContent = `🎯 Target: ${note} (${frequency} Hz)`;
    }
}

// Initialize the tuner when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check for browser support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        document.getElementById('statusText').textContent = 'Your browser does not support microphone access';
        document.getElementById('startButton').disabled = true;
        return;
    }
    
    if (!window.AudioContext && !window.webkitAudioContext) {
        document.getElementById('statusText').textContent = 'Your browser does not support Web Audio API';
        document.getElementById('startButton').disabled = true;
        return;
    }
    
    // Initialize the tuner
    new GuitarTuner();
    
    // Add some visual enhancements
    addVisualEnhancements();
});

function addVisualEnhancements() {
    // Add subtle animations to string items
    const stringItems = document.querySelectorAll('.string-item');
    stringItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('fade-in');
    });
    
    // Add CSS animation class
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            animation: fadeInUp 0.6s ease-out forwards;
            opacity: 0;
            transform: translateY(20px);
        }
        
        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .string-item:hover .string-note {
            transform: scale(1.1);
            transition: transform 0.2s ease;
        }
        
        .pulse {
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

// Add some helpful utility functions
function frequencyToNote(frequency) {
    const A4 = 440;
    const C0 = A4 * Math.pow(2, -4.75);
    
    if (frequency > C0) {
        const h = Math.round(12 * Math.log2(frequency / C0));
        const octave = Math.floor(h / 12);
        const n = h % 12;
        return {
            note: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][n],
            octave: octave
        };
    }
    return null;
}

// Error handling for audio context issues
window.addEventListener('error', (e) => {
    if (e.message.includes('AudioContext') || e.message.includes('getUserMedia')) {
        document.getElementById('statusText').textContent = 'Audio initialization failed. Please refresh and try again.';
    }
});

// Handle page visibility changes to pause/resume
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is now hidden, you might want to pause the tuner
        console.log('Page hidden - tuner continues running');
    } else {
        // Page is now visible
        console.log('Page visible - tuner active');
    }
});