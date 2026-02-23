document.addEventListener('DOMContentLoaded', () => {
    
    
    // Add secret console messages
    console.log("Definitely dont type 'fishy' into your keyboard");
    
    // Create limited number of characters for performance
    createDefaultCharacters();
    
    // Check if we're on mobile - don't create extra characters
    if (window.innerWidth > 768) {
    createFeaturedProjectCharacter();
    createAboutSectionCharacter();
    createSkillsSectionCharacter();
    }
    
    // Create skill page characters (for cybersecurity, hardware, software pages)
    createSkillPageCharacters();
    
    // Initialize custom cursor
    initCustomCursor();
    
    // Initialize inactivity timer
    initInactivityTimer();
    
    // Add keyboard secret
    initKeyboardSecret();
    
    // Initialize mobile navigation
    initMobileNavigation();
    
    // Initialize scroll progress bar
    initScrollProgress();
    
    // Initialize Lucide icons
    initLucideIcons();
    
    // Initialize section detection
    initSectionDetection();
    
    // Initialize featured 3D cubes
    if (window.innerWidth > 768) {
        initFeaturedCubes();
    }
    
    // Initialize scroll reveal animations
    initScrollReveal();
    
    // Initialize section number ticker animations
    initSectionTickers();
    
    // Initialize word swap animation
    initWordSwap();
    
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
            // Get characters only from the current section
            const currentSection = getCurrentSection();
            const charactersInSection = getCharactersInSection(currentSection);
            
            if (charactersInSection.length > 0) {
                // Pick a random character from the current section
                const randomChar = charactersInSection[Math.floor(Math.random() * charactersInSection.length)];
            changeCharacter(randomChar);
            resetInactivityTimer();
            }
        }
    });
    
    // Reset inactivity timer on any interaction
    document.addEventListener('mousemove', debounce(() => {
        resetInactivityTimer();
    }, 100), { passive: true });
    
    // Dot hover: throttle with rAF to avoid lag (one update per frame)
    let mouseX = 0, mouseY = 0;
    let rafScheduled = false;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!rafScheduled) {
            rafScheduled = true;
            requestAnimationFrame(() => {
                rafScheduled = false;
                handleMouseMove(mouseX, mouseY);
            });
        }
    }, { passive: true });
    
    // Separate custom cursor movement to be smoother (no debounce)
    document.addEventListener('mousemove', (e) => {
        moveCustomCursor(e);
    }, { passive: true });
    
    // Add hover effects for interactive elements
    addHoverEffects();
    
    // Add page load animation - optimized for performance
    animatePageLoad();
    
    // Add smooth scrolling to anchor links
    addSmoothScrolling();
    
    // Hero tag scramble/decode on hover
    initHeroTagScramble();
    
    // Initialize characters and animations immediately (no entrance delay)
    setTimeout(() => {
        const char1 = document.getElementById('char1');
        const char2 = document.getElementById('char2');
        const char3 = document.getElementById('char3');
        
        if (char1) cycleToSpecificCharacter(char1, 'D');
        if (char2) cycleToSpecificCharacter(char2, 'E');
        if (char3) cycleToSpecificCharacter(char3, 'V');
    }, 100);
    
    // Trigger section animations immediately
    setTimeout(() => {
        animateSections();
    }, 200);
    
    // Handle resize events - throttled for performance
    window.addEventListener('resize', debounce(() => {
        // Only recreate characters if browser width changes category (mobile/desktop)
        const wasDesktop = window.innerWidth > 768;
        
        clearDotCharacters();
        createDefaultCharacters();
        
        if (wasDesktop) {
        createFeaturedProjectCharacter();
        createAboutSectionCharacter();
        createSkillsSectionCharacter();
        }
        
        // Recreate skill page characters on resize
        createSkillPageCharacters();
        
    }, 300), { passive: true });
});


// Animate sections on entrance
function animateSections() {
    const sections = document.querySelectorAll('.section-animate');
    sections.forEach((section, index) => {
        setTimeout(() => {
            section.classList.add('animate-in');
        }, index * 200);
    });
    
    // Animate staggered children
    setTimeout(() => {
        const staggerContainers = document.querySelectorAll('.stagger-children');
        staggerContainers.forEach(container => {
            container.classList.add('animate-in');
        });
    }, 600);
}

// Scroll Reveal Animations
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    if (!('IntersectionObserver' in window)) {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('revealed'));
        return;
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => observer.observe(el));
}

// Enhanced section animations with scroll trigger
function animatePageLoad() {
    const elements = [
        document.querySelector('header'),
        document.querySelector('.hero-top-meta'),
        document.querySelector('.hero-title-block'),
        document.querySelector('.hero-info-col'),
        document.querySelector('.hero-visual-col'),
        document.querySelector('.hero-scroll-cue'),
        document.querySelector('.left-column'),
        document.querySelector('.right-column'),
        document.querySelector('.scroll-indicator')
    ].filter(el => el);
    
    const initialStyles = elements.map(el => {
        const opacity = window.getComputedStyle(el).opacity;
        const transform = window.getComputedStyle(el).transform;
        return { element: el, opacity, transform };
    });
    
    initialStyles.forEach(item => {
        item.element.style.opacity = '0';
        item.element.style.transform = 'translateY(30px)';
        item.element.style.transition = 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
    });
    
    document.body.offsetHeight;
    
    setTimeout(() => {
        elements.forEach((el, index) => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            el.style.transitionDelay = `${index * 0.12}s`;
        });
    }, 200);

    // Animate title words with stagger
    const titleWords = document.querySelectorAll('.title-word');
    titleWords.forEach((word, i) => {
        word.style.opacity = '0';
        word.style.transform = 'translateY(100%)';
        word.style.transition = 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
    });
    
    document.body.offsetHeight;
    
    setTimeout(() => {
        titleWords.forEach((word, i) => {
            word.style.transitionDelay = `${0.3 + i * 0.1}s`;
            word.style.opacity = '1';
            word.style.transform = 'translateY(0)';
        });
    }, 100);
}

// Inactivity timer variables
let inactivityTimeout;
const inactivityDelay = 5000; // 20 seconds

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
    // Get the current active section
    const currentSection = getCurrentSection();
    
    // Reset only characters in the current section
    const characters = getCharactersInSection(currentSection);
    
    characters.forEach(char => {
        const charId = char.id;
        
        if (charId === 'char1' || charId === 'char2' || charId === 'char3') {
            // Main hero characters
            const letters = ['D', 'E', 'V'];
            const letterIndex = ['char1', 'char2', 'char3'].indexOf(charId);
            if (letterIndex >= 0 && letterIndex < letters.length) {
                cycleToSpecificCharacter(char, letters[letterIndex]);
            }
        } else if (charId === 'featured-char') {
            // Featured project character
            cycleToSpecificCharacter(char, 'P');
        } else if (charId === 'about-char') {
            // About section character
            cycleToSpecificCharacter(char, 'A');
        } else if (charId === 'skills-char') {
            // Skills section character
            cycleToSpecificCharacter(char, 'S');
        }
    });
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

// Create skill page characters
function createSkillPageCharacters() {
    // Hero character for skill pages
    const heroChar = document.getElementById('hero-char');
    if (heroChar) {
        createDotMatrix(heroChar, 'S');
    }
    
    // Flipper character for hardware/cybersecurity pages
    const flipperChar = document.getElementById('flipper-char');
    if (flipperChar) {
        createDotMatrix(flipperChar, 'F');
    }
    
    // Wireless character for cybersecurity pages
    const wirelessChar = document.getElementById('wireless-char');
    if (wirelessChar) {
        createDotMatrix(wirelessChar, 'W');
    }
    
    // Security reference character for hardware pages
    const securityRefChar = document.getElementById('security-reference-char');
    if (securityRefChar) {
        createDotMatrix(securityRefChar, 'S');
    }
    

}

// Featured 3D cube — Three.js interactive block
// Set data-texture="your-image.png" on .featured-cube-container to apply a custom texture.
// Uses NearestFilter for crisp pixel-art textures (Minecraft style).
function initFeaturedCubes() {
    if (typeof THREE === 'undefined') return;
    document.querySelectorAll('.featured-cube-container').forEach(container => {
        if (container.clientWidth === 0 || container.clientHeight === 0) return;
        setupCube(container);
    });
}

function setupCube(container) {
    const w = container.clientWidth;
    const h = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    camera.position.set(0, -1.2, 5.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    // Geometry — size from data-cube-size or default 2.2
    const size = parseFloat(container.dataset.cubeSize) || 2.2;
    const geometry = new THREE.BoxGeometry(size, size, size);

    // Material — per-face textures, single texture, or dark fallback
    // Face order: right, left, top, bottom, front, back
    const faceKeys = ['right', 'left', 'top', 'bottom', 'front', 'back'];
    const fallbackTex = container.dataset.texture || '';
    const loader = new THREE.TextureLoader();

    function loadTex(path) {
        const tex = loader.load(path, () => renderer.render(scene, camera));
        tex.minFilter = THREE.NearestFilter;
        tex.magFilter = THREE.NearestFilter;
        tex.encoding = THREE.sRGBEncoding;
        return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55, metalness: 0.15 });
    }

    const defaultMat = new THREE.MeshStandardMaterial({ color: 0x111115, roughness: 0.35, metalness: 0.6 });

    const hasPerFace = faceKeys.some(k => container.dataset['texture' + k.charAt(0).toUpperCase() + k.slice(1)]);
    let material;

    if (hasPerFace) {
        material = faceKeys.map(k => {
            const path = container.dataset['texture' + k.charAt(0).toUpperCase() + k.slice(1)];
            return path ? loadTex(path) : (fallbackTex ? loadTex(fallbackTex) : defaultMat);
        });
    } else if (fallbackTex) {
        material = loadTex(fallbackTex);
    } else {
        material = defaultMat;
    }

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Accent wireframe edges
    const edges = new THREE.EdgesGeometry(geometry);
    const edgeMat = new THREE.LineBasicMaterial({
        color: 0x6366f1,
        transparent: true,
        opacity: 0.45,
    });
    const wireframe = new THREE.LineSegments(edges, edgeMat);
    cube.add(wireframe);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.7);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x8888cc, 0.25);
    fillLight.position.set(-4, -2, 2);
    scene.add(fillLight);

    const accentLight = new THREE.PointLight(0x6366f1, 0.8, 12);
    accentLight.position.set(-3, 2, 3);
    scene.add(accentLight);

    // Global mouse tracking — parallax across the full page
    let pageMouseNX = 0, pageMouseNY = 0;

    document.addEventListener('mousemove', (e) => {
        pageMouseNX = (e.clientX / window.innerWidth - 0.5) * 2;
        pageMouseNY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    // Animation
    let targetRotX = Math.PI * 0.18;
    let targetRotY = Math.PI * 0.25;

    function animate() {
        requestAnimationFrame(animate);
        const t = performance.now() * 0.001;

        // Orbiting accent light
        accentLight.position.x = Math.sin(t * 0.4) * 4;
        accentLight.position.z = Math.cos(t * 0.4) * 4;
        accentLight.position.y = Math.sin(t * 0.25) * 2 + 2;

        // Wireframe pulse
        edgeMat.opacity = 0.3 + Math.sin(t * 1.5) * 0.15;

        // Rotation — slow idle spin + full-page mouse parallax tilt
        const idleRotY = t * 0.25;
        const idleRotX = Math.PI * -0.12 + Math.sin(t * 0.3) * 0.08;

        targetRotX = idleRotX + pageMouseNY * 0.35;
        targetRotY = idleRotY + pageMouseNX * 0.5;

        cube.rotation.x += (targetRotX - cube.rotation.x) * 0.04;
        cube.rotation.y += (targetRotY - cube.rotation.y) * 0.04;

        renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', debounce(() => {
        const nw = container.clientWidth;
        const nh = container.clientHeight;
        if (nw === 0 || nh === 0) return;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
    }, 250), { passive: true });
}

// Toggle: blob wrapping on hover. Can also be toggled by typing "snap" anywhere on the page.
let CURSOR_WRAP_SNAPPING = true;

// Custom cursor: blobby dot, smooth follow, wrap-on-hover, liquid morph
(function() {
    let cursorDot = null;
    let targetX = -100, targetY = -100;
    let currentX = -100, currentY = -100;
    let prevX = -100, prevY = -100;
    const smooth = 0.16;
    const wrapPadding = 12;
    let rafId = null;
    let wrapElement = null;
    let liquidPhase = 0;

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function tick() {
        liquidPhase += 0.022;
        if (!cursorDot) {
            rafId = requestAnimationFrame(tick);
            return;
        }

        if (wrapElement) {
            const rect = wrapElement.getBoundingClientRect();
            const l = rect.left - wrapPadding;
            const t = rect.top - wrapPadding;
            const w = rect.width + wrapPadding * 2;
            const h = rect.height + wrapPadding * 2;
            currentX = rect.left + rect.width / 2;
            currentY = rect.top + rect.height / 2;
            targetX = currentX;
            targetY = currentY;
            cursorDot.classList.add('cursor-dot--wrapping');
            cursorDot.style.transform = 'translate(0, 0)';
            cursorDot.style.left = `${l}px`;
            cursorDot.style.top = `${t}px`;
            cursorDot.style.width = `${w}px`;
            cursorDot.style.height = `${h}px`;
            cursorDot.style.borderRadius = '22px 18px 24px 20px';
            cursorDot.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
        } else {
            cursorDot.classList.remove('cursor-dot--wrapping');
            currentX = lerp(currentX, targetX, smooth);
            currentY = lerp(currentY, targetY, smooth);
            const vx = currentX - prevX;
            const vy = currentY - prevY;
            prevX = currentX;
            prevY = currentY;
            const speed = Math.min(Math.hypot(vx, vy) * 0.15, 1.2);
            const stretch = 1 + speed * 0.2;
            const squash = 1 / Math.sqrt(stretch);
            const angle = Math.atan2(vy, vx);
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const scaleX = squash + (stretch - squash) * cos * cos;
            const scaleY = squash + (stretch - squash) * sin * sin;
            const wobble = 0.08 * Math.sin(liquidPhase) + 0.02 * Math.sin(liquidPhase * 2.3);
            const br = `${50 + wobble * 20}% ${50 - wobble * 15}% ${50 + wobble * 18}% ${50 - wobble * 12}%`;
            cursorDot.style.left = `${currentX}px`;
            cursorDot.style.top = `${currentY}px`;
            cursorDot.style.transform = `translate(-50%, -50%) scale(${scaleX}, ${scaleY})`;
            cursorDot.style.width = '20px';
            cursorDot.style.height = '20px';
            cursorDot.style.borderRadius = br;
            cursorDot.style.backgroundColor = '';
        }
        rafId = requestAnimationFrame(tick);
    }

    function initCustomCursor() {
        cursorDot = document.querySelector('.cursor-dot');
        if (cursorDot) {
            cursorDot.style.top = '-100px';
            cursorDot.style.left = '-100px';
            if (rafId == null) rafId = requestAnimationFrame(tick);
        }
    }

    function moveCustomCursor(e) {
        targetX = e.clientX;
        targetY = e.clientY;
    }

    function setWrapElement(el) {
        wrapElement = el;
    }

    function clearWrapElement(e) {
        if (e) {
            targetX = e.clientX;
            targetY = e.clientY;
        }
        wrapElement = null;
    }

    window.initCustomCursor = initCustomCursor;
    window.moveCustomCursor = moveCustomCursor;
    window.setCursorWrapElement = setWrapElement;
    window.clearCursorWrapElement = clearWrapElement;
})();

function addHoverEffects() {
    const interactiveElements = document.querySelectorAll('.cta, button, .interactive-hover, .footer-email-btn, .contact-btn, .featured-link, .demo-link, .project-link');
    const cursorDot = document.querySelector('.cursor-dot');
    if (!cursorDot) return;

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (CURSOR_WRAP_SNAPPING) { 
                window.setCursorWrapElement(el);
            }
        });
        el.addEventListener('mouseleave', (e) => {
            window.clearCursorWrapElement(e);
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
    
    // Ensure container has proper dimensions by checking CSS
    const computedStyle = window.getComputedStyle(container);
    const width = parseFloat(computedStyle.width) || 200; // Default width if not set
    const height = parseFloat(computedStyle.height) || 200; // Default height if not set
    
    // Calculate grid size based on container dimensions and classes
    const isLarge = container.classList.contains('large');
    const isMedium = container.classList.contains('medium');
    
    // Adjust grid density based on container size - reduce density for better performance
    const cols = isLarge ? 12 : isMedium ? 10 : 8;
    const rows = isLarge ? 16 : isMedium ? 12 : 10;
    container.setAttribute('data-cols', cols);
    container.setAttribute('data-rows', rows);
    
    // Calculate dot size and spacing
    const dotSize = 4;
    const colSpacing = width / (cols + 1);
    const rowSpacing = height / (rows + 1);
    
    // Create a document fragment for better performance
    const fragment = document.createDocumentFragment();
    
    // Create grid
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            // Check if this dot is part of the character before creating DOM element
            const isActive = isPartOfCharacter(character, x, y, cols, rows);
            
            // Skip creating inactive dots for performance (reduced DOM nodes)
            if (!isActive && Math.random() > 0.3) {
                continue;
            }
            
            const dot = document.createElement('div');
            dot.className = isActive ? 'dot active-dot' : 'dot inactive-dot';
            
            // Position dot
            const left = (x + 1) * colSpacing - dotSize / 2;
            const top = (y + 1) * rowSpacing - dotSize / 2;
            
            dot.style.left = `${left}px`;
            dot.style.top = `${top}px`;
            
            // Set active status
            dot.dataset.isActive = isActive ? 'true' : 'false';
            
            // Store position for later use with mouse interactivity
            dot.dataset.x = x;
            dot.dataset.y = y;
            
            fragment.appendChild(dot);
        }
    }
    
    // Append all dots at once for better performance
    container.appendChild(fragment);
    
    // Add staggered animation for active dots - limit the number for performance
    const activeDots = container.querySelectorAll('.active-dot');
    const animationLimit = Math.min(activeDots.length, 50); // Limit animations
    
    for (let i = 0; i < animationLimit; i++) {
        const dot = activeDots[i];
        setTimeout(() => {
            dot.style.transform = 'scale(1.3)';
            setTimeout(() => {
                dot.style.transform = 'scale(1)';
            }, 300);
        }, i * 8);
    }
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

function handleMouseMove(mouseX, mouseY) {
    const charContainers = document.querySelectorAll('.dot-character');
    const viewportHeight = window.innerHeight;
    const maxDistance = 120;

    for (let i = 0; i < charContainers.length; i++) {
        const container = charContainers[i];
        const containerRect = container.getBoundingClientRect();

        if (containerRect.bottom < 0 || containerRect.top > viewportHeight) continue;

        const centerX = containerRect.left + containerRect.width / 2;
        const centerY = containerRect.top + containerRect.height / 2;
        const distance = Math.hypot(mouseX - centerX, mouseY - centerY);
        const maxRadius = Math.max(containerRect.width, containerRect.height) * 1.5;

        if (distance < maxRadius) {
            const rotateX = (mouseY - centerY) / 25;
            const rotateY = (mouseX - centerX) / -25;
            container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            const cols = parseInt(container.getAttribute('data-cols'), 10) || 10;
            const rows = parseInt(container.getAttribute('data-rows'), 10) || 10;
            const colSpacing = containerRect.width / (cols + 1);
            const rowSpacing = containerRect.height / (rows + 1);
            const dots = container.querySelectorAll('.dot');

            for (let d = 0; d < dots.length; d++) {
                const dot = dots[d];
                const x = parseInt(dot.dataset.x, 10) || 0;
                const y = parseInt(dot.dataset.y, 10) || 0;
                const dotCenterX = containerRect.left + (x + 1) * colSpacing;
                const dotCenterY = containerRect.top + (y + 1) * rowSpacing;
                const distanceToDot = Math.hypot(mouseX - dotCenterX, mouseY - dotCenterY);

                if (distanceToDot < maxDistance) {
                    const isActive = dot.dataset.isActive === 'true';
                    const intensity = 1 - distanceToDot / maxDistance;
                    const push = 8 * intensity;
                    const angle = Math.atan2(dotCenterY - mouseY, dotCenterX - mouseX);
                    const pushX = Math.cos(angle) * push;
                    const pushY = Math.sin(angle) * push;
                    if (isActive) {
                        dot.style.transform = `translate3d(${pushX}px, ${pushY}px, 0) scale(${1 + intensity * 0.5})`;
                        dot.style.boxShadow = `0 0 ${8 + intensity * 12}px rgba(99, 102, 241, ${0.5 + intensity * 0.4})`;
                    } else {
                        dot.style.transform = `translate3d(${pushX}px, ${pushY}px, 0)`;
                        dot.style.opacity = Math.min(0.4, 0.05 + intensity * 0.5);
                    }
                } else {
                    if (dot.dataset.isActive === 'false') {
                        dot.style.transform = 'translate3d(0, 0, 0)';
                        dot.style.opacity = '0.05';
                    } else {
                        dot.style.transform = 'translate3d(0, 0, 0)';
                        dot.style.boxShadow = '0 0 8px rgba(99, 102, 241, 0.6)';
                    }
                }
            }
        } else if (container.style.transform) {
            container.style.transform = '';
            const dots = container.querySelectorAll('.dot');
            for (let d = 0; d < dots.length; d++) {
                const dot = dots[d];
                if (dot.dataset.isActive === 'false') {
                    dot.style.transform = 'translate3d(0, 0, 0)';
                    dot.style.opacity = '0.05';
                } else {
                    dot.style.transform = 'translate3d(0, 0, 0)';
                    dot.style.boxShadow = '0 0 8px rgba(99, 102, 241, 0.6)';
                }
            }
        }
    }
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
    
    // Define the secret code sequence
    const konamiCode = "ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba";
    const fishyCode = "fishy";
    const snapCode = "snap";
    
    // Add event listener for keyboard input
    document.addEventListener('keydown', (e) => {
        // Reset the inactivity timer since keyboard is interaction
        resetInactivityTimer();
        
        // First, handle the special key sequence
        const key = e.key;
        
        // Append the key to the buffer
        secretBuffer += key;
        
        // Check if buffer contains the secret sequence
        if (secretBuffer.includes(konamiCode)) {
            // Activate the konami code secret
            activateKonamiSecret();
            // Reset the buffer after successful activation
            secretBuffer = '';
        } else if (secretBuffer.includes(fishyCode)) {
            // Activate the fishy secret
            activateFishySecret();
            // Reset the buffer after successful activation
            secretBuffer = '';
        } else if (secretBuffer.toLowerCase().includes(snapCode)) {
            // Toggle cursor wrap snapping
            CURSOR_WRAP_SNAPPING = !CURSOR_WRAP_SNAPPING;
            secretBuffer = '';
            showSnapToggleFeedback();
        }
        
        // Handle any letter key for dot character interaction
        if (/^[A-Za-z]$/.test(key)) {
            // Flash the screen subtly to indicate key press
            flashSecretActivation();
            
            // Change all dot characters to the pressed key
            changeAllCharactersTo(key.toUpperCase());
        }
            
            // Reset the secret buffer timer
            clearTimeout(secretTimer);
            secretTimer = setTimeout(() => {
                secretBuffer = '';
            }, secretTimeout);
    });
}

// Activate the Konami Code secret effect
function activateKonamiSecret() {
    // Skip the confirmation overlay and activate trip mode immediately
    activatePsychedelicMode();
}

// Activate the power mode that transforms the site with psychedelic effects
function activatePsychedelicMode() {
    // Set a flag to indicate power mode is active
    window.powerModeActive = true;
    
    // Add power mode class to body for CSS hooks
    document.body.classList.add('power-mode');
    
    // Create style for animation with more intense effects
    const style = document.createElement('style');
    style.id = 'power-mode-styles';
    style.textContent = `
        @keyframes pulse {
            0% { opacity: 0.7; }
            50% { opacity: 1; }
            100% { opacity: 0.7; }
        }
        
        /* Psychedelic page warping effect - MUCH more intense */
        @keyframes warpEffect {
            0% { transform: scale(1) skew(0deg); filter: hue-rotate(0deg) contrast(1.2); }
            25% { transform: scale(1.05) skew(1deg); filter: hue-rotate(90deg) contrast(1.3) saturate(1.3); }
            50% { transform: scale(0.97) skew(-1deg); filter: hue-rotate(180deg) contrast(1.4) saturate(1.5); }
            75% { transform: scale(1.05) skew(0.8deg); filter: hue-rotate(270deg) contrast(1.3) saturate(1.3); }
            100% { transform: scale(1) skew(0deg); filter: hue-rotate(360deg) contrast(1.2); }
        }
        
        /* Intense breathing animation for all elements */
        @keyframes breathing {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }

        /* Extreme glowing text animation */
        @keyframes textGlow {
            0% { text-shadow: 0 0 5px currentColor; }
            50% { text-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
            100% { text-shadow: 0 0 5px currentColor; }
        }
        
        body.power-mode {
            animation: warpEffect 15s infinite alternate;
            transition: filter 0.5s ease;
        }
        
        .power-mode section, .power-mode header, .power-mode footer {
            animation: breathing 6s infinite ease-in-out;
            transition: all 0.2s ease !important;
            filter: saturate(1.5);
        }
        
        .power-mode h1, .power-mode h2, .power-mode h3, .power-mode p {
            animation: breathing 4s infinite ease-in-out, textGlow 3s infinite ease-in-out;
            transition: text-shadow 0.2s ease, color 0.2s ease !important;
        }
        
        .power-mode .dot-character {
            transition: transform 0.05s cubic-bezier(0.19, 1, 0.22, 1) !important;
            animation: breathing 2s infinite ease-in-out !important;
            filter: contrast(1.2) saturate(1.5);
        }
        
        .power-mode img, .power-mode .project-card {
            animation: breathing 5s infinite ease-in-out;
            filter: saturate(1.8) contrast(1.2) !important;
            transition: all 0.2s ease !important;
            transform-origin: center center;
        }
        
        .power-mode .dot {
            transition: transform 0.05s ease, opacity 0.05s ease, box-shadow 0.05s ease !important;
        }
        
        .power-mode .active-dot {
            box-shadow: 0 0 25px var(--accent-color) !important;
        }
        
        .power-mode-dot {
            position: absolute;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            opacity: 0.9;
            animation: fade-out 2s forwards;
        }
        
        @keyframes fade-out {
            0% { transform: scale(1.5); opacity: 0.9; }
            100% { transform: scale(0); opacity: 0; }
        }
        
        /* Override the cursor:none setting to allow normal cursor */
        .power-mode * {
            cursor: auto !important;
        }
        
        .power-mode a, .power-mode button, .power-mode .cta {
            cursor: pointer !important;
            text-shadow: 0 0 12px currentColor !important;
            transition: all 0.2s ease !important;
            filter: brightness(1.3);
        }
        
        .power-mode .project-card:hover {
            transform: scale(1.08) rotate(2deg) !important;
            box-shadow: 0 10px 30px rgba(99, 102, 241, 0.6) !important;
        }
    `;
    document.head.appendChild(style);
    
    // Hide the original cursor element
    const originalCursor = document.querySelector('.cursor-dot');
    if (originalCursor) {
        originalCursor.style.display = 'none';
    }
    
    const cursorOutline = document.querySelector('.cursor-outline');
    if (cursorOutline) {
        cursorOutline.style.display = 'none';
    }
    
    // Add color cycling to all text elements with more intense colors
    const textElements = document.querySelectorAll('h1, h2, h3, h4, p, span, a');
    startColorCycling(textElements);
    
    // Add trail effect to cursor
    document.addEventListener('mousemove', createCursorTrail);
    
    // Add warp effect to the page
    addWarpEffect();
    
    // Start permanently changing characters much faster
    startCharacterCycling();
    
    // Enhance dot interaction
    const originalHandleMouseMove = handleMouseMove;
    window.handleMouseMove = function(e) {
        if (window.powerModeActive) {
            // Call with boosted effects
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            // Get characters in viewport
            const charContainers = document.querySelectorAll('.dot-character');
            const viewportHeight = window.innerHeight;
            
            charContainers.forEach(container => {
                const containerRect = container.getBoundingClientRect();
                
                // Skip elements not in viewport
                if (containerRect.bottom < 0 || containerRect.top > viewportHeight) {
                    return;
                }
                
                // Calculate distance from mouse to container
                const centerX = containerRect.left + containerRect.width / 2;
                const centerY = containerRect.top + containerRect.height / 2;
                const distance = Math.sqrt(
                    Math.pow(mouseX - centerX, 2) + 
                    Math.pow(mouseY - centerY, 2)
                );
                
                // Enhanced rotation and effects for power mode with increased radius
                const maxRadius = Math.max(containerRect.width, containerRect.height) * 5; // Greatly increased radius
                if (distance < maxRadius) {
                    // More dramatic rotation with sin/cos oscillation
                    const time = Date.now() / 1000;
                    const rotateX = (mouseY - centerY) / 5 + Math.sin(time) * 10; // Stronger rotation
                    const rotateY = (mouseX - centerX) / -5 + Math.cos(time) * 10; // Stronger rotation
                    
                    // Add scale effect based on proximity with oscillation
                    const proximityScale = 1 + Math.max(0, (1 - distance / maxRadius)) * 0.5; // More scaling
                    const oscillation = Math.sin(time * 5) * 0.08; // Faster, stronger oscillation
                    
                    container.style.transform = `perspective(300px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${proximityScale + oscillation})`;
                    
                    // Enhanced dot effects with more range
                    const dots = container.querySelectorAll('.dot');
                    const maxDistance = 500; // Much larger range
                    
                    dots.forEach(dot => {
                        const dotRect = dot.getBoundingClientRect();
                        const dotCenterX = dotRect.left + dotRect.width / 2;
                        const dotCenterY = dotRect.top + dotRect.height / 2;
                        
                        const distanceToDot = Math.sqrt(
                            Math.pow(mouseX - dotCenterX, 2) + 
                            Math.pow(mouseY - dotCenterY, 2)
                        );
                        
                        if (distanceToDot < maxDistance) {
                            const isActive = dot.dataset.isActive === 'true';
                            const intensity = 1 - distanceToDot / maxDistance;
                            // Add sin wave oscillation to the push effect
                            const push = 50 * intensity * (1 + Math.sin(time * 6) * 0.4); // Much stronger push
                            
                            // Calculate direction with swirling
                            const swirl = Math.sin(time * 3) * Math.PI / 3; // More intense swirling
                            const angleRadians = Math.atan2(dotCenterY - mouseY, dotCenterX - mouseX) + swirl * intensity;
                            const pushX = Math.cos(angleRadians) * push;
                            const pushY = Math.sin(angleRadians) * push;
                            
                            // Apply enhanced styles
                            if (isActive) {
                                // More dramatic effect with rotation and oscillation
                                const randomRotate = (Math.random() - 0.5) * 90 * intensity + Math.sin(time * 4 + parseFloat(dot.dataset.x || 0)) * 45;
                                const scaleOsc = 1 + intensity * 2 + Math.sin(time * 7 + parseFloat(dot.dataset.y || 0)) * 0.5;
                                dot.style.transform = `translate3d(${pushX}px, ${pushY}px, 0) scale(${scaleOsc}) rotate(${randomRotate}deg)`;
                                
                                // More vibrant rainbow color effect with cycling
                                const hue = (time * 150 + distanceToDot + parseFloat(dot.dataset.x || 0) * 10) % 360;
                                dot.style.backgroundColor = `hsl(${hue}, 100%, 70%)`;
                                dot.style.boxShadow = `0 0 ${30 + intensity * 40 + Math.sin(time * 8) * 15}px hsl(${hue}, 100%, 60%)`;
                            } else {
                                // More visible inactive dots
                                const smallRotate = (Math.random() - 0.5) * 50 * intensity;
                                dot.style.transform = `translate3d(${pushX}px, ${pushY}px, 0) rotate(${smallRotate}deg)`;
                                
                                // More colorful inactive dots
                                const hue = (time * 80 + parseFloat(dot.dataset.y || 0) * 30) % 360;
                                dot.style.backgroundColor = `hsla(${hue}, 100%, 70%, ${Math.min(0.9, 0.2 + intensity * 0.8)})`;
                                dot.style.opacity = Math.min(0.9, 0.2 + intensity * 0.8);
                            }
                        } else {
                            // Reset style when out of range with subtle animation
                            if (dot.dataset.isActive === 'false') {
                                const resetOsc = Math.sin(time * 4 + parseFloat(dot.dataset.x || 0) * 15) * 0.1;
                                dot.style.transform = `translate3d(0, 0, 0) scale(${1 + resetOsc})`;
                                dot.style.opacity = Math.max(0.05, 0.2 + resetOsc);
                            } else {
                                const hue = (time * 150 + parseFloat(dot.dataset.y || 0) * 30) % 360;
                                const resetOsc = Math.sin(time * 3 + parseFloat(dot.dataset.y || 0) * 15) * 0.15;
                                dot.style.transform = `translate3d(0, 0, 0) scale(${1 + resetOsc})`;
                                dot.style.backgroundColor = `hsl(${hue}, 100%, 70%)`;
                                dot.style.boxShadow = `0 0 ${10 + Math.sin(time * 5) * 10}px hsl(${hue}, 80%, 60%)`;
                            }
                        }
                    });
                } else if (container.style.transform) {
                    // Reset with subtle animation even when far away
                    const time = Date.now() / 1000;
                    const resetOsc = Math.sin(time * 3) * 0.08;
                    container.style.transform = `perspective(800px) scale(${1 + resetOsc})`;
                    
                    // Reset dots with subtle animation
                    const dots = container.querySelectorAll('.dot');
                    dots.forEach(dot => {
                        if (dot.dataset.isActive === 'false') {
                            dot.style.transform = `translate3d(0, 0, 0) scale(${1 + resetOsc * 0.5})`;
                            dot.style.opacity = '0.05';
                        } else {
                            const hue = (time * 150 + parseFloat(dot.dataset.y || 0) * 30) % 360;
                            dot.style.transform = `translate3d(0, 0, 0) scale(${1 + resetOsc})`;
                            dot.style.backgroundColor = `hsl(${hue}, 100%, 70%)`;
                            dot.style.boxShadow = `0 0 ${10 + Math.sin(time * 5) * 10}px hsl(${hue}, 80%, 60%)`;
                        }
                    });
                }
            });
        } else {
            // If power mode is not active, use the original function
            originalHandleMouseMove(e);
        }
    };
    
    // Save the original function for reference
    window.originalHandleMouseMove = originalHandleMouseMove;
    
    // Add deactivation button
    const deactivateBtn = document.createElement('button');
    deactivateBtn.textContent = 'End Trip';
    deactivateBtn.style.position = 'fixed';
    deactivateBtn.style.bottom = '10px';
    deactivateBtn.style.right = '10px';
    deactivateBtn.style.background = 'rgba(0,0,0,0.7)';
    deactivateBtn.style.color = 'white';
    deactivateBtn.style.border = 'none';
    deactivateBtn.style.padding = '5px 10px';
    deactivateBtn.style.borderRadius = '4px';
    deactivateBtn.style.zIndex = '9999';
    deactivateBtn.style.cursor = 'pointer';
    deactivateBtn.style.fontWeight = 'bold';
    
    document.body.appendChild(deactivateBtn);
    
    deactivateBtn.addEventListener('click', deactivatePowerMode);
    
    // Store all cleanup functions
    const cleanupFunctions = [];
    
    function deactivatePowerMode() {
        // Remove event listeners
        document.removeEventListener('mousemove', createCursorTrail);
        document.removeEventListener('dblclick', createRandomCharacter);
        document.removeEventListener('keydown', createRandomKeyCharacter);
        
        // Run all cleanup functions
        cleanupFunctions.forEach(fn => fn());
        
        // Restore original mouse move handler
        window.handleMouseMove = window.originalHandleMouseMove;
        
        // Restore original cursor handler
        if (window.originalMoveCustomCursor) {
            window.moveCustomCursor = window.originalMoveCustomCursor;
        }
        
        // Remove power mode elements
        const indicator = document.querySelector('.power-mode-indicator');
        if (indicator && document.body.contains(indicator)) {
            document.body.removeChild(indicator);
        }
        
        if (document.body.contains(deactivateBtn)) {
            document.body.removeChild(deactivateBtn);
        }
        
        // Remove styles
        const powerStyles = document.getElementById('power-mode-styles');
        if (powerStyles && document.head.contains(powerStyles)) {
            document.head.removeChild(powerStyles);
        }
        
        // Reset cursor
        const cursorDot = document.querySelector('.cursor-dot');
        if (cursorDot) {
            cursorDot.classList.remove('power-mode');
            cursorDot.style.position = '';
            cursorDot.style.zIndex = '';
        }
        
        const cursorOutline = document.querySelector('.cursor-outline');
        if (cursorOutline) {
            cursorOutline.style.position = '';
            cursorOutline.style.zIndex = '';
        }
        
        // Reset all transforms on elements
        document.querySelectorAll('section, header, div, h1, h2, h3, p, span, a').forEach(el => {
            el.style.transform = '';
            el.style.filter = '';
            el.style.color = '';
            el.style.textShadow = '';
        });
        
        // Reset body background
        document.body.style.backgroundPosition = '';
        
        // Remove temp characters
        document.querySelectorAll('.temp-character').forEach(char => {
            if (document.body.contains(char)) {
                document.body.removeChild(char);
            }
        });
        
        // Remove trails
        document.querySelectorAll('.power-mode-dot').forEach(dot => {
            if (document.body.contains(dot)) {
                document.body.removeChild(dot);
            }
        });
        
        // Reset all characters to normal
        document.querySelectorAll('.dot-character').forEach(char => {
            const currentChar = char.getAttribute('data-character');
            char.innerHTML = '';
            createDotMatrix(char, currentChar);
        });
        
        // Reset body class
        document.body.classList.remove('power-mode');
        
        // Reset flag
        window.powerModeActive = false;
    }
}

// Activate the Fishy Secret effect
function activateFishySecret() {
    // Create some swimming fish that move across the screen
    const fishCount = 15;
    const fishContainer = document.createElement('div');
    fishContainer.className = 'fish-container';
    fishContainer.style.position = 'fixed';
    fishContainer.style.top = '0';
    fishContainer.style.left = '0';
    fishContainer.style.width = '100%';
    fishContainer.style.height = '100%';
    fishContainer.style.pointerEvents = 'none';
    fishContainer.style.zIndex = '9999';
    fishContainer.style.overflow = 'hidden';
    
    document.body.appendChild(fishContainer);
    
    // Create fish with different colors, sizes, and speeds
    for (let i = 0; i < fishCount; i++) {
        createFish(fishContainer, i);
    }
    
    // Remove the fish after 15 seconds
    setTimeout(() => {
        fishContainer.style.opacity = '0';
        fishContainer.style.transition = 'opacity 1s ease';
        setTimeout(() => {
            if (document.body.contains(fishContainer)) {
                document.body.removeChild(fishContainer);
            }
        }, 1000);
    }, 15000);
}

// Create a single fish element
function createFish(container, index) {
    const fish = document.createElement('div');
    const isMovingRight = Math.random() > 0.5;
    
    // Random fish properties
    const size = 20 + Math.random() * 40;
    const speed = 5 + Math.random() * 10;
    const delay = Math.random() * 5;
    const verticalPos = 10 + Math.random() * 80;
    const hue = Math.random() * 360;
    
    fish.className = 'fish';
    fish.innerHTML = isMovingRight ? '&gt;&lt;&gt;' : '&lt;&gt;&lt;';
    fish.style.position = 'absolute';
    fish.style.top = `${verticalPos}vh`;
    fish.style.left = isMovingRight ? '-50px' : '100%';
    fish.style.fontSize = `${size}px`;
    fish.style.color = `hsl(${hue}, 80%, 60%)`;
    fish.style.transform = `scale(${isMovingRight ? 1 : -1}, 1)`;
    fish.style.textShadow = `0 0 5px hsl(${hue}, 80%, 80%)`;
    fish.style.animationDuration = `${10 - speed}s`;
    fish.style.animationDelay = `${delay}s`;
    fish.style.animationName = isMovingRight ? 'swimRight' : 'swimLeft';
    fish.style.animationTimingFunction = 'linear';
    fish.style.animationIterationCount = 'infinite';
    
    container.appendChild(fish);
    
    // Add CSS animation if it doesn't exist
    if (!document.getElementById('fish-animations')) {
        const style = document.createElement('style');
        style.id = 'fish-animations';
        style.textContent = `
            @keyframes swimRight {
                from { left: -50px; }
                to { left: 100%; }
            }
            @keyframes swimLeft {
                from { left: 100%; }
                to { left: -50px; }
            }
            .fish {
                will-change: transform, left;
                animation-duration: 10s;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
            }
        `;
        document.head.appendChild(style);
    }
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

// Feedback when toggling cursor snap via "snap" key sequence
function showSnapToggleFeedback() {
    const msg = document.createElement('div');
    msg.className = 'snap-toggle-feedback';
    msg.textContent = CURSOR_WRAP_SNAPPING ? 'Snap ON' : 'Snap OFF';
    msg.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);padding:8px 16px;background:rgba(7,7,7,0.9);color:var(--accent-color);font-size:0.7rem;letter-spacing:2px;border-radius:6px;border:1px solid var(--border-color);z-index:10001;pointer-events:none;opacity:0;transition:opacity 0.25s ease;';
    document.body.appendChild(msg);
    setTimeout(() => { msg.style.opacity = '1'; }, 10);
    setTimeout(() => { msg.style.opacity = '0'; }, 1800);
    setTimeout(() => { if (msg.parentNode) msg.parentNode.removeChild(msg); }, 2200);
}

// Mobile navigation functionality
function initMobileNavigation() {
    const menuToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('nav ul');
    const navLinks = document.querySelectorAll('nav a');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }
}

// Get current section based on scroll position
function getCurrentSection() {
    const sections = ['home', 'featured', 'about', 'skills'];
    let currentSection = sections[0]; // Default to home section
    
    // Check which section is currently in view
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const rect = section.getBoundingClientRect();
            // If the section is in the viewport (or partly in it)
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                currentSection = sectionId;
            }
        }
    });
    
    return currentSection;
}

// Get characters in a specific section
function getCharactersInSection(sectionId) {
    switch (sectionId) {
        case 'home':
            return document.querySelectorAll('#char1, #char2, #char3');
        case 'featured':
            return document.querySelectorAll('#featured-char');
        case 'about':
            return document.querySelectorAll('#about-char');
        case 'skills':
            return document.querySelectorAll('#skills-char');
        default:
            return document.querySelectorAll('.dot-character');
    }
}

// Initialize section detection with scroll event
function initSectionDetection() {
    // Track current active section
    let activeSection = getCurrentSection();
    highlightActiveSectionCharacters(activeSection);
    
    // Listen for scroll events to update active section - debounced for performance
    window.addEventListener('scroll', debounce(() => {
        const newActiveSection = getCurrentSection();
        
        // If section changed
        if (newActiveSection !== activeSection) {
            activeSection = newActiveSection;
            highlightActiveSectionCharacters(activeSection);
        }
    }, 100), { passive: true });
}

// Highlight characters in the active section
function highlightActiveSectionCharacters(sectionId) {
    // Remove highlight from all characters
    document.querySelectorAll('.dot-character').forEach(char => {
        char.classList.remove('active-section');
    });
    
    // Add highlight to characters in active section
    const activeChars = getCharactersInSection(sectionId);
    activeChars.forEach(char => {
        char.classList.add('active-section');
    });
}

// Initialize scroll progress bar
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (!progressBar) return;
    
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
        
        if (header) {
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }, { passive: true });
}

// Initialize Lucide icons
function initLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function buildTickerDigits(el) {
    const raw = el.textContent.trim();
    el.textContent = '';
    el.setAttribute('data-target', raw);

    for (const ch of raw) {
        if (/\d/.test(ch)) {
            const target = parseInt(ch, 10);
            const wrapper = document.createElement('span');
            wrapper.className = 'ticker-digit';
            const strip = document.createElement('span');
            strip.className = 'digit-strip';
            for (let cycle = 0; cycle < 2; cycle++) {
                for (let i = 0; i <= 9; i++) {
                    const s = document.createElement('span');
                    s.textContent = i;
                    strip.appendChild(s);
                }
            }
            strip.style.transform = 'translateY(0)';
            wrapper.appendChild(strip);
            el.appendChild(wrapper);
            wrapper.dataset.target = target;
        } else {
            const span = document.createElement('span');
            span.className = 'ticker-char';
            span.textContent = ch;
            el.appendChild(span);
        }
    }
}

function rollTickerTo(el, delay) {
    const digits = el.querySelectorAll('.ticker-digit');
    digits.forEach((d, i) => {
        const strip = d.querySelector('.digit-strip');
        const target = parseInt(d.dataset.target, 10);
        setTimeout(() => {
            strip.style.transform = `translateY(-${target * 1.3}em)`;
        }, (delay || 150) + i * 120);
    });
}

function spinTickerFull(el, delay) {
    const digits = el.querySelectorAll('.ticker-digit');
    digits.forEach((d, i) => {
        const strip = d.querySelector('.digit-strip');
        const target = parseInt(d.dataset.target, 10);
        strip.style.transition = 'none';
        strip.style.transform = `translateY(-${target * 1.3}em)`;
        strip.offsetHeight;
        strip.style.transition = '';
        setTimeout(() => {
            strip.style.transform = `translateY(-${(target + 10) * 1.3}em)`;
        }, (delay || 50) + i * 80);
    });
}

function snapTickerBack(el) {
    const digits = el.querySelectorAll('.ticker-digit');
    digits.forEach(d => {
        const strip = d.querySelector('.digit-strip');
        const target = parseInt(d.dataset.target, 10);
        strip.style.transition = 'none';
        strip.style.transform = `translateY(-${target * 1.3}em)`;
        strip.offsetHeight;
        strip.style.transition = '';
    });
}

function resetTicker(el) {
    const digits = el.querySelectorAll('.ticker-digit');
    digits.forEach(d => {
        const strip = d.querySelector('.digit-strip');
        strip.style.transition = 'none';
        strip.style.transform = 'translateY(0)';
        strip.offsetHeight;
        strip.style.transition = '';
    });
}

function initSectionTickers() {
    const sectionNumbers = document.querySelectorAll('.section-number');
    if (!sectionNumbers.length) return;

    sectionNumbers.forEach(el => {
        buildTickerDigits(el);

        el.addEventListener('mouseenter', () => {
            spinTickerFull(el, 50);
        });
        el.addEventListener('mouseleave', () => {
            snapTickerBack(el);
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                if (el.dataset.tickerDone) return;
                el.dataset.tickerDone = '1';
                rollTickerTo(el, 150);
            }
        });
    }, { threshold: 0.3 });

    sectionNumbers.forEach(el => observer.observe(el));

    initStatTickers();
    initHoverMicroInteractions();
}

function initStatTickers() {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(el => {
        const raw = el.textContent.trim();
        if (!/\d/.test(raw)) return;

        buildTickerDigits(el);
        el.classList.add('has-ticker');

        const parent = el.closest('.stat-item') || el;
        parent.addEventListener('mouseenter', () => {
            spinTickerFull(el, 30);
        });
        parent.addEventListener('mouseleave', () => {
            snapTickerBack(el);
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.tickerDone) {
                entry.target.dataset.tickerDone = '1';
                const el = entry.target.querySelector('.stat-value.has-ticker') || entry.target;
                if (el.classList.contains('has-ticker')) rollTickerTo(el, 200);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.stat-item').forEach(el => observer.observe(el));
}

function initHoverMicroInteractions() {
    document.querySelectorAll('.section-row-header').forEach(header => {
        const num = header.querySelector('.section-number');
        if (!num) return;
        header.addEventListener('mouseenter', () => {
            spinTickerFull(num, 50);
        });
        header.addEventListener('mouseleave', () => {
            snapTickerBack(num);
        });
    });

    document.querySelectorAll('.skill-page-btn').forEach(btn => {
        const idx = btn.querySelector('.btn-index');
        if (!idx) return;
        const original = idx.textContent.trim();
        btn.addEventListener('mouseenter', () => {
            idx.style.transition = 'none';
            idx.style.transform = 'translateY(4px)';
            idx.style.opacity = '0';
            idx.offsetHeight;
            idx.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            idx.style.transform = 'translateY(0)';
            idx.style.opacity = '1';
        });
    });
}

function initWordSwap() {
    const swap = document.getElementById('word-swap-trigger');
    if (!swap) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !swap.classList.contains('is-swapped')) {
                setTimeout(() => {
                    swap.classList.add('is-swapped');
                }, 600);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(swap);
}

/**
 * Hero tag: on hover, scramble text with random chars then decode back to original.
 * Uses requestAnimationFrame for smooth, synced animation.
 */
function initHeroTagScramble() {
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*[]<>/?=+';
    const SCRAMBLE_DURATION = 300;
    const DECODE_DURATION = 420;
    const EASE_OUT_EXPO = t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    document.querySelectorAll('.hero-tag, .hero-tag-right').forEach(tag => {
        const original = tag.textContent.trim();
        if (!original) return;
        tag.dataset.original = original;

        let rafId = null;
        let isHovering = false;

        const cancel = () => {
            if (rafId != null) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        };

        const randomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

        const runAnimation = (phaseStart) => {
            const totalDuration = SCRAMBLE_DURATION + DECODE_DURATION;

            const tick = (now) => {
                if (!isHovering) {
                    tag.textContent = original;
                    cancel();
                    return;
                }
                const elapsed = now - phaseStart;
                const progress = Math.min(elapsed / totalDuration, 1);

                if (elapsed < SCRAMBLE_DURATION) {
                    let str = '';
                    for (let i = 0; i < original.length; i++) {
                        str += randomChar();
                    }
                    tag.textContent = str;
                } else {
                    const decodeElapsed = elapsed - SCRAMBLE_DURATION;
                    const decodeProgress = Math.min(decodeElapsed / DECODE_DURATION, 1);
                    const eased = EASE_OUT_EXPO(decodeProgress);
                    let str = '';
                    for (let i = 0; i < original.length; i++) {
                        const threshold = (i + 0.3) / original.length;
                        str += eased >= threshold ? original[i] : randomChar();
                    }
                    tag.textContent = str;
                }

                if (progress < 1) {
                    rafId = requestAnimationFrame(tick);
                } else {
                    tag.textContent = original;
                    rafId = null;
                }
            };
            rafId = requestAnimationFrame(tick);
        };

        tag.addEventListener('mouseenter', () => {
            isHovering = true;
            cancel();
            runAnimation(performance.now());
        });

        tag.addEventListener('mouseleave', () => {
            isHovering = false;
            cancel();
            tag.textContent = original;
        });
    });
}