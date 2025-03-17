document.addEventListener('DOMContentLoaded', () => {
    // Create the dot matrix characters with default "DEV" letters
    createDefaultCharacters();
    
    // Create featured project character
    createFeaturedProjectCharacter();
    
    // Create about section character
    createAboutSectionCharacter();
    
    // Create skills section character
    createSkillsSectionCharacter();
    
    // Initialize custom cursor
    initCustomCursor();
    
    // Initialize inactivity timer
    initInactivityTimer();
    
    // Add keyboard secret
    initKeyboardSecret();
    
    // Add click event to dot characters to change them
    document.querySelectorAll('.dot-character').forEach(char => {
        char.addEventListener('click', () => {
            changeCharacter(char);
            resetInactivityTimer();
        });
    });
    
    // Add click event to entire document (with exceptions)
    document.addEventListener('click', (e) => {
        // Don't trigger if clicking on a dot character or interactive element
        if (!e.target.closest('.dot-character, a, .cta')) {
            // Pick a random character to change for visual interest
            const characters = document.querySelectorAll('.dot-character');
            const randomChar = characters[Math.floor(Math.random() * characters.length)];
            changeCharacter(randomChar);
            resetInactivityTimer();
        }
    });
    
    // Reset inactivity timer on any interaction
    document.addEventListener('mousemove', () => {
        resetInactivityTimer();
    });
    
    // Add mousemove event for interactive effect
    document.addEventListener('mousemove', (e) => {
        handleMouseMove(e);
        moveCustomCursor(e);
    });
    
    // Add hover effects for interactive elements
    addHoverEffects();
    
    // Add page load animation
    animatePageLoad();
    
    // Add smooth scrolling to anchor links
    addSmoothScrolling();
    
    // Handle resize events
    window.addEventListener('resize', debounce(() => {
        clearDotCharacters();
        createDefaultCharacters();
        createFeaturedProjectCharacter();
        createAboutSectionCharacter();
        createSkillsSectionCharacter();
    }, 300));
});

// Inactivity timer variables
let inactivityTimeout;
const inactivityDelay = 1500; // 20 seconds

// Initialize inactivity timer
function initInactivityTimer() {
    resetInactivityTimer();
}

// Reset inactivity timer
function resetInactivityTimer() {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {
        resetToDefaultCharacters();
    }, inactivityDelay);
}

// Reset to default characters
function resetToDefaultCharacters() {
    const char1 = document.getElementById('char1');
    const char2 = document.getElementById('char2');
    const char3 = document.getElementById('char3');
    const featuredChar = document.getElementById('featured-char');
    const aboutChar = document.getElementById('about-char');
    const skillsChar = document.getElementById('skills-char');
    
    // Reset hero characters
    if (char1 && char1.getAttribute('data-character') !== 'D') {
        cycleToSpecificCharacter(char1, 'D');
    }
    
    if (char2 && char2.getAttribute('data-character') !== 'E') {
        cycleToSpecificCharacter(char2, 'E');
    }
    
    if (char3 && char3.getAttribute('data-character') !== 'V') {
        cycleToSpecificCharacter(char3, 'V');
    }
    
    // Reset featured project character
    if (featuredChar && featuredChar.getAttribute('data-character') !== '<') {
        cycleToSpecificCharacter(featuredChar, '<');
    }
    
    // Reset about section character
    if (aboutChar && aboutChar.getAttribute('data-character') !== '?') {
        cycleToSpecificCharacter(aboutChar, '?');
    }
    
    // Reset skills section character (if exists)
    if (skillsChar && skillsChar.getAttribute('data-character') !== '#') {
        cycleToSpecificCharacter(skillsChar, '#');
    }
}

// Create default characters (D, E, V)
function createDefaultCharacters() {
    const char1 = document.getElementById('char1');
    const char2 = document.getElementById('char2');
    const char3 = document.getElementById('char3');
    
    if (char1) createDotMatrix(char1, 'D');
    if (char2) createDotMatrix(char2, 'E');
    if (char3) createDotMatrix(char3, 'V');
}

// Create featured project character (code symbol)
function createFeaturedProjectCharacter() {
    const featuredChar = document.getElementById('featured-char');
    if (featuredChar) {
        createDotMatrix(featuredChar, '<');
    }
}

// Create about section character
function createAboutSectionCharacter() {
    const aboutChar = document.getElementById('about-char');
    if (aboutChar) {
        createDotMatrix(aboutChar, '?');
    }
}

// Create skills section character
function createSkillsSectionCharacter() {
    const skillsChar = document.getElementById('skills-char');
    if (skillsChar) {
        createDotMatrix(skillsChar, '#');
    }
}

// Page load animation
function animatePageLoad() {
    const elements = [
        document.querySelector('header'),
        document.querySelector('.left-column'),
        document.querySelector('.right-column'),
        document.querySelector('.scroll-indicator')
    ];
    
    // Reset initial state
    elements.forEach(el => {
        if (!el) return;
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // Staggered animation
    setTimeout(() => {
        elements.forEach((el, index) => {
            if (!el) return;
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 150);
        });
        
        // Animate project sections after hero section
        setTimeout(() => {
            const projectSections = document.querySelectorAll('.featured-section, .projects-section');
            projectSections.forEach((section, index) => {
                section.style.opacity = '0';
                section.style.transform = 'translateY(30px)';
                section.style.transition = 'opacity 1s ease, transform 1s ease';
                
                // Use Intersection Observer to trigger animation when section is in view
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            setTimeout(() => {
                                section.style.opacity = '1';
                                section.style.transform = 'translateY(0)';
                            }, index * 200);
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1 });
                
                observer.observe(section);
            });
        }, 800);
    }, 300);
}

// Custom cursor functionality
function initCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    // Initial position off-screen
    cursorDot.style.top = '-100px';
    cursorDot.style.left = '-100px';
}

function moveCustomCursor(e) {
    const cursorDot = document.querySelector('.cursor-dot');
    
    // Update cursor position with slight delay for smooth effect
    gsap.to(cursorDot, {
        duration: 0.15,
        left: e.clientX,
        top: e.clientY
    });
}

function addHoverEffects() {
    // Interactive elements that should change cursor appearance
    const interactiveElements = document.querySelectorAll('a, .cta, .dot-character');
    const cursorDot = document.querySelector('.cursor-dot');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.style.width = '24px';
            cursorDot.style.height = '24px';
            cursorDot.style.backgroundColor = 'white';
        });
        
        el.addEventListener('mouseleave', () => {
            cursorDot.style.width = '8px';
            cursorDot.style.height = '8px';
            cursorDot.style.backgroundColor = 'var(--accent-color)';
        });
    });
}

// Available characters to display - expanded with more defined characters
const characters = [
    '0', '1', '2', '3', '4', '5',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '<', '>', '+', '!', '?', '#'
];

// Default pattern for characters without explicit definitions
const defaultPattern = (x, y, cols, rows) => {
    // Create a more interesting pattern than just a dot
    const midX = Math.floor(cols / 2);
    const midY = Math.floor(rows / 2);
    
    // Make an X pattern
    if (Math.abs(x - y) <= 1 && x >= midX - 3 && x <= midX + 3) {
        return true;
    }
    
    if (Math.abs(x - (rows - y)) <= 1 && x >= midX - 3 && x <= midX + 3) {
        return true;
    }
    
    return false;
};

function createDotCharacters() {
    const charContainers = [
        document.getElementById('char1'),
        document.getElementById('char2'),
        document.getElementById('char3')
    ];
    
    // Randomly select characters to display
    let selectedChars = [];
    for (let i = 0; i < 3; i++) {
        let randomChar;
        do {
            randomChar = characters[Math.floor(Math.random() * characters.length)];
        } while (selectedChars.includes(randomChar));
        selectedChars.push(randomChar);
    }
    
    // Create dot matrix for each character
    charContainers.forEach((container, index) => {
        if (!container) return;
        createDotMatrix(container, selectedChars[index]);
    });
}

function createDotMatrix(container, character) {
    // Clear container
    container.innerHTML = '';
    
    // Set character attribute for reference
    container.setAttribute('data-character', character);
    
    // Calculate grid size based on container dimensions
    const rect = container.getBoundingClientRect();
    const isLarge = container.classList.contains('large');
    const isMedium = container.classList.contains('medium');
    
    // Adjust grid density based on container size
    const cols = isLarge ? 15 : isMedium ? 12 : 10;
    const rows = isLarge ? 20 : isMedium ? 15 : 12;
    
    // Calculate dot size and spacing
    const dotSize = 4;
    const colSpacing = rect.width / (cols + 1);
    const rowSpacing = rect.height / (rows + 1);
    
    // Create grid
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            
            // Position dot
            const left = (x + 1) * colSpacing - dotSize / 2;
            const top = (y + 1) * rowSpacing - dotSize / 2;
            
            dot.style.left = `${left}px`;
            dot.style.top = `${top}px`;
            
            // Set active dots based on character pattern
            if (isPartOfCharacter(character, x, y, cols, rows)) {
                dot.classList.add('active-dot');
                dot.dataset.isActive = 'true';
            } else {
                dot.classList.add('inactive-dot');
                dot.dataset.isActive = 'false';
            }
            
            // Store position for later use with mouse interactivity
            dot.dataset.x = x;
            dot.dataset.y = y;
            
            container.appendChild(dot);
        }
    }
    
    // Add staggered animation for active dots
    const activeDots = container.querySelectorAll('.active-dot');
    activeDots.forEach((dot, index) => {
        setTimeout(() => {
            dot.style.transform = 'scale(1.3)';
            setTimeout(() => {
                dot.style.transform = 'scale(1)';
            }, 300);
        }, index * 10);
    });
}

function isPartOfCharacter(char, x, y, cols, rows) {
    // Define dot patterns for each character
    const patterns = {
        // Numbers
        '0': (x, y, cols, rows) => {
            // Outline of a zero
            return (
                (x === Math.floor(cols/4) || x === Math.floor(cols*3/4)) && 
                y >= Math.floor(rows/4) && y <= Math.floor(rows*3/4) ||
                (y === Math.floor(rows/4) || y === Math.floor(rows*3/4)) && 
                x >= Math.floor(cols/4) && x <= Math.floor(cols*3/4)
            );
        },
        '1': (x, y, cols, rows) => {
            // Number 1
            const midX = Math.floor(cols / 2);
            return (
                x === midX && y >= Math.floor(rows/4) && y <= Math.floor(rows*3/4) ||
                y === Math.floor(rows*3/4) && x >= midX - Math.floor(cols/6) && x <= midX + Math.floor(cols/6) ||
                (x === midX - 1 && y === Math.floor(rows/4) + 1)
            );
        },
        '2': (x, y, cols, rows) => {
            // Number 2
            const qtrX = Math.floor(cols/4);
            const qtrY = Math.floor(rows/4);
            const midY = Math.floor(rows/2);
            const threeQtrY = Math.floor(rows*3/4);
            
            return (
                (y === qtrY && x >= qtrX && x <= cols - qtrX) ||
                (y === midY && x >= qtrX && x <= cols - qtrX) ||
                (y === threeQtrY && x >= qtrX && x <= cols - qtrX) ||
                (x === cols - qtrX && y >= qtrY && y <= midY) ||
                (x === qtrX && y >= midY && y <= threeQtrY)
            );
        },
        '3': (x, y, cols, rows) => {
            // Number 3
            const qtrX = Math.floor(cols/4);
            const qtrY = Math.floor(rows/4);
            const midY = Math.floor(rows/2);
            const threeQtrY = Math.floor(rows*3/4);
            
            return (
                (y === qtrY && x >= qtrX && x <= cols - qtrX) ||
                (y === midY && x >= qtrX && x <= cols - qtrX) ||
                (y === threeQtrY && x >= qtrX && x <= cols - qtrX) ||
                (x === cols - qtrX && y >= qtrY && y <= threeQtrY)
            );
        },
        '4': (x, y, cols, rows) => {
            // Number 4
            const qtrX = Math.floor(cols/4);
            const qtrY = Math.floor(rows/4);
            const midY = Math.floor(rows/2);
            const threeQtrY = Math.floor(rows*3/4);
            
            return (
                (x === qtrX && y >= qtrY && y <= midY) ||
                (y === midY && x >= qtrX && x <= cols - qtrX) ||
                (x === cols - qtrX - Math.floor(cols/8) && y >= qtrY && y <= threeQtrY)
            );
        },
        '5': (x, y, cols, rows) => {
            // Number 5
            const qtrX = Math.floor(cols/4);
            const qtrY = Math.floor(rows/4);
            const midY = Math.floor(rows/2);
            const threeQtrY = Math.floor(rows*3/4);
            
            return (
                (y === qtrY && x >= qtrX && x <= cols - qtrX) ||
                (x === qtrX && y >= qtrY && y <= midY) ||
                (y === midY && x >= qtrX && x <= cols - qtrX) ||
                (x === cols - qtrX && y >= midY && y <= threeQtrY) ||
                (y === threeQtrY && x >= qtrX && x <= cols - qtrX)
            );
        },
        
        // Alphabet
        'A': (x, y, cols, rows) => {
            // Letter A
            const qtrX = Math.floor(cols/4);
            const qtrY = Math.floor(rows/4);
            const midY = Math.floor(rows/2);
            
            return (
                ((x === qtrX || x === cols - qtrX) && y >= qtrY && y <= Math.floor(rows*3/4)) ||
                (y === qtrY && x >= qtrX && x <= cols - qtrX) ||
                (y === midY && x >= qtrX && x <= cols - qtrX)
            );
        },
        'B': (x, y, cols, rows) => {
            // Letter B
            const qtrX = Math.floor(cols/4);
            const qtrY = Math.floor(rows/4);
            const midY = Math.floor(rows/2);
            const threeQtrY = Math.floor(rows*3/4);
            
            return (
                x === qtrX && y >= qtrY && y <= threeQtrY ||
                (y === qtrY || y === midY || y === threeQtrY) && x >= qtrX && x <= cols - qtrX - 1 ||
                x === cols - qtrX && ((y >= qtrY + 1 && y <= midY - 1) || (y >= midY + 1 && y <= threeQtrY - 1))
            );
        },
        'C': (x, y, cols, rows) => {
            // Letter C
            const qtrX = Math.floor(cols/4);
            const qtrY = Math.floor(rows/4);
            const threeQtrY = Math.floor(rows*3/4);
            
            return (
                (x === qtrX && y >= qtrY && y <= threeQtrY) ||
                ((y === qtrY || y === threeQtrY) && x >= qtrX && x <= cols - qtrX)
            );
        },
        'D': (x, y, cols, rows) => {
            // Letter D
            const qtrX = Math.floor(cols/4);
            const qtrY = Math.floor(rows/4);
            const threeQtrY = Math.floor(rows*3/4);
            
            return (
                x === qtrX && y >= qtrY && y <= threeQtrY ||
                (y === qtrY || y === threeQtrY) && x >= qtrX && x <= cols - qtrX - 1 ||
                x === cols - qtrX && y >= qtrY + 1 && y <= threeQtrY - 1
            );
        },
        'E': (x, y, cols, rows) => {
            // Letter E
            const qtrX = Math.floor(cols/4);
            const qtrY = Math.floor(rows/4);
            const midY = Math.floor(rows/2);
            const threeQtrY = Math.floor(rows*3/4);
            
            return (
                x === qtrX && y >= qtrY && y <= threeQtrY ||
                (y === qtrY || y === midY || y === threeQtrY) && x >= qtrX && x <= cols - qtrX
            );
        },
        'F': (x, y, cols, rows) => {
            // Letter F
            const qtrX = Math.floor(cols/4);
            const qtrY = Math.floor(rows/4);
            const midY = Math.floor(rows/2);
            const threeQtrY = Math.floor(rows*3/4);
            
            return (
                x === qtrX && y >= qtrY && y <= threeQtrY ||
                (y === qtrY || y === midY) && x >= qtrX && x <= cols - qtrX
            );
        },
        'G': (x, y, cols, rows) => {
            // Letter G
            const qtrX = Math.floor(cols/4);
            const qtrY = Math.floor(rows/4);
            const midY = Math.floor(rows/2);
            const threeQtrY = Math.floor(rows*3/4);
            
            return (
                x === qtrX && y >= qtrY && y <= threeQtrY ||
                (y === qtrY || y === threeQtrY) && x >= qtrX && x <= cols - qtrX ||
                (x === cols - qtrX && y >= midY && y <= threeQtrY) ||
                (y === midY && x >= Math.floor(cols/2) && x <= cols - qtrX)
            );
        },
        'H': (x, y, cols, rows) => {
            // Letter H
            const qtrX = Math.floor(cols/4);
            const qtrY = Math.floor(rows/4);
            const midY = Math.floor(rows/2);
            const threeQtrY = Math.floor(rows*3/4);
            
            return (
                (x === qtrX || x === cols - qtrX) && y >= qtrY && y <= threeQtrY ||
                y === midY && x >= qtrX && x <= cols - qtrX
            );
        },
        'I': (x, y, cols, rows) => {
            // Letter I
            const midX = Math.floor(cols / 2);
            const qtrY = Math.floor(rows/4);
            const threeQtrY = Math.floor(rows*3/4);
            
            return (
                (y === qtrY || y === threeQtrY) && x >= Math.floor(cols/3) && x <= Math.floor(cols*2/3) ||
                x === midX && y >= qtrY && y <= threeQtrY
            );
        },
        'J': (x, y, cols, rows) => {
            // Letter J
            const midX = Math.floor(cols / 2);
            const qtrX = Math.floor(cols/4);
            const qtrY = Math.floor(rows/4);
            const threeQtrY = Math.floor(rows*3/4);
            
            return (
                y === qtrY && x >= qtrX && x <= cols - qtrX ||
                x === midX && y >= qtrY && y <= threeQtrY ||
                y === threeQtrY && x >= qtrX && x < midX ||
                x === qtrX && y >= Math.floor(2*rows/3) && y <= threeQtrY
            );
        },
        'K': (x, y, cols, rows) => {
            // Letter K
            const qtrX = Math.floor(cols/4);
            const qtrY = Math.floor(rows/4);
            const midY = Math.floor(rows/2);
            const threeQtrY = Math.floor(rows*3/4);
            
            for (let i = 0; i <= threeQtrY - midY; i++) {
                if (
                    (x === qtrX && y >= qtrY && y <= threeQtrY) ||
                    (x === qtrX + i && y === midY - i && i <= midY - qtrY) ||
                    (x === qtrX + i && y === midY + i && i <= threeQtrY - midY)
                ) {
                    return true;
                }
            }
            return false;
        },
        'L': (x, y, cols, rows) => {
            // Letter L
            const qtrX = Math.floor(cols/4);
            const qtrY = Math.floor(rows/4);
            const threeQtrY = Math.floor(rows*3/4);
            
            return (
                x === qtrX && y >= qtrY && y <= threeQtrY ||
                y === threeQtrY && x >= qtrX && x <= cols - qtrX
            );
        },
        'M': (x, y, cols, rows) => {
            // Letter M
            const qtrX = Math.floor(cols/4);
            const qtrY = Math.floor(rows/4);
            const midX = Math.floor(cols/2);
            const threeQtrY = Math.floor(rows*3/4);
            
            return (
                (x === qtrX || x === cols - qtrX) && y >= qtrY && y <= threeQtrY ||
                (Math.abs(x - midX) === Math.floor((y - qtrY) / 2) && y >= qtrY && y <= Math.floor(rows/2))
            );
        },
        'N': (x, y, cols, rows) => {
            // Letter N
            const qtrX = Math.floor(cols/4);
            const qtrY = Math.floor(rows/4);
            const threeQtrY = Math.floor(rows*3/4);
            
            return (
                (x === qtrX || x === cols - qtrX) && y >= qtrY && y <= threeQtrY ||
                Math.abs(x - qtrX) === Math.floor((y - qtrY) * (cols - 2*qtrX) / (threeQtrY - qtrY))
            );
        },
        'O': (x, y, cols, rows) => {
            // Letter O
            const qtrX = Math.floor(cols/4);
            const qtrY = Math.floor(rows/4);
            const threeQtrY = Math.floor(rows*3/4);
            
            return (
                ((x === qtrX || x === cols - qtrX) && y >= qtrY && y <= threeQtrY) ||
                ((y === qtrY || y === threeQtrY) && x >= qtrX && x <= cols - qtrX)
            );
        },
        'P': (x, y, cols, rows) => {
            // Letter P
            const qtrX = Math.floor(cols/4);
            const qtrY = Math.floor(rows/4);
            const midY = Math.floor(rows/2);
            
            return (
                x === qtrX && y >= qtrY && y <= Math.floor(rows*3/4) ||
                (y === qtrY || y === midY) && x >= qtrX && x <= cols - qtrX ||
                x === cols - qtrX && y > qtrY && y < midY
            );
        },
        'Q': (x, y, cols, rows) => {
            // Letter Q
            const qtrX = Math.floor(cols/4);
            const qtrY = Math.floor(rows/4);
            const threeQtrY = Math.floor(rows*3/4);
            
            return (
                ((x === qtrX || x === cols - qtrX) && y >= qtrY && y <= threeQtrY - Math.floor(rows/10)) ||
                ((y === qtrY || y === threeQtrY - Math.floor(rows/10)) && x >= qtrX && x <= cols - qtrX) ||
                (x === cols - qtrX - Math.floor(cols/10) + Math.floor((y - (threeQtrY - Math.floor(rows/5))) * 0.7) && 
                 y >= threeQtrY - Math.floor(rows/5) && y <= threeQtrY)
            );
        },
        'R': (x, y, cols, rows) => {
            // Letter R
            const qtrX = Math.floor(cols/4);
            const qtrY = Math.floor(rows/4);
            const midY = Math.floor(rows/2);
            const threeQtrY = Math.floor(rows*3/4);
            
            return (
                x === qtrX && y >= qtrY && y <= threeQtrY ||
                (y === qtrY || y === midY) && x >= qtrX && x <= cols - qtrX ||
                x === cols - qtrX && y > qtrY && y < midY ||
                (x === qtrX + Math.floor((y - midY) * 0.8) && y >= midY && y <= threeQtrY)
            );
        },
        'S': (x, y, cols, rows) => {
            // Letter S
            const qtrX = Math.floor(cols/4);
            const qtrY = Math.floor(rows/4);
            const midY = Math.floor(rows/2);
            const threeQtrY = Math.floor(rows*3/4);
            
            return (
                (y === qtrY && x >= qtrX && x <= cols - qtrX) ||
                (x === qtrX && y >= qtrY && y <= midY) ||
                (y === midY && x >= qtrX && x <= cols - qtrX) ||
                (x === cols - qtrX && y >= midY && y <= threeQtrY) ||
                (y === threeQtrY && x >= qtrX && x <= cols - qtrX)
            );
        },
        'T': (x, y, cols, rows) => {
            // Letter T
            const midX = Math.floor(cols / 2);
            const qtrY = Math.floor(rows/4);
            const threeQtrY = Math.floor(rows*3/4);
            
            return (
                y === qtrY && x >= Math.floor(cols/4) && x <= Math.floor(cols*3/4) ||
                x === midX && y >= qtrY && y <= threeQtrY
            );
        },
        'U': (x, y, cols, rows) => {
            // Letter U
            const qtrX = Math.floor(cols/4);
            const qtrY = Math.floor(rows/4);
            const threeQtrY = Math.floor(rows*3/4);
            
            return (
                ((x === qtrX || x === cols - qtrX) && y >= qtrY && y <= threeQtrY - 1) ||
                (y === threeQtrY && x > qtrX && x < cols - qtrX)
            );
        },
        'V': (x, y, cols, rows) => {
            // Letter V
            const qtrX = Math.floor(cols/4);
            const qtrY = Math.floor(rows/4);
            const midX = Math.floor(cols/2);
            const threeQtrY = Math.floor(rows*3/4);
            
            // Calculate slope to form a V shape
            for (let i = 0; i <= threeQtrY - qtrY; i++) {
                const leftX = qtrX + Math.floor(i * (midX - qtrX) / (threeQtrY - qtrY));
                const rightX = cols - qtrX - Math.floor(i * (midX - qtrX) / (threeQtrY - qtrY));
                
                if ((x === leftX || x === rightX) && y === qtrY + i) {
                    return true;
                }
            }
            
            return false;
        },
        'W': (x, y, cols, rows) => {
            // Letter W
            const qtrX = Math.floor(cols/4);
            const qtrY = Math.floor(rows/4);
            const midX = Math.floor(cols/2);
            const threeQtrY = Math.floor(rows*3/4);
            
            // Slopes for the four lines of the W
            for (let i = 0; i <= threeQtrY - qtrY; i++) {
                const leftX = qtrX + Math.floor(i * (midX/2 - qtrX) / (threeQtrY - qtrY));
                const midLeftX = midX/2 + Math.floor(i * (midX - midX/2) / (threeQtrY - qtrY));
                const midRightX = midX + Math.floor(i * (midX*3/2 - midX) / (threeQtrY - qtrY));
                const rightX = midX*3/2 + Math.floor(i * (cols - qtrX - midX*3/2) / (threeQtrY - qtrY));
                
                if ((x === leftX || x === midLeftX || x === midRightX || x === rightX) && y === qtrY + i) {
                    return true;
                }
            }
            
            return false;
        },
        'X': (x, y, cols, rows) => {
            // Letter X
            const qtrX = Math.floor(cols/4);
            const qtrY = Math.floor(rows/4);
            const threeQtrX = Math.floor(cols*3/4);
            const threeQtrY = Math.floor(rows*3/4);
            
            return (
                Math.abs(x - qtrX - Math.floor((y - qtrY) * (threeQtrX - qtrX) / (threeQtrY - qtrY))) <= 1 ||
                Math.abs(x - threeQtrX + Math.floor((y - qtrY) * (threeQtrX - qtrX) / (threeQtrY - qtrY))) <= 1
            );
        },
        'Y': (x, y, cols, rows) => {
            // Letter Y
            const qtrX = Math.floor(cols/4);
            const qtrY = Math.floor(rows/4);
            const midX = Math.floor(cols/2);
            const midY = Math.floor(rows/2);
            const threeQtrY = Math.floor(rows*3/4);
            
            // Calculate the top part of the Y
            for (let i = 0; i <= midY - qtrY; i++) {
                const leftX = qtrX + Math.floor(i * (midX - qtrX) / (midY - qtrY));
                const rightX = cols - qtrX - Math.floor(i * (cols - qtrX - midX) / (midY - qtrY));
                
                if ((x === leftX || x === rightX) && y === qtrY + i) {
                    return true;
                }
            }
            
            // The stem of the Y
            return (x === midX && y >= midY && y <= threeQtrY);
        },
        'Z': (x, y, cols, rows) => {
            // Letter Z
            const qtrX = Math.floor(cols/4);
            const qtrY = Math.floor(rows/4);
            const threeQtrY = Math.floor(rows*3/4);
            
            return (
                (y === qtrY || y === threeQtrY) && x >= qtrX && x <= cols - qtrX ||
                Math.abs(x - qtrX - Math.floor((threeQtrY - y) * (cols - 2*qtrX) / (threeQtrY - qtrY))) <= 1
            );
        },
        
        // Special characters
        '<': (x, y, cols, rows) => {
            // < character
            const midY = Math.floor(rows / 2);
            const slope = 0.8;
            return (
                Math.abs(y - midY) <= slope * (cols/2 - x) &&
                x >= cols/4 && x <= cols*3/4
            );
        },
        '>': (x, y, cols, rows) => {
            // > character
            const midY = Math.floor(rows / 2);
            const slope = 0.8;
            return (
                Math.abs(y - midY) <= slope * (x - cols/4) &&
                x >= cols/4 && x <= cols*3/4
            );
        },
        '+': (x, y, cols, rows) => {
            // + character
            const midX = Math.floor(cols / 2);
            const midY = Math.floor(rows / 2);
            return (
                (x === midX && y >= midY - Math.floor(rows/4) && y <= midY + Math.floor(rows/4)) ||
                (y === midY && x >= midX - Math.floor(cols/4) && x <= midX + Math.floor(cols/4))
            );
        },
        '!': (x, y, cols, rows) => {
            // ! character
            const midX = Math.floor(cols / 2);
            const qtrY = Math.floor(rows/4);
            const threeQtrY = Math.floor(rows*3/4);
            
            return (
                (x === midX && y >= qtrY && y <= threeQtrY - Math.floor(rows/8)) ||
                (x === midX && y === threeQtrY)
            );
        },
        '?': (x, y, cols, rows) => {
            // ? character
            const midX = Math.floor(cols / 2);
            const qtrY = Math.floor(rows/4);
            const midY = Math.floor(rows/2);
            const threeQtrY = Math.floor(rows*3/4);
            
            return (
                (y === qtrY && x >= midX - Math.floor(cols/5) && x <= midX + Math.floor(cols/5)) ||
                (x === midX + Math.floor(cols/5) && y >= qtrY + 1 && y <= midY - 1) ||
                (y === midY && x >= midX && x <= midX + Math.floor(cols/5)) ||
                (x === midX && y >= midY + 1 && y <= threeQtrY - Math.floor(rows/8)) ||
                (x === midX && y === threeQtrY)
            );
        },
        '#': (x, y, cols, rows) => {
            // # character
            const oneThirdY = Math.floor(rows/3);
            const twoThirdsY = Math.floor(2*rows/3);
            const oneThirdX = Math.floor(cols/3);
            const twoThirdsX = Math.floor(2*cols/3);
            
            return (
                (x === oneThirdX || x === twoThirdsX) && y >= Math.floor(rows/4) && y <= Math.floor(3*rows/4) ||
                (y === oneThirdY || y === twoThirdsY) && x >= Math.floor(cols/4) && x <= Math.floor(3*cols/4)
            );
        }
    };
    
    // Use the specific pattern if defined, otherwise use default
    return (patterns[char] || defaultPattern)(x, y, cols, rows);
}

function handleMouseMove(e) {
    const charContainers = document.querySelectorAll('.dot-character');
    
    charContainers.forEach(container => {
        const containerRect = container.getBoundingClientRect();
        
        // Calculate if mouse is within or near the container
        const centerX = containerRect.left + containerRect.width / 2;
        const centerY = containerRect.top + containerRect.height / 2;
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Distance from mouse to container center
        const distance = Math.sqrt(
            Math.pow(mouseX - centerX, 2) + 
            Math.pow(mouseY - centerY, 2)
        );
        
        // Only process if mouse is within certain radius of container
        const maxRadius = Math.max(containerRect.width, containerRect.height);
        if (distance < maxRadius * 2) {
            // Add a subtle rotation to the character container based on mouse position
            const rotateX = (mouseY - centerY) / 25;
            const rotateY = (mouseX - centerX) / -25;
            container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            
            const dots = container.querySelectorAll('.dot');
            
            dots.forEach(dot => {
                const dotRect = dot.getBoundingClientRect();
                const dotCenterX = dotRect.left + dotRect.width / 2;
                const dotCenterY = dotRect.top + dotRect.height / 2;
                
                const distanceToDot = Math.sqrt(
                    Math.pow(mouseX - dotCenterX, 2) + 
                    Math.pow(mouseY - dotCenterY, 2)
                );
                
                const maxDistance = 150;
                
                if (distanceToDot < maxDistance) {
                    const isActive = dot.dataset.isActive === 'true';
                    const intensity = 1 - distanceToDot / maxDistance;
                    const push = 10 * intensity;
                    
                    // Calculate direction to push the dot away from mouse
                    const angleRadians = Math.atan2(dotCenterY - mouseY, dotCenterX - mouseX);
                    const pushX = Math.cos(angleRadians) * push;
                    const pushY = Math.sin(angleRadians) * push;
                    
                    if (isActive) {
                        dot.style.transform = `translate(${pushX}px, ${pushY}px) scale(${1 + intensity * 0.8})`;
                        dot.style.boxShadow = `0 0 ${8 + intensity * 15}px rgba(99, 102, 241, ${0.5 + intensity * 0.5})`;
                    } else {
                        dot.style.transform = `translate(${pushX}px, ${pushY}px)`;
                        dot.style.opacity = Math.min(0.4, 0.05 + intensity * 0.5);
                    }
                } else {
                    // Reset if not already an active dot
                    if (dot.dataset.isActive === 'false') {
                        dot.style.transform = 'scale(1)';
                        dot.style.opacity = '0.05';
                    } else {
                        dot.style.transform = 'scale(1)';
                        dot.style.boxShadow = '0 0 8px rgba(99, 102, 241, 0.6)';
                    }
                }
            });
        } else {
            // Reset container transform when mouse is far away
            container.style.transform = '';
        }
    });
}

function changeCharacter(charElement) {
    // Start rapid character cycling animation that gradually slows down
    cycleCharactersWithDeceleration(charElement);
}

function cycleCharactersWithDeceleration(charElement) {
    // Get current character
    const currentChar = charElement.getAttribute('data-character');
    
    // Number of cycles and timing variables
    const totalCycles = 15; // Total number of character changes
    let cycleCount = 0;
    
    // Function to get random character different from current
    const getRandomChar = (current) => {
        let newChar;
        do {
            newChar = characters[Math.floor(Math.random() * characters.length)];
        } while (newChar === current);
        return newChar;
    };
    
    // Apply initial visual effect
    charElement.style.transform = 'scale(1.05)';
    
    // Start the cycling process
    const cycle = () => {
        cycleCount++;
        
        // Calculate delay based on cycle count (deceleration)
        // Starts fast, gradually slows down
        const delay = 30 + cycleCount * 10;
        
        // Get random character
        const newChar = getRandomChar(charElement.getAttribute('data-character'));
        
        // Update the character
        charElement.innerHTML = '';
        createDotMatrix(charElement, newChar);
        
        // Continue cycling with increasing delay or stop
        if (cycleCount < totalCycles) {
            setTimeout(cycle, delay);
        } else {
            // Final animation effect to settle
            charElement.style.transform = 'scale(1)';
        }
    };
    
    // Start the first cycle
    setTimeout(cycle, 50);
}

function cycleToSpecificCharacter(charElement, targetChar) {
    // Number of cycles and timing variables
    const totalCycles = 10; // Fewer cycles for reset
    let cycleCount = 0;
    
    // Apply initial visual effect
    charElement.style.transform = 'scale(1.05)';
    
    // Start the cycling process
    const cycle = () => {
        cycleCount++;
        
        // Calculate delay based on cycle count (deceleration)
        const delay = 30 + cycleCount * 10;
        
        // Use random chars until the last cycle
        let newChar;
        if (cycleCount < totalCycles) {
            // Get random character different from current and target
            do {
                newChar = characters[Math.floor(Math.random() * characters.length)];
            } while (
                newChar === charElement.getAttribute('data-character') || 
                newChar === targetChar
            );
        } else {
            // Final cycle shows the target character
            newChar = targetChar;
        }
        
        // Update the character
        charElement.innerHTML = '';
        createDotMatrix(charElement, newChar);
        
        // Continue cycling with increasing delay or stop
        if (cycleCount < totalCycles) {
            setTimeout(cycle, delay);
        } else {
            // Final animation effect to settle
            charElement.style.transform = 'scale(1)';
        }
    };
    
    // Start the first cycle
    setTimeout(cycle, 50);
}

function clearDotCharacters() {
    const charElements = document.querySelectorAll('.dot-character');
    charElements.forEach(el => {
        el.innerHTML = '';
    });
}

// GSAP-like minimal animation utility for cursor
const gsap = {
    to: (element, props) => {
        if (!element) return;
        
        const duration = props.duration || 0;
        delete props.duration;
        
        const startTime = Date.now();
        const initialValues = {};
        
        // Get initial values
        for (const prop in props) {
            if (prop === 'left' || prop === 'top') {
                initialValues[prop] = parseFloat(element.style[prop]) || 0;
            }
        }
        
        // Create animation frame
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            
            // Update properties
            for (const prop in props) {
                if (prop === 'left' || prop === 'top') {
                    const value = initialValues[prop] + (props[prop] - initialValues[prop]) * progress;
                    element.style[prop] = `${value}px`;
                }
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
};

// Utility function to debounce events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add smooth scrolling to anchor links
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Apply scroll animation
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Add the keyboard secret functionality
function initKeyboardSecret() {
    let secretBuffer = '';
    const secretTimeout = 1500; // Clear buffer after 1.5 seconds of inactivity
    let secretTimer;
    
    // Add event listener for keyboard input
    document.addEventListener('keydown', (e) => {
        // Reset the inactivity timer since keyboard is interaction
        resetInactivityTimer();
        
        // Only process if the key is a valid character we can display
        const key = e.key.toUpperCase();
        if (isValidSecretKey(key)) {
            // Flash the screen subtly to indicate secret activation
            flashSecretActivation();
            
            // Change all dot characters to the pressed key
            changeAllCharactersTo(key);
            
            // Reset the secret buffer timer
            clearTimeout(secretTimer);
            secretTimer = setTimeout(() => {
                secretBuffer = '';
            }, secretTimeout);
        }
    });
}

// Check if the key is one we can display as a dot matrix
function isValidSecretKey(key) {
    // Only accept characters that have specific patterns defined
    return characters.includes(key);
}

// Change all characters on screen to the same specified character
function changeAllCharactersTo(char) {
    // Convert to uppercase to ensure consistency
    char = char.toUpperCase();
    
    // Add visual feedback about which character was pressed
    const feedback = document.createElement('div');
    feedback.className = 'key-feedback';
    feedback.textContent = char;
    feedback.style.position = 'fixed';
    feedback.style.top = '50%';
    feedback.style.left = '50%';
    feedback.style.transform = 'translate(-50%, -50%)';
    feedback.style.fontSize = '120px';
    feedback.style.fontWeight = 'bold';
    feedback.style.color = 'rgba(99, 102, 241, 0.2)';
    feedback.style.pointerEvents = 'none';
    feedback.style.zIndex = '9999';
    feedback.style.opacity = '0';
    feedback.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    document.body.appendChild(feedback);
    
    // Animate the feedback
    setTimeout(() => { 
        feedback.style.opacity = '1';
        feedback.style.transform = 'translate(-50%, -50%) scale(1.2)';
    }, 10);
    setTimeout(() => { 
        feedback.style.opacity = '0';
        feedback.style.transform = 'translate(-50%, -50%) scale(0.8)';
    }, 300);
    setTimeout(() => { document.body.removeChild(feedback); }, 600);
    
    const allCharElements = document.querySelectorAll('.dot-character');
    allCharElements.forEach(element => {
        // Skip if already showing this character
        if (element.getAttribute('data-character') !== char) {
            // Use a quick transition to the new character
            element.innerHTML = '';
            createDotMatrix(element, char);
            
            // Add a quick scale animation
            element.style.transform = 'scale(1.05)';
            setTimeout(() => {
                element.style.transform = '';
            }, 200);
        }
    });
}

// Flash effect to indicate secret activation
function flashSecretActivation() {
    const flash = document.createElement('div');
    flash.className = 'secret-flash';
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100%';
    flash.style.height = '100%';
    flash.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
    flash.style.pointerEvents = 'none';
    flash.style.zIndex = '9998';
    flash.style.opacity = '0';
    flash.style.transition = 'opacity 0.2s ease';
    
    document.body.appendChild(flash);
    
    // Animate the flash
    setTimeout(() => { flash.style.opacity = '1'; }, 10);
    setTimeout(() => { flash.style.opacity = '0'; }, 200);
    setTimeout(() => { document.body.removeChild(flash); }, 400);
} 