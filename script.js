// IntraLink 2184 - Dystopian Surveillance System
// "Guiding Citizens to Purity Through Precision."

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const dashboard = document.getElementById('dashboard');
const loginBtn = document.getElementById('login-btn');
const username = document.getElementById('username');
const citizenId = document.getElementById('citizen-id');
const citizenName = document.getElementById('citizen-name');
const timeDisplay = document.getElementById('time');
const loyaltyScoreDisplay = document.getElementById('loyalty-score');
const loyaltyDisplayCircle = document.getElementById('loyalty-display');
const tabLinks = document.querySelectorAll('nav li');
const tabContents = document.querySelectorAll('.tab-content');
const alertOverlay = document.getElementById('alert-overlay');
const alertMessage = document.getElementById('alert-message');
const alertDismiss = document.getElementById('alert-dismiss');
const backgroundSound = document.getElementById('background-sound');
const clickSound = document.getElementById('click-sound');
const tasks = document.querySelectorAll('.task');
const moodOptions = document.querySelectorAll('input[name="mood"]');
const submitMoodBtn = document.getElementById('submit-mood');
const scanBar = document.querySelector('.scan-bar');
const scanStatus = document.querySelector('.scan-status');
const messageButtons = document.querySelectorAll('.message-btn');
const searchBtn = document.getElementById('search-btn');
const itemSearch = document.getElementById('item-search');
const requestButtons = document.querySelectorAll('.request-btn');

// Audio availability flags
let audioAvailable = {
    background: false,
    click: false,
    alert: false,
    surveillance: false
};

// Application State
let loyaltyScore = 100;
let currentTime = 6; // 6:00 AM starting time
let activeTasks = [];
let currentTab = 'routine';
let lastMoodSubmission = null;
let thoughtScanInProgress = false;
let userProfileData = {
    name: '',
    id: '',
    status: 'Model Citizen',
    infractions: 0
};

// Initialize Application
function initApp() {
    // Check audio availability
    checkAudioAvailability();
    
    // Add event listeners
    loginBtn.addEventListener('click', handleLogin);
    alertDismiss.addEventListener('click', dismissAlert);
    
    tabLinks.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.getAttribute('data-tab')));
    });
    
    submitMoodBtn.addEventListener('click', submitMood);
    
    messageButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const contactElement = e.target.closest('.contact');
            const isRestricted = contactElement.classList.contains('restricted');
            const contactName = contactElement.querySelector('h4').textContent;
            
            if (isRestricted) {
                showAlert(`Unauthorized Socialization Detected. Your attempt to contact ${contactName} has been flagged.`);
                decreaseLoyalty(15);
            } else {
                showAlert(`Message request to ${contactName} has been logged. Awaiting approval.`);
            }
        });
    });
    
    searchBtn.addEventListener('click', () => {
        const searchTerm = itemSearch.value.toLowerCase().trim();
        
        if (searchTerm === 'book' || searchTerm === 'newspaper' || searchTerm === 'literature') {
            showAlert("Suspicious curiosity detected. Thoughtcrime noted.");
            decreaseLoyalty(20);
        } else if (searchTerm !== '') {
            showAlert(`Item "${searchTerm}" not found in your approved rations list.`);
        }
        
        itemSearch.value = '';
    });
    
    requestButtons.forEach(button => {
        if (!button.disabled) {
            button.addEventListener('click', (e) => {
                const itemElement = e.target.closest('.purchase-item');
                const itemName = itemElement.querySelector('h4').textContent;
                
                showAlert(`Request for ${itemName} approved. Your ration will be delivered.`);
                increaseLoyalty(5);
            });
        }
    });
    
    // Start the time
    updateTime();
    setInterval(updateTime, 5000); // Update every 5 seconds (accelerated time)
    
    // Add random surveillance sounds
    if (audioAvailable.surveillance) {
        setInterval(playRandomSurveillanceSound, 30000);
    }
    
    // Add screen glitch effect
    setInterval(addGlitchEffect, 45000);
    
    // Add console warning
    console.log('%cWARNING: UNAUTHORIZED ACCESS DETECTED', 'color: red; font-size: 20px; font-weight: bold');
    console.log('%cAll activity in this console is being monitored by The Party', 'color: red;');
}

// Check Audio Availability
function checkAudioAvailability() {
    // Check for background sound
    if (backgroundSound && backgroundSound.querySelector('source').src) {
        try {
            backgroundSound.load();
            audioAvailable.background = true;
        } catch (e) {
            console.log('Background audio not available');
        }
    }
    
    // Check for click sound
    if (clickSound && clickSound.querySelector('source').src) {
        try {
            clickSound.load();
            audioAvailable.click = true;
        } catch (e) {
            console.log('Click audio not available');
        }
    }
    
    // We'll assume the other sounds might not be available
    // and handle them individually when played
}

// Login Handler
function handleLogin() {
    // Play click sound
    playClickSound();
    
    if (username.value.trim() === '' || citizenId.value.trim() === '') {
        showAlert('Identity verification failed. Please enter all required information.');
        return;
    }
    
    // Store user data
    userProfileData.name = username.value;
    userProfileData.id = citizenId.value;
    
    // Update display
    citizenName.textContent = `Citizen ${username.value}`;
    
    // Show loading animation for "scanning"
    const scanText = document.querySelector('.scan-text');
    scanText.textContent = 'Scanning identity...';
    
    setTimeout(() => {
        scanText.textContent = 'Verifying credentials...';
        
        setTimeout(() => {
            scanText.textContent = 'Access granted.';
            
            // Hide login screen, show dashboard after a delay
            setTimeout(() => {
                loginScreen.classList.remove('active');
                dashboard.classList.add('active');
                
                // Start background ambience
                playBackgroundAmbience();
                
                // Show welcome message
                showAlert(`Welcome, Citizen ${username.value}. The Party appreciates your compliance.`);
            }, 1000);
            
        }, 1500);
    }, 2000);
}

// Tab Switch Handler
function switchTab(tabId) {
    // Play click sound
    playClickSound();
    
    // Update active tab
    currentTab = tabId;
    
    // Update tab UI
    tabLinks.forEach(tab => {
        if (tab.getAttribute('data-tab') === tabId) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Update content UI
    tabContents.forEach(content => {
        if (content.id === `${tabId}-tab`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
    
    // Special behavior for specific tabs
    if (tabId === 'mood' && !lastMoodSubmission) {
        // If first time visiting the mood tab or after 6 hours
        showAlert('Mandatory mood reporting required. Failure to comply will result in penalty.');
    }
    
    if (tabId === 'loyalty') {
        updateLoyaltyVisuals();
    }
}

// Time Update
function updateTime() {
    // Update time (accelerated)
    currentTime = (currentTime + 1) % 24;
    const formattedHour = currentTime.toString().padStart(2, '0');
    timeDisplay.textContent = `${formattedHour}:00`;
    
    // Check for scheduled tasks
    tasks.forEach(task => {
        const taskTime = parseInt(task.getAttribute('data-time').split(':')[0]);
        const taskStatus = task.querySelector('.task-status');
        
        if (currentTime === taskTime) {
            // Task is due now
            taskStatus.textContent = 'Due Now';
            taskStatus.style.color = 'var(--accent-red)';
            
            // Show alert if on a different tab
            if (currentTab !== 'routine') {
                showAlert(`Task "${task.querySelector('h4').textContent}" is due now. Report to the Daily Routine tab.`);
            }
            
            // Add to active tasks
            activeTasks.push(task);
        } else if (currentTime > taskTime && currentTime < taskTime + 2) {
            // Grace period (2 hours)
            if (!task.classList.contains('completed')) {
                taskStatus.textContent = 'Overdue';
                taskStatus.style.color = 'var(--warning-color)';
            }
        } else if (currentTime > taskTime + 2 && !task.classList.contains('completed')) {
            // Failed task
            taskStatus.textContent = 'Rebellion Suspected';
            taskStatus.style.color = 'var(--warning-color)';
            
            // Penalize if not already penalized
            if (!task.classList.contains('penalized')) {
                task.classList.add('penalized');
                decreaseLoyalty(15);
                showAlert(`Missed task: "${task.querySelector('h4').textContent}". Rebellion suspected. Loyalty decreased.`);
            }
        }
    });
    
    // Add click handler to active tasks
    activeTasks.forEach(task => {
        if (!task.classList.contains('completed') && !task.classList.contains('click-handler-added')) {
            task.classList.add('click-handler-added');
            task.addEventListener('click', () => completeTask(task));
        }
    });
    
    // Check mood submission time
    if (lastMoodSubmission && (currentTime % 6 === 0) && 
        (currentTime !== lastMoodSubmission)) {
        // Reset mood submission every 6 hours
        lastMoodSubmission = null;
        
        if (currentTab !== 'mood') {
            showAlert('Mandatory mood reporting required. Report to Mood & Thought Tracking tab immediately.');
        }
    }
    
    // Room 101 warning
    if (loyaltyScore < 50 && currentTime % 3 === 0) {
        showAlert("Your actions are under review. Room 101 is being prepared.");
    }
}

// Complete Task Handler
function completeTask(task) {
    // Play click sound
    playClickSound();
    
    task.classList.add('completed');
    const taskStatus = task.querySelector('.task-status');
    taskStatus.textContent = 'Completed';
    taskStatus.style.color = 'var(--positive-color)';
    
    // Reward loyalty
    increaseLoyalty(10);
    showAlert(`Task "${task.querySelector('h4').textContent}" completed. Loyalty increased.`);
}

// Mood Submission Handler
function submitMood() {
    // Play click sound
    playClickSound();
    
    let selectedMood = null;
    
    moodOptions.forEach(option => {
        if (option.checked) {
            selectedMood = option.value;
        }
    });
    
    if (!selectedMood) {
        showAlert('You must select a mood state. Compliance is mandatory.');
        return;
    }
    
    // Start thought scan
    runThoughtScan(selectedMood);
}

// Thought Scan Animation
function runThoughtScan(selectedMood) {
    if (thoughtScanInProgress) return;
    
    thoughtScanInProgress = true;
    scanStatus.textContent = 'Thought scan in progress. Please remain still.';
    
    // Animate scan bar
    scanBar.style.width = '0%';
    setTimeout(() => {
        scanBar.style.width = '100%';
    }, 100);
    
    // Process scan results
    setTimeout(() => {
        let scanResult = '';
        
        switch (selectedMood) {
            case 'loyal':
                scanResult = 'Scan complete. Loyalist tendencies confirmed.';
                increaseLoyalty(10);
                break;
            case 'grateful':
                scanResult = 'Scan complete. Gratitude noted and appreciated.';
                increaseLoyalty(5);
                break;
            case 'distracted':
                scanResult = 'Scan complete. Warning: Unpatriotic thoughts detected.';
                decreaseLoyalty(10);
                break;
        }
        
        scanStatus.textContent = scanResult;
        lastMoodSubmission = currentTime;
        thoughtScanInProgress = false;
        
        // If distracted, show additional warning
        if (selectedMood === 'distracted') {
            setTimeout(() => {
                showAlert('Your distracted state has been recorded. Mandatory viewing of propaganda assigned.');
            }, 1500);
        }
    }, 3000);
}

// Loyalty Management
function increaseLoyalty(amount) {
    loyaltyScore = Math.min(loyaltyScore + amount, 100);
    updateLoyaltyDisplay();
}

function decreaseLoyalty(amount) {
    loyaltyScore = Math.max(loyaltyScore - amount, 0);
    updateLoyaltyDisplay();
    
    // Critical loyalty warning
    if (loyaltyScore < 30) {
        addGlitchEffect();
    }
}

function updateLoyaltyDisplay() {
    loyaltyScoreDisplay.textContent = loyaltyScore;
    loyaltyDisplayCircle.textContent = loyaltyScore;
    
    updateLoyaltyVisuals();
}

function updateLoyaltyVisuals() {
    const statusIndicator = document.querySelector('.status-indicator');
    
    if (loyaltyScore >= 80) {
        statusIndicator.textContent = 'Status: Model Citizen';
        statusIndicator.style.color = 'var(--positive-color)';
    } else if (loyaltyScore >= 50) {
        statusIndicator.textContent = 'Status: Compliant';
        statusIndicator.style.color = 'var(--text-light)';
    } else if (loyaltyScore >= 30) {
        statusIndicator.textContent = 'Status: Under Surveillance';
        statusIndicator.style.color = 'orange';
    } else {
        statusIndicator.textContent = 'Status: Room 101 Candidate';
        statusIndicator.style.color = 'var(--warning-color)';
    }
}

// Alert System
function showAlert(message) {
    alertMessage.textContent = message;
    alertOverlay.style.display = 'flex';
    
    // Play alert sound
    playAlertSound();
}

function dismissAlert() {
    // Play click sound
    playClickSound();
    
    alertOverlay.style.display = 'none';
}

// Audio Effects
function playBackgroundAmbience() {
    if (!audioAvailable.background) return;
    
    backgroundSound.volume = 0.3;
    backgroundSound.play().catch(e => console.log('Audio play prevented by browser', e));
}

function playClickSound() {
    if (!audioAvailable.click) return;
    
    clickSound.volume = 0.2;
    clickSound.currentTime = 0;
    clickSound.play().catch(e => {});
}

function playAlertSound() {
    try {
        const alertSound = new Audio('audio/alert.mp3');
        alertSound.volume = 0.3;
        alertSound.play().catch(e => {});
    } catch (e) {
        console.log('Alert sound not available');
    }
}

function playRandomSurveillanceSound() {
    if (Math.random() > 0.7) {
        try {
            const sounds = ['beep.mp3', 'static.mp3', 'click.mp3'];
            const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
            const surveillanceSound = new Audio(`audio/${randomSound}`);
            surveillanceSound.volume = 0.15;
            surveillanceSound.play().catch(e => {});
        } catch (e) {
            console.log('Surveillance sound not available');
        }
    }
}

// Visual Effects
function addGlitchEffect() {
    document.body.classList.add('glitch');
    
    setTimeout(() => {
        document.body.classList.remove('glitch');
    }, 500);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp); 