// Initialize configuration
const config = window.VALENTINE_CONFIG;

// Validate configuration
function validateConfig() {
    const warnings = [];

    // Check required fields
    if (!config.valentineName) {
        warnings.push("Valentine's name is not set! Using default.");
        config.valentineName = "My Love";
    }

    // Validate colors
    const isValidHex = (hex) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    Object.entries(config.colors).forEach(([key, value]) => {
        if (!isValidHex(value)) {
            warnings.push(`Invalid color for ${key}! Using default.`);
            config.colors[key] = getDefaultColor(key);
        }
    });

    // Validate animation values
    if (parseFloat(config.animations.floatDuration) < 5) {
        warnings.push("Float duration too short! Setting to 5s minimum.");
        config.animations.floatDuration = "5s";
    }

    if (config.animations.heartExplosionSize < 1 || config.animations.heartExplosionSize > 3) {
        warnings.push("Heart explosion size should be between 1 and 3! Using default.");
        config.animations.heartExplosionSize = 1.5;
    }

    // Log warnings if any
    if (warnings.length > 0) {
        console.warn("⚠️ Configuration Warnings:");
        warnings.forEach(warning => console.warn("- " + warning));
    }
}

// Default color values
function getDefaultColor(key) {
    const defaults = {
        backgroundStart: "#ffafbd",
        backgroundEnd: "#ffc3a0",
        buttonBackground: "#ff6b6b",
        buttonHover: "#ff8787",
        textColor: "#ff4757"
    };
    return defaults[key];
}

// Set page title
document.title = config.pageTitle;

// Initialize the page content when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    // Validate configuration first
    validateConfig();

    // Set texts from config
    document.getElementById('valentineTitle').textContent = `${config.valentineName}, beautiful...`;
    
    // Set first question texts
    document.getElementById('question1Text').textContent = config.questions.first.text;
    document.getElementById('yesBtn1').textContent = config.questions.first.yesBtn;
    document.getElementById('noBtn1').textContent = config.questions.first.noBtn;
    
    // Set second question texts
    document.getElementById('question2Text').textContent = config.questions.second.text;
    document.getElementById('startText').textContent = config.questions.second.startText;
    document.getElementById('nextBtn').textContent = config.questions.second.nextBtn;
    
    // Set third question texts
    document.getElementById('question3Text').textContent = config.questions.third.text;
    document.getElementById('yesBtn3').textContent = config.questions.third.yesBtn;
    document.getElementById('noBtn3').textContent = config.questions.third.noBtn;

    // Create initial floating elements
    createFloatingElements();

    // Setup music player
    setupMusicPlayer();
});

// Create floating hearts and bears
function createFloatingElements() {
    const container = document.querySelector('.floating-elements');
    
    // Create hearts
    config.floatingEmojis.hearts.forEach(heart => {
        const div = document.createElement('div');
        div.className = 'heart';
        div.innerHTML = heart;
        setRandomPosition(div);
        container.appendChild(div);
    });

    // Create bears
    config.floatingEmojis.bears.forEach(bear => {
        const div = document.createElement('div');
        div.className = 'bear';
        div.innerHTML = bear;
        setRandomPosition(div);
        container.appendChild(div);
    });
}

// Set random position for floating elements
function setRandomPosition(element) {
    element.style.left = Math.random() * 100 + 'vw';
    element.style.animationDelay = Math.random() * 5 + 's';
    element.style.animationDuration = 10 + Math.random() * 20 + 's';
}

// Function to show next question
function showNextQuestion(questionNumber) {
    // Reset click count when moving to next question
    noClickCount = 0;
    
    document.querySelectorAll('.question-section').forEach(q => q.classList.add('hidden'));
    document.getElementById(`question${questionNumber}`).classList.remove('hidden');
    
    // Reset any fixed position buttons back to normal
    document.querySelectorAll('.no-btn').forEach(btn => {
        btn.style.position = 'relative';
        btn.style.left = 'auto';
        btn.style.top = 'auto';
        btn.style.zIndex = 'auto';
    });
}

// Track click count for different messages
let noClickCount = 0;

// Function to move the "No" button and show "You're lying" message
function handleNoClick(button) {
    noClickCount++;
    
    // Get button dimensions
    const btnRect = button.getBoundingClientRect();
    const btnWidth = btnRect.width;
    const btnHeight = btnRect.height;
    
    // Get actual visible viewport dimensions (important for mobile)
    const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);
    const viewportHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
    
    // Calculate safe boundaries - keep button in upper 70% of screen to avoid going below fold
    const padding = 30;
    const minX = padding;
    const minY = padding;
    const maxX = viewportWidth - btnWidth - padding;
    const maxY = Math.min(viewportHeight * 0.7, viewportHeight - btnHeight - padding * 3);
    
    // Generate random position within safe bounds
    const x = Math.random() * (maxX - minX) + minX;
    const y = Math.random() * (maxY - minY) + minY;
    
    // Move the button
    button.style.position = 'fixed';
    button.style.left = x + 'px';
    button.style.top = y + 'px';
    button.style.zIndex = '100';
    button.style.transition = 'all 0.3s ease';
    
    // Show "You're lying" message
    showLyingMessage(x, y, btnWidth, btnHeight);
    
    // Make the button shake
    button.style.animation = 'shake 0.5s';
    setTimeout(() => {
        button.style.animation = '';
    }, 500);
}

// Show "You're lying" message near the button
function showLyingMessage(x, y, btnWidth, btnHeight) {
    // Remove any existing message
    const existingMsg = document.querySelector('.lying-message');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    // Different messages based on click count
    let message = config.questions.first.noResponse;
    if (noClickCount > 5) {
        message = "Still lying? 😏💕";
    }
    if (noClickCount > 10) {
        message = "Come on, I know you're lying! 😊❤️";
    }
    if (noClickCount > 15) {
        message = "Just click Yes already! 😄💖";
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = 'lying-message';
    messageDiv.textContent = message;
    messageDiv.style.position = 'fixed';
    
    // Position message above the button with safe boundaries
    const messageWidth = 250;
    const messageHeight = 60;
    const padding = 10;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Try to place above button
    let messageX = x + (btnWidth / 2) - (messageWidth / 2);
    let messageY = y - messageHeight - padding;
    
    // Keep message within screen bounds horizontally
    messageX = Math.max(padding, Math.min(messageX, viewportWidth - messageWidth - padding));
    
    // If message would be above screen, place it below button instead
    if (messageY < padding) {
        messageY = y + btnHeight + padding;
    }
    
    // Make sure it doesn't go below screen either
    messageY = Math.min(messageY, viewportHeight - messageHeight - padding);
    
    messageDiv.style.left = messageX + 'px';
    messageDiv.style.top = messageY + 'px';
    document.body.appendChild(messageDiv);
    
    // Fade out and remove after 2 seconds
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => messageDiv.remove(), 500);
    }, 2000);
}

// Love meter functionality
const loveMeter = document.getElementById('loveMeter');
const loveValue = document.getElementById('loveValue');
const extraLove = document.getElementById('extraLove');

function setInitialPosition() {
    loveMeter.value = 100;
    loveValue.textContent = 100;
    loveMeter.style.width = '100%';
}

loveMeter.addEventListener('input', () => {
    const value = parseInt(loveMeter.value);
    loveValue.textContent = value;
    
    if (value > 100) {
        extraLove.classList.remove('hidden');
        const overflowPercentage = (value - 100) / 9900;
        const extraWidth = overflowPercentage * window.innerWidth * 0.8;
        loveMeter.style.width = `calc(100% + ${extraWidth}px)`;
        loveMeter.style.transition = 'width 0.3s';
        
        // Show different messages based on the value
        if (value >= 5000) {
            extraLove.classList.add('super-love');
            extraLove.textContent = config.loveMessages.extreme;
        } else if (value > 1000) {
            extraLove.classList.remove('super-love');
            extraLove.textContent = config.loveMessages.high;
        } else {
            extraLove.classList.remove('super-love');
            extraLove.textContent = config.loveMessages.normal;
        }
    } else {
        extraLove.classList.add('hidden');
        extraLove.classList.remove('super-love');
        loveMeter.style.width = '100%';
    }
});

// Initialize love meter
window.addEventListener('DOMContentLoaded', setInitialPosition);
window.addEventListener('load', setInitialPosition);

// Celebration function
function celebrate() {
    document.querySelectorAll('.question-section').forEach(q => q.classList.add('hidden'));
    const celebration = document.getElementById('celebration');
    celebration.classList.remove('hidden');
    
    // Set celebration messages
    document.getElementById('celebrationTitle').textContent = config.celebration.title;
    document.getElementById('celebrationMessage').textContent = config.celebration.message;
    document.getElementById('celebrationEmojis').textContent = config.celebration.emojis;
    
    // Create heart explosion effect
    createHeartExplosion();
}

// Create heart explosion animation
function createHeartExplosion() {
    for (let i = 0; i < 50; i++) {
        const heart = document.createElement('div');
        const randomHeart = config.floatingEmojis.hearts[Math.floor(Math.random() * config.floatingEmojis.hearts.length)];
        heart.innerHTML = randomHeart;
        heart.className = 'heart explosion-heart';
        document.querySelector('.floating-elements').appendChild(heart);
        
        // Random position and animation
        heart.style.left = '50%';
        heart.style.top = '50%';
        heart.style.setProperty('--random-x', (Math.random() - 0.5) * 200 + 'vw');
        heart.style.setProperty('--random-y', (Math.random() - 0.5) * 200 + 'vh');
        heart.style.animationDelay = Math.random() * 0.5 + 's';
    }
}

// Music Player Setup with YouTube API
let youtubePlayer;
let playerReady = false;
let apiReady = false;
let isMuted = true;

// Check if YouTube API is already loaded
if (typeof YT !== 'undefined' && YT.loaded) {
    console.log('YouTube API already loaded');
    apiReady = true;
}

// This function creates an <iframe> (and YouTube player) after the API code downloads.
function onYouTubeIframeAPIReady() {
    apiReady = true;
    console.log('YouTube API Ready - onYouTubeIframeAPIReady called');
    initializeYouTubePlayer();
}

// Make sure it's available globally
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

function initializeYouTubePlayer() {
    const config = window.VALENTINE_CONFIG;
    
    console.log('Initializing YouTube player...');
    console.log('Music enabled:', config.music.enabled);
    console.log('Video ID:', config.music.youtubeVideoId);
    
    if (!config.music.enabled) {
        document.getElementById('musicControls').style.display = 'none';
        return;
    }

    try {
        youtubePlayer = new YT.Player('youtube-player', {
            height: '0',
            width: '0',
            videoId: config.music.youtubeVideoId,
            playerVars: {
                'autoplay': config.music.autoplay ? 1 : 0,
                'controls': 0,
                'loop': 1,
                'playlist': config.music.youtubeVideoId,
                'playsinline': 1,
                'enablejsapi': 1,
                'origin': window.location.origin,
                'mute': 1
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onError': onPlayerError
            }
        });
        console.log('YouTube player object created');
    } catch (error) {
        console.error('Error creating YouTube player:', error);
        alert('Error loading music player: ' + error.message);
    }
}

function onPlayerReady(event) {
    playerReady = true;
    const config = window.VALENTINE_CONFIG;
    let musicToggle = document.getElementById('musicToggle');
    
    console.log('✓ Player ready!');
    
    // Set volume (0-100)
    event.target.setVolume(config.music.volume);
    
    musicToggle.disabled = false;
    musicToggle.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    
    // Remove all existing event listeners by replacing the element
    const newToggle = musicToggle.cloneNode(true);
    musicToggle.parentNode.replaceChild(newToggle, musicToggle);
    
    // Add click handler to the new element
    newToggle.addEventListener('click', function() {
        console.log('Music button clicked');
        
        if (!playerReady) {
            console.log('Player not ready yet');
            return;
        }
        
        try {
            if (isMuted) {
                youtubePlayer.unMute();
                isMuted = false;
                newToggle.textContent = config.music.stopText;
                console.log('🔊 Music unmuted');
            } else {
                youtubePlayer.mute();
                isMuted = true;
                newToggle.textContent = config.music.startText;
                console.log('🔇 Music muted');
            }
        } catch (error) {
            console.error('Error toggling music:', error);
        }
    });
    
    // If autoplay is enabled, start playing and try to unmute
    if (config.music.autoplay) {
        event.target.playVideo();
        newToggle.textContent = config.music.startText;
        
        // Try to unmute after a brief delay
        setTimeout(() => {
            try {
                event.target.unMute();
                isMuted = false;
                newToggle.textContent = config.music.stopText;
                console.log('🔊 Music auto-unmuted successfully');
            } catch (error) {
                isMuted = true;
                newToggle.textContent = config.music.startText;
                console.log('🔇 Auto-unmute blocked, user must click');
            }
        }, 1000);
        
        console.log('▶ Autoplay started');
    } else {
        newToggle.textContent = config.music.startText;
    }
    
    console.log('Music button ready');
}

function onPlayerStateChange(event) {
    const states = {
        '-1': 'Unstarted',
        '0': 'Ended',
        '1': 'Playing',
        '2': 'Paused',
        '3': 'Buffering',
        '5': 'Cued'
    };
    
    console.log('Player state changed to:', states[event.data] || event.data);
}

function onPlayerError(event) {
    console.error('YouTube Player Error:', event.data);
    const errorMessages = {
        2: 'Invalid video ID - Check if the ID is correct',
        5: 'HTML5 player error - Try a different browser',
        100: 'Video not found or is PRIVATE',
        101: 'Video owner DISABLED embedding - Choose a different video',
        150: 'Video owner DISABLED embedding - Choose a different video'
    };
    
    const errorMsg = errorMessages[event.data] || `Unknown error (${event.data})`;
    console.error('ERROR:', errorMsg);
    
    alert('🎵 Music Error!\n\n' + errorMsg + '\n\nThis video cannot be played in the web page.\nPlease try a different YouTube video.\n\nOpen the browser console (F12) for more details.');
}

function setupMusicPlayer() {
    const config = window.VALENTINE_CONFIG;
    
    if (!config.music.enabled) {
        document.getElementById('musicControls').style.display = 'none';
        console.log('Music disabled in config');
        return;
    }
    
    console.log('Setting up music player...');
    console.log('YouTube Video ID:', config.music.youtubeVideoId);
    
    const musicToggle = document.getElementById('musicToggle');
    if (!musicToggle) {
        console.error('ERROR: Music toggle button not found!');
        return;
    }
    
    musicToggle.textContent = '⏳ Loading Music...';
    musicToggle.disabled = true;
    console.log('Music button found and set to loading state');
    
    // Check if YouTube API is ready, if not wait for it
    let checkCount = 0;
    const maxChecks = 20; // Check for 10 seconds
    
    const checkAPIReady = setInterval(() => {
        checkCount++;
        console.log(`Checking for YouTube API... attempt ${checkCount}`);
        
        if (typeof YT !== 'undefined' && typeof YT.Player !== 'undefined') {
            console.log('✓ YouTube API detected!');
            clearInterval(checkAPIReady);
            
            // If onYouTubeIframeAPIReady hasn't been called yet, call it manually
            if (!apiReady) {
                console.log('Manually triggering YouTube player initialization');
                onYouTubeIframeAPIReady();
            }
        } else if (checkCount >= maxChecks) {
            console.error('YouTube API failed to load after 10 seconds');
            clearInterval(checkAPIReady);
            musicToggle.disabled = false;
            musicToggle.textContent = '❌ Music Failed';
            alert('Failed to load YouTube music player. Please refresh the page or check your internet connection.');
        }
    }, 500);
}