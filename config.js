const CONFIG = {
    valentineName: "My Valentine",

    pageTitle: "I have a little question for you 💫",

    floatingEmojis: {
        hearts: ['💖', '💝', '💗', '💓', '💕', '💘'],
        bears: ['🧸', '🐻', '🐨']
    },

    questions: {
        first: {
            text: "Do you like being together with me the way we are? 😊",
            yesBtn: "Yes, Very Much ❤️",
            noBtn: "Not Really 🤔",
            noResponse: "You're lying! 😏💕"
        },
        second: {
            text: "How good does it feel when we're together?",
            startText: "This much 👉",
            nextBtn: "Continue 💕"
        },
        third: {
            text: "Will you be my Valentine this year? 🌹",
            yesBtn: "Yes! ❤️",
            noBtn: "Maybe Later 😊"
        }
    },

    loveMessages: {
        extreme: "Whoa, that's dangerously sweet! 🥰💫",
        high: "Looks like you're pretty into this 😌💖",
        normal: "That's more than enough for me 💕"
    },

    celebration: {
        title: "You made me smile so much! 💝",
        message: "I promise nothing... except beautiful moments together 😌✨",
        emojis: "💖✨😊💝🧸🌹"
    },

    colors: {
        backgroundStart: "#ffafbd",
        backgroundEnd: "#ffc3a0",
        buttonBackground: "#ff6b6b",
        buttonHover: "#ff8787",
        textColor: "#ff4757",
        accentColor: "#BAB86C"
    },

    animations: {
        floatDuration: "15s",
        floatDistance: "50px",
        bounceSpeed: "0.5s",
        heartExplosionSize: 1.4
    },

    music: {
        enabled: true,
        autoplay: false, // Changed to false - user will click to play (browsers block autoplay)
        // YouTube video ID (extract from URL: https://www.youtube.com/watch?v=VIDEO_ID)
        youtubeVideoId: "8SYPKQMW_2Q", // Your video ID
        // Fallback direct audio URL (optional - use if YouTube doesn't work)
        fallbackAudioUrl: "", // You can add an mp3 URL here as backup
        startText: "🎵 Play Music",
        stopText: "🔇 Stop Music",
        volume: 50 // Volume level 0-100
    }
};

window.VALENTINE_CONFIG = CONFIG;