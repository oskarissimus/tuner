// Guitar Tuner Application
class GuitarTuner {
    constructor() {
        this.currentNote = 'G';
        this.currentCents = 5; // Slightly sharp
        this.isActive = false;
        this.animationId = null;
        
        // Standard guitar tuning frequencies (Hz)
        this.standardTuning = {
            'E2': 82.41,  // Low E
            'A2': 110.00, // A
            'D3': 146.83, // D
            'G3': 196.00, // G
            'B3': 246.94, // B
            'E4': 329.63  // High E
        };
        
        // Notes in chromatic order
        this.chromaticNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateNeedlePosition();
        this.startTunerSimulation();
    }
    
    setupEventListeners() {
        // Note wheel interaction
        const noteItems = document.querySelectorAll('.note-item');
        noteItems.forEach(item => {
            item.addEventListener('click', (e) => {
                this.selectNote(e.target.textContent);
            });
        });
        
        // String selection
        const stringRows = document.querySelectorAll('.string-row');
        stringRows.forEach((row, index) => {
            row.addEventListener('click', () => {
                this.selectString(index);
            });
        });
        
        // Navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                this.handleNavigation(e.currentTarget);
            });
        });
        
        // Settings icon
        const settingsIcon = document.querySelector('.settings-icon');
        if (settingsIcon) {
            settingsIcon.addEventListener('click', () => {
                this.openSettings();
            });
        }
        
        // Start/stop tuner on gauge click
        const tunerGauge = document.querySelector('.tuner-gauge');
        tunerGauge.addEventListener('click', () => {
            this.toggleTuner();
        });
    }
    
    selectNote(note) {
        this.currentNote = note;
        
        // Update note display
        document.getElementById('current-note').textContent = note;
        
        // Update note wheel active state
        const noteItems = document.querySelectorAll('.note-item');
        noteItems.forEach(item => {
            item.classList.remove('active');
            if (item.textContent === note) {
                item.classList.add('active');
            }
        });
        
        // Simulate new tuning for selected note
        this.simulateNewNote();
    }
    
    selectString(stringIndex) {
        const stringNames = ['E4', 'B3', 'G3', 'D3', 'A2', 'E2'];
        const noteNames = ['E', 'B', 'G', 'D', 'A', 'E'];
        
        // Remove previous active states
        document.querySelectorAll('.string-row').forEach(row => {
            row.classList.remove('active-string');
        });
        document.querySelectorAll('.string-line').forEach(line => {
            line.classList.remove('active');
        });
        
        // Set new active string
        const selectedRow = document.querySelectorAll('.string-row')[stringIndex];
        const selectedLine = document.querySelectorAll('.string-line')[stringIndex];
        
        selectedRow.classList.add('active-string');
        selectedLine.classList.add('active');
        
        // Update current note
        this.selectNote(noteNames[stringIndex]);
    }
    
    updateNeedlePosition() {
        const needle = document.getElementById('tuner-needle');
        if (needle) {
            // Convert cents to rotation angle (-40 to +40 cents = -36deg to +36deg)
            const angle = (this.currentCents / 40) * 36;
            needle.style.transform = `translateX(-50%) rotate(${angle}deg)`;
        }
    }
    
    simulateNewNote() {
        // Simulate random tuning offset for new note
        this.currentCents = (Math.random() - 0.5) * 60; // -30 to +30 cents
        this.updateNeedlePosition();
    }
    
    startTunerSimulation() {
        if (this.animationId) return;
        
        const simulate = () => {
            if (this.isActive) {
                // Simulate microphone input and gradual tuning convergence
                const targetCents = 0;
                const diff = targetCents - this.currentCents;
                this.currentCents += diff * 0.02; // Gradual convergence
                
                // Add small random fluctuations
                this.currentCents += (Math.random() - 0.5) * 2;
                
                // Clamp to realistic range
                this.currentCents = Math.max(-50, Math.min(50, this.currentCents));
                
                this.updateNeedlePosition();
                this.updateTuningStatus();
            } else {
                // When inactive, add more random movement
                this.currentCents += (Math.random() - 0.5) * 4;
                this.currentCents = Math.max(-50, Math.min(50, this.currentCents));
                this.updateNeedlePosition();
            }
            
            this.animationId = requestAnimationFrame(simulate);
        };
        
        simulate();
    }
    
    updateTuningStatus() {
        const digitalDisplay = document.querySelector('.digital-display');
        const needle = document.getElementById('tuner-needle');
        
        if (Math.abs(this.currentCents) < 5) {
            // In tune
            digitalDisplay.style.background = 'radial-gradient(circle, #00FF00 0%, #008B00 70%, #2D0A0A 100%)';
            needle.style.background = '#00AA00';
        } else if (Math.abs(this.currentCents) < 15) {
            // Close to tune
            digitalDisplay.style.background = 'radial-gradient(circle, #FFAA00 0%, #AA6600 70%, #2D0A0A 100%)';
            needle.style.background = '#AA6600';
        } else {
            // Out of tune
            digitalDisplay.style.background = 'radial-gradient(circle, #FF0000 0%, #8B0000 70%, #2D0A0A 100%)';
            needle.style.background = '#2D0A0A';
        }
    }
    
    toggleTuner() {
        this.isActive = !this.isActive;
        
        const gaugeCenter = document.querySelector('.gauge-center');
        if (this.isActive) {
            gaugeCenter.style.transform = 'translate(-50%, -50%) scale(1.05)';
            gaugeCenter.style.transition = 'transform 0.3s ease';
        } else {
            gaugeCenter.style.transform = 'translate(-50%, -50%) scale(1)';
        }
        
        // Reset transition after animation
        setTimeout(() => {
            gaugeCenter.style.transition = '';
        }, 300);
    }
    
    handleNavigation(navItem) {
        // Remove active state from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active state to clicked item
        navItem.classList.add('active');
        
        // Get the navigation label
        const label = navItem.querySelector('.nav-label').textContent;
        
        // Handle different navigation options
        switch(label) {
            case 'Tuner':
                // Already on tuner page
                break;
            case 'Settings':
                this.openSettings();
                break;
            case 'Favorites':
                this.showFavorites();
                break;
            case 'Academy':
                this.showAcademy();
                break;
        }
    }
    
    openSettings() {
        // Simulate settings panel
        const overlay = document.createElement('div');
        overlay.className = 'settings-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        const panel = document.createElement('div');
        panel.style.cssText = `
            background: linear-gradient(180deg, #8B1A1A 0%, #2D0A0A 100%);
            padding: 30px;
            border-radius: 15px;
            border: 3px solid #D4AF37;
            color: #D4AF37;
            text-align: center;
            max-width: 300px;
            width: 90%;
        `;
        
        panel.innerHTML = `
            <h2 style="margin-bottom: 20px; font-size: 24px;">Settings</h2>
            <div style="margin-bottom: 15px;">
                <label>Tuning Mode:</label>
                <select style="margin-left: 10px; padding: 5px; background: #4A1810; color: #D4AF37; border: 1px solid #D4AF37;">
                    <option>Standard</option>
                    <option>Drop D</option>
                    <option>Open G</option>
                </select>
            </div>
            <div style="margin-bottom: 20px;">
                <label>Sensitivity:</label>
                <input type="range" min="1" max="10" value="5" style="margin-left: 10px;">
            </div>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="padding: 10px 20px; background: #D4AF37; color: #2D0A0A; border: none; border-radius: 5px; cursor: pointer;">
                Close
            </button>
        `;
        
        overlay.appendChild(panel);
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }
    
    showFavorites() {
        alert('Favorites feature coming soon!');
    }
    
    showAcademy() {
        alert('Academy feature coming soon!');
    }
    
    // Utility method to get note frequency
    getNoteFrequency(note, octave = 4) {
        const noteIndex = this.chromaticNotes.indexOf(note);
        const A4 = 440; // Reference frequency
        const semitoneRatio = Math.pow(2, 1/12);
        
        // Calculate frequency relative to A4
        const semitonesFromA4 = (octave - 4) * 12 + (noteIndex - 9);
        return A4 * Math.pow(semitoneRatio, semitonesFromA4);
    }
}

// Initialize the tuner when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const tuner = new GuitarTuner();
    
    // Add some interactive features
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case ' ':
                e.preventDefault();
                tuner.toggleTuner();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                // Previous note in chromatic scale
                const currentIndex = tuner.chromaticNotes.indexOf(tuner.currentNote);
                const prevIndex = (currentIndex - 1 + tuner.chromaticNotes.length) % tuner.chromaticNotes.length;
                tuner.selectNote(tuner.chromaticNotes[prevIndex]);
                break;
            case 'ArrowRight':
                e.preventDefault();
                // Next note in chromatic scale
                const currIndex = tuner.chromaticNotes.indexOf(tuner.currentNote);
                const nextIndex = (currIndex + 1) % tuner.chromaticNotes.length;
                tuner.selectNote(tuner.chromaticNotes[nextIndex]);
                break;
        }
    });
    
    // Add touch support for mobile
    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                // Swipe up - increase pitch
                tuner.currentCents = Math.min(50, tuner.currentCents + 10);
            } else {
                // Swipe down - decrease pitch
                tuner.currentCents = Math.max(-50, tuner.currentCents - 10);
            }
            tuner.updateNeedlePosition();
        }
    });
});

// Add some CSS for the settings overlay if it doesn't exist
const style = document.createElement('style');
style.textContent = `
    .settings-overlay {
        backdrop-filter: blur(5px);
    }
    
    .settings-overlay button:hover {
        background: #F4E4BC !important;
        transform: scale(1.05);
        transition: all 0.2s ease;
    }
    
    .settings-overlay select:focus,
    .settings-overlay input:focus {
        outline: 2px solid #D4AF37;
    }
`;
document.head.appendChild(style);