// Apply theme colors from config
window.addEventListener('DOMContentLoaded', () => {
    const config = window.VALENTINE_CONFIG;
    
    if (!config || !config.colors) {
        console.warn('No color configuration found');
        return;
    }

    // Apply background gradient
    document.body.style.background = `linear-gradient(135deg, ${config.colors.backgroundStart} 0%, ${config.colors.backgroundEnd} 100%)`;
    
    // Create dynamic style element for button colors
    const style = document.createElement('style');
    style.textContent = `
        h1, #celebrationTitle {
            color: ${config.colors.textColor} !important;
        }
        
        .cute-btn:not(.yes-btn):not(.final-yes):not(.no-btn) {
            background: linear-gradient(135deg, ${config.colors.buttonBackground} 0%, ${config.colors.buttonHover} 100%);
            box-shadow: 0 5px 15px ${config.colors.buttonBackground}66;
        }
        
        .cute-btn:not(.yes-btn):not(.final-yes):not(.no-btn):hover {
            box-shadow: 0 8px 25px ${config.colors.buttonBackground}99;
        }
        
        .love-value-container, #extraLove {
            color: ${config.colors.textColor};
        }
        
        .slider {
            background: linear-gradient(to right, ${config.colors.backgroundStart}, ${config.colors.buttonBackground});
        }
        
        .slider::-webkit-slider-thumb {
            background: linear-gradient(135deg, ${config.colors.buttonBackground}, ${config.colors.textColor});
        }
        
        .slider::-moz-range-thumb {
            background: linear-gradient(135deg, ${config.colors.buttonBackground}, ${config.colors.textColor});
        }
        
        .lying-message {
            background: linear-gradient(135deg, ${config.colors.buttonBackground}, ${config.colors.buttonHover});
        }
    `;
    
    document.head.appendChild(style);
});