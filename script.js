document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       CUSTOM CURSOR LOGIC
       ========================================================================== */
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorReticle = document.querySelector('[data-cursor-reticle]');

    // Interactive Elements targeting
    const interactiveElements = document.querySelectorAll('a, button, .bounds-hover, .copyable, .web-link, .pointer-hover');

    // Create cursor text element
    const cursorText = document.createElement('div');
    cursorText.className = 'cursor-text';
    cursorReticle.appendChild(cursorText);

    // Copy to clipboard function exposed globally
    window.copyToClipboard = function (text) {
        navigator.clipboard.writeText(text).then(() => {
            cursorDot.style.backgroundColor = 'var(--secondary)';
            cursorDot.style.boxShadow = '0 0 15px var(--secondary)';
            setTimeout(() => {
                cursorDot.style.backgroundColor = '';
                cursorDot.style.boxShadow = '';
            }, 300);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    // Handle Phone Clicks (Mobile launches app, PC copies)
    window.handlePhoneClick = function (number) {
        const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            window.location.href = 'tel:' + number;
        } else {
            window.copyToClipboard(number);
        }
    };

    // Smoke system variables
    let smokeTimer = null;

    // Global variables for mouse position used by 3D background
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    // Update cursor position and globals
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        mouseX = (posX - windowHalfX);
        mouseY = (posY - windowHalfY);

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Reticle follows slightly delayed for smooth effect
        cursorReticle.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 100, fill: "forwards" });

        // Spawn smoke particle
        createSmokeParticle(posX, posY);

        // Reset timer to clear smoke when movement stops
        clearTimeout(smokeTimer);
        smokeTimer = setTimeout(() => {
            clearAllSmoke();
        }, 1000);
    });

    function createSmokeParticle(x, y) {
        const smoke = document.createElement('div');
        smoke.className = 'smoke-particle';
        smoke.style.left = `${x}px`;
        smoke.style.top = `${y}px`;

        // Randomize size
        const size = Math.random() * 10 + 10; // 10px to 20px
        smoke.style.width = `${size}px`;
        smoke.style.height = `${size}px`;

        // Randomize drift direction
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 40 + 20;
        smoke.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
        smoke.style.setProperty('--dy', `${Math.sin(angle) * distance - 20}px`); // Slight upward drift

        document.body.appendChild(smoke);

        // Remove particle after animation ends
        setTimeout(() => {
            if (smoke.parentNode) {
                smoke.remove();
            }
        }, 1000);
    }

    function clearAllSmoke() {
        const particles = document.querySelectorAll('.smoke-particle');
        particles.forEach(p => p.remove());
    }

    // Handle hover states
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.style.transform = "translate(-50%, -50%) scale(0.5)";

            if (el.classList.contains('project-card')) {
                cursorReticle.classList.add('hovering-card');
            } else {
                cursorReticle.classList.add('active');
            }
        });

        el.addEventListener('mouseleave', () => {
            cursorDot.style.transform = "translate(-50%, -50%) scale(1)";
            cursorReticle.classList.remove('active');
            cursorReticle.classList.remove('hovering-card');
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = 0;
        cursorReticle.style.opacity = 0;
    });

    document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = 1;
        cursorReticle.style.opacity = 1;
    });

    /* ==========================================================================
       SCROLL ANIMATIONS (Intersection Observer)
       ========================================================================== */
    const hiddenElements = document.querySelectorAll('.hidden-element');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Trigger skill bar animations if in resume section
                if (entry.target.id === 'briefing') {
                    animateSkillBars();
                }
            }
        });
    }, {
        threshold: 0,
        rootMargin: "0px 0px -100px 0px"
    });

    hiddenElements.forEach((el) => observer.observe(el));

    // Skill Bar Animation
    let skillsAnimated = false;
    function animateSkillBars() {
        if (skillsAnimated) return;

        const skillBars = document.querySelectorAll('.progress');
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.transition = "transform 1s cubic-bezier(0.1, 0.7, 0.1, 1)";
                bar.style.transform = "scaleX(1)";
            }, index * 200); // Staggered animation
        });
        skillsAnimated = true;
    }

    // Trigger hero section immediately on load
    setTimeout(() => {
        document.getElementById('hero').classList.add('visible');
    }, 100);

    /* ==========================================================================
       PROJECTS DATA AND DYNAMIC RENDERING
       ========================================================================== */
    const projectsData = [
        // HIGHLIGHT — top-tier achievements first
        { id: 'ACH-001', category: 'HIGHLIGHT', title: 'Defcon — 1st Place', desc: 'Won 1st place in Social Engineering at Defcon, the world\'s premier hacking conference. Competed against top security professionals globally.' },
        { id: 'ACH-002', category: 'HIGHLIGHT', title: 'Technology Personality of the Year', desc: 'Named "Technology Personality of the Year" at the Ples Jako Brno event for contributions to cybersecurity and tech innovation.' },
        { id: 'ACH-003', category: 'HIGHLIGHT', title: '10,000+ Employees Trained', desc: 'Designed and delivered cybersecurity awareness programs reaching over 10,000 employees across multiple regions and organizations.' },
        { id: 'ACH-004', category: 'HIGHLIGHT', title: 'Built SOC from Scratch', desc: 'Initiated and led the Security Operations Center (SOC) project at Abu Dhabi Airports — from concept to full operational capability.' },
        { id: 'ACH-005', category: 'HIGHLIGHT', title: '1M-Player Game Server', desc: 'Developed and managed gaming infrastructure on Steam supporting 1,000,000 concurrent players worldwide with 99% uptime.' },
        { id: 'ACH-006', category: 'HIGHLIGHT', title: 'Blizzard Bug Bounty Recognition', desc: 'Received official recognition from Blizzard Entertainment for discovering and helping patch multiple security vulnerabilities.' },
        // PROFESSIONAL
        { id: 'PRO-001', category: 'PROFESSIONAL', title: 'ISO 27001 Certification Lead', desc: 'Led the organization to ISO 27001 certification — recognized by the Board of Directors for achieving information security standards.' },
        { id: 'PRO-002', category: 'PROFESSIONAL', title: 'Innovative Security Solutions', desc: 'Awarded Certificate of Appreciation for implementing innovative security solutions across multiple entities in Abu Dhabi.' },
        { id: 'PRO-003', category: 'PROFESSIONAL', title: 'InfoSec Awareness Pioneer', desc: 'Initiator and lead trainer for information security awareness at Abu Dhabi Airports, partnering with GCAS on national-level programs.' },
        { id: 'PRO-004', category: 'PROFESSIONAL', title: 'International Security Contributions', desc: 'Awarded acknowledgments from multiple international companies for assisting in identifying and resolving critical security vulnerabilities.' },
        { id: 'PRO-005', category: 'PROFESSIONAL', title: 'Medical Device Security Research', desc: 'Contributed to multiple medical studies on securing electronic medical devices from tampering and unauthorized access.' },
        { id: 'PRO-006', category: 'PROFESSIONAL', title: 'Published Author — 6 Books', desc: 'Author of 6 books spanning Artificial Intelligence, Information Security, Cybersecurity, and Entrepreneurship.' },
        // VENTURES & PERSONAL
        { id: 'VEN-001', category: 'VENTURES', title: 'Startup Advisory', desc: 'Freelance advisor for startups — one client now generating millions in annual revenue based on strategic guidance provided.' },
        { id: 'VEN-002', category: 'VENTURES', title: 'Game Studio Consulting', desc: 'Consulting for multiple game development studios across console, PC, Mac, and mobile platforms.' },
        { id: 'VEN-003', category: 'VENTURES', title: 'Game Publishing', desc: 'Developed, participated, and assisted in publishing multiple games across mobile, console, and PC platforms.' },
        { id: 'VEN-004', category: 'VENTURES', title: 'Open-Source Contributor', desc: 'Active contributor to open-source projects and developer communities.' },
        { id: 'VEN-005', category: 'VENTURES', title: 'Business Networking Host', desc: 'Host of exclusive business networking events, facilitating brainstorming sessions for entrepreneurs and executives.' },
        { id: 'PER-001', category: 'PERSONAL', title: 'Martial Arts Instructor', desc: 'Active martial arts trainer and competitor in local and international karate tournaments. Mentoring young students.' },
        { id: 'PER-002', category: 'PERSONAL', title: 'Competitive Athlete', desc: 'Regular competitor in archery tournaments and equestrian events.' }
    ];

    const projectGrid = document.querySelector('.project-grid');

    if (projectGrid) {
        projectsData.forEach(proj => {
            const isHighlight = proj.category === 'HIGHLIGHT';
            const cardHTML = `
                <div class="project-card bounds-hover project-dynamic ${isHighlight ? 'highlight-card' : ''}" data-project-id="${proj.id}">
                    <div class="card-corner tl"></div>
                    <div class="card-corner tr"></div>
                    <div class="card-corner bl"></div>
                    <div class="card-corner br"></div>

                    <div class="project-overlay">
                        <span class="decrypt-text" data-value="${isHighlight ? 'DECLASSIFIED' : 'ACCESS GRANTED'}">LOCKED</span>
                    </div>

                    <div class="project-content">
                        <div class="project-header">
                            <span class="project-id">${proj.id}</span>
                            <span class="project-status ${isHighlight ? 'status-highlight' : ''}">${proj.category}</span>
                        </div>
                        <h3 class="project-title">${proj.title}</h3>
                        <div class="project-hidden-details hidden">
                            <p class="project-desc">${proj.desc}</p>
                        </div>
                    </div>
                </div>
            `;
            projectGrid.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    /* ==========================================================================
       BOOKS DATA AND DYNAMIC RENDERING
       ========================================================================== */
    const booksData = [
        { id: 'BK-001', title: 'Harnessing AI: Unlocking Productivity in the Digital Age', url: 'https://www.halmansoori.ae/_files/ugd/5f3cc8_060764ca07b642f4a36262cd6c285302.pdf', desc: 'Explores how artificial intelligence revolutionizes workplace efficiency and innovation, providing practical strategies for leveraging AI tools.', delay: '0.1s' },
        { id: 'BK-002', title: 'The Generative Revolution: Unveiling AI\'s Transformative Power', url: 'https://www.halmansoori.ae/_files/ugd/5f3cc8_48ca14dc8aff4ce1ad841ec41a2f4ab2.pdf', desc: 'Explores the rapid advancements in generative AI and its profound impact on industries, society, and creativity.', delay: '0.2s' },
        { id: 'BK-003', title: 'Building Minds: A Philosophical Guide to Crafting Artificial Intelligence', url: 'https://www.halmansoori.ae/_files/ugd/5f3cc8_4a68ec42301147dba23c2a3137b34a75.pdf', desc: 'Delves into the ethical, philosophical, and conceptual foundations of creating AI systems and aligning them with human values.', delay: '0.3s' },
        { id: 'BK-004', title: 'Startup Blueprint: A Practical Guide to Building a Business', url: 'https://www.halmansoori.ae/_files/ugd/5f3cc8_215fb4b2bacd4ca9944c613c9ae175ec.pdf', desc: 'A comprehensive guide that demystifies the complex process of launching and managing a small business with actionable advice.', delay: '0.4s' },
        { id: 'BK-005', title: 'Gamer to Creator: What\'s stopping you?', url: 'https://www.halmansoori.ae/_files/ugd/5f3cc8_d134db6bf5ef4dddaafe36d735b128a4.pdf', desc: 'The ultimate guide for gamers looking to transition from playing to developing their own games, bridging entertainment and innovation.', delay: '0.5s' },
        { id: 'BK-006', title: 'Neural Deception: Iblees\' Design', url: 'https://www.halmansoori.ae/_files/ugd/5f3cc8_35b64fb11616485d90066e43832ba3e1.pdf', desc: 'Explores the dangers of AI as a tool of manipulation and spiritual corruption across machine learning and digital consciousness.', delay: '0.6s' }
    ];

    const booksGrid = document.querySelector('.books-grid');

    if (booksGrid) {
        booksData.forEach(book => {
            const cardHTML = `
                <a href="${book.url}" target="_blank" class="book-card bounds-hover" style="animation-delay: ${book.delay}">
                    <div class="card-corner tl"></div>
                    <div class="card-corner tr"></div>
                    <div class="card-corner bl"></div>
                    <div class="card-corner br"></div>
                    
                    <div class="book-scanline"></div>
                    
                    <div class="book-content">
                        <div class="book-header">
                            <span class="book-id">${book.id}</span>
                            <span class="book-status">DECRYPTED</span>
                        </div>
                        <h3 class="book-title">${book.title}</h3>
                        <div class="book-hidden-details">
                            <p class="book-desc">${book.desc}</p>
                            <span class="book-action">[ O P E N ]</span>
                        </div>
                    </div>
                </a>
            `;
            booksGrid.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    /* ==========================================================================
       DECRYPTION TEXT EFFECT & HOVER LOGIC
       ========================================================================== */
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
    const decryptElements = document.querySelectorAll('.decrypt-text');

    decryptElements.forEach(element => {
        const finalValue = element.dataset.value;
        const originalText = element.innerText;
        element.dataset.original = originalText;
        const card = element.closest('.project-card');
        const hiddenDetails = card.querySelector('.project-hidden-details');
        const overlay = element.closest('.project-overlay');
        let accessTimer;

        card.addEventListener('mouseenter', () => {
            let iterations = 0;
            clearInterval(element.interval);

            // Scramble animation
            element.interval = setInterval(() => {
                element.innerText = finalValue.split("")
                    .map((letter, index) => {
                        if (index < iterations) {
                            return finalValue[index];
                        }
                        if (letter === " ") return " ";
                        return letters[Math.floor(Math.random() * letters.length)]
                    })
                    .join("");

                if (iterations >= finalValue.length) {
                    clearInterval(element.interval);

                    // Once ACCESS GRANTED hits, wait 1 second then show details
                    accessTimer = setTimeout(() => {
                        overlay.style.opacity = '0';
                        overlay.style.pointerEvents = 'none'; // let clicks pass through if needed
                        if (hiddenDetails) {
                            hiddenDetails.classList.remove('hidden');
                            hiddenDetails.classList.add('visible-details');
                        }
                    }, 1000);
                }

                iterations += 1 / 3;
            }, 30);
        });

        card.addEventListener('mouseleave', () => {
            clearInterval(element.interval);
            clearTimeout(accessTimer);
            element.innerText = element.dataset.original;

            // Reset visibility
            overlay.style.opacity = '';
            overlay.style.pointerEvents = 'auto';
            if (hiddenDetails) {
                hiddenDetails.classList.add('hidden');
                hiddenDetails.classList.remove('visible-details');
            }
        });
    });

    /* ==========================================================================
       RANDOMIZED REDACTED TEXT EFFECT
       ========================================================================== */
    const redactableElements = document.querySelectorAll('.redactable');

    setInterval(() => {
        redactableElements.forEach(el => {
            if (Math.random() > 0.95) { // 5% chance to glitch momentarily
                const original = el.innerText;
                const glitched = original.split('').map(c => Math.random() > 0.5 ? letters[Math.floor(Math.random() * letters.length)] : c).join('');
                el.innerText = glitched;

                setTimeout(() => {
                    el.innerText = "CLASSIFIED";
                }, 150);
            }
        });
    }, 500);

    /* ==========================================================================
       3D EARTH GLOBE (THREE.JS)
       ========================================================================== */
    const globeContainer = document.getElementById('globe-container');
    if (globeContainer && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(300, 300);
        globeContainer.appendChild(renderer.domElement);

        // Holographic Wireframe Globe (Inner Sphere + Outer Wireframe)
        const geometry = new THREE.SphereGeometry(1.8, 32, 32);

        // Load texture from base64 string (required for file:// local access — CORS blocks .jpg)
        const textureLoader = new THREE.TextureLoader();
        const earthTexture = textureLoader.load(earthBase64);

        const material = new THREE.MeshPhongMaterial({
            map: earthTexture,
            shininess: 50
        });

        const earth = new THREE.Mesh(geometry, material);
        scene.add(earth);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 3, 5);
        scene.add(pointLight);

        camera.position.z = 5;

        // Tech glow ring mapping the earth
        const glowGeometry = new THREE.SphereGeometry(1.9, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x4aff4a,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending
        });
        const glowRing = new THREE.Mesh(glowGeometry, glowMaterial);
        scene.add(glowRing);

        // --- Orbiting Satellites ---
        // Pivot-based: each satellite sits at (radius, 0, 0) inside a tilted group.
        // Rotating the group on Y = perfect circular orbit, guaranteed no clipping.
        const satConfigs = [
            { radius: 2.8, speed: 0.01, tiltX: 0.3, tiltZ: 0.15, startAngle: 0 },
            { radius: 3.2, speed: -0.007, tiltX: -0.4, tiltZ: 0.2, startAngle: 2.0 },
            { radius: 3.6, speed: 0.005, tiltX: 0.15, tiltZ: -0.35, startAngle: 4.0 }
        ];

        const satellites = satConfigs.map(cfg => {
            // -- Build satellite mesh --
            // Core bright dot
            const core = new THREE.Mesh(
                new THREE.OctahedronGeometry(0.07, 0),
                new THREE.MeshBasicMaterial({ color: 0x4aff4a })
            );

            // Glow sphere
            const glowMat = new THREE.MeshBasicMaterial({
                color: 0x4aff4a,
                transparent: true,
                opacity: 0.25,
                blending: THREE.AdditiveBlending
            });
            const glow = new THREE.Mesh(
                new THREE.SphereGeometry(0.16, 8, 8),
                glowMat
            );

            // Assemble satellite
            const sat = new THREE.Group();
            sat.add(core);
            sat.add(glow);
            sat.position.set(cfg.radius, 0, 0); // fixed distance from center

            // Orbit pivot — this group gets tilted once, then rotated on Y each frame
            const pivot = new THREE.Group();
            pivot.rotation.x = cfg.tiltX;
            pivot.rotation.z = cfg.tiltZ;
            pivot.rotation.y = cfg.startAngle;
            pivot.add(sat);
            scene.add(pivot);

            // Matching orbit ring (same tilt)
            const ring = new THREE.Mesh(
                new THREE.TorusGeometry(cfg.radius, 0.006, 6, 120),
                new THREE.MeshBasicMaterial({
                    color: 0x4aff4a,
                    transparent: true,
                    opacity: 0.07
                })
            );
            ring.rotation.x = Math.PI / 2; // torus lies flat in local space
            // Wrap in a group with the same tilt as the orbit
            const ringPivot = new THREE.Group();
            ringPivot.rotation.x = cfg.tiltX;
            ringPivot.rotation.z = cfg.tiltZ;
            ringPivot.add(ring);
            scene.add(ringPivot);

            return { pivot, speed: cfg.speed, glowMat, core };
        });

        let globeTime = 0;
        const animateGlobe = function () {
            requestAnimationFrame(animateGlobe);
            globeTime += 0.016;
            earth.rotation.y += 0.005;

            satellites.forEach(sat => {
                // Simply rotate the pivot — satellite stays at fixed radius
                sat.pivot.rotation.y += sat.speed;

                // Gentle pulsing glow
                sat.glowMat.opacity = 0.2 + Math.sin(globeTime * 2.5 + sat.pivot.rotation.y) * 0.12;

                // Slow spin on the diamond shape
                sat.core.rotation.y += 0.03;
                sat.core.rotation.z += 0.02;
            });

            renderer.render(scene, camera);
        };

        animateGlobe();
    }

    /* ==========================================================================
       INTERACTIVE 3D PARTICLE SPACE BACKGROUND
       ========================================================================== */
    const spaceContainer = document.getElementById('space-background');
    if (spaceContainer && typeof THREE !== 'undefined') {
        const spaceScene = new THREE.Scene();
        // Pure black — no fog tint
        spaceScene.background = new THREE.Color(0x000000);

        const spaceCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 4000);
        spaceCamera.position.z = 1000;

        const spaceRenderer = new THREE.WebGLRenderer({ antialias: true });
        spaceRenderer.setPixelRatio(window.devicePixelRatio);
        spaceRenderer.setSize(window.innerWidth, window.innerHeight);
        spaceContainer.appendChild(spaceRenderer.domElement);

        // Glowing star sprite (base64)
        const starBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADSElEQVRYR82XW2sTQRSG39lsNjebaJNqxWpR0XrxIlgQvBFUvNKL3nrz1m/gv+qvwCtvetGLFwRBqxWxF/FWjS2mbTeb3dnxTGaT1KS1114EXZhlJyffPOfMmTMzQq1Ww0hM/+A7/yXGf5YdGRlR2qKU2nZ1R0k8Hg8Yg0EQvYlGox1V0Ww28wB2AYzI4rZti0/XdbmuKAoIIeVfRHS2N16q1aq2tLQUcRxH63Q62tLSEiYmJtBqtRCJREC9Xm+k3W6Hms1mjHNuCyGSUoikECIdj8eTlmVZkiQp4pzzUqnUS7Va1QDo8fFxNBqNkG3bEcdxgkKI0TAMjTFGQggLAAaDAbLZrGiaZpXQYrEYs207YllWRAgRcxxHi8ViLplMMs75VqlUStTr9bBpmvEwDMOcc11RlCchREIymQxd1zUcx2FBEARisVhYURS2uLhYCkO5XLZs204IITLDMM7H4/GEpmnM8zz0ej2USiW/VCpp+Xw+5jiOFgTBb13XH2qaNs1xHMrlMk5OThTgw8PD0+12+4bjOPOEEJmI8B3HoWKxqORyuZnjOHc9z3sN4E1v84UQRC6XS3iel+/1em+CIPirqup1xtgB+Bnj4+O3R0ZGrnmed8PzvK/5fH52dnZWSyQSmclk8rHjOPcDILm2tvbE9/0HpmneaDab+6lUylYUZS+fz9/Y2Ngon5+fL5lM5srGxsbr7e3tc1E8Pj5mAM5t23Zub2/PZjKZqyiYpinr9TrL5XIzpmlOZTKZeyI8OTlRs9ns/NraWrlYLKYnk8mrAIQQ4h5jfA/gnud5L2u1WrFUKmUAwHFv+v3+3V6v96Tdbg/w0jRN7na7r2zbvk8pXYIgXNc0jfM8jw4PD/PlcnmWMTZrmuba3t4ezM/P03+1A/AigJdCiKxpmtfT6TS1LIsNDg7eqar6UFXVW4ZhxIrFImk2m8XFxcVXAK4wxu7kcjnr7E6j0ahj2/YTYA/g25+0s7Ojh2GIOI5Tvu/vVqvVxUKhoEIIHkL4xWJxH4BCjNG6rmM6nc53u90VwI+HwyEVQsSj0cihlLLZ2dngP6H/f14gAIAkSV2lVOI4Tuh5HhNChIZh4P7+/m+o894A/L18128uK6X/mH4A7mE+/Uf2WxcAAAAASUVORK5CYII=";
        const particleTexture = new THREE.TextureLoader().load(starBase64);

        // --- Star Field ---
        const starGeometry = new THREE.BufferGeometry();
        const starVertices = [];
        const starColors = [];
        const STAR_COUNT = 10000;

        for (let i = 0; i < STAR_COUNT; i++) {
            starVertices.push(
                (Math.random() - 0.5) * 3500,
                (Math.random() - 0.5) * 3500,
                (Math.random() - 0.5) * 3500
            );

            const color = new THREE.Color();
            const roll = Math.random();
            if (roll > 0.92) {
                color.setHex(0xffffff); // bright white stars
            } else if (roll > 0.7) {
                color.setHSL(0.55, 0.6, 0.7); // cool cyan/teal
            } else if (roll > 0.5) {
                color.setHSL(0.35, 0.5, 0.6); // green tint (matches theme)
            } else {
                color.setHSL(0.6, 0.3, 0.5); // dim blue-grey
            }
            starColors.push(color.r, color.g, color.b);
        }

        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));

        const starMaterial = new THREE.PointsMaterial({
            size: 3.5,
            map: particleTexture,
            vertexColors: true,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true
        });

        const particles = new THREE.Points(starGeometry, starMaterial);
        spaceScene.add(particles);

        // Handle resize
        window.addEventListener('resize', function () {
            spaceCamera.aspect = window.innerWidth / window.innerHeight;
            spaceCamera.updateProjectionMatrix();
            spaceRenderer.setSize(window.innerWidth, window.innerHeight);
        }, false);

        // Track mouse velocity for warp effect
        let prevMouseX = 0;
        let prevMouseY = 0;
        let mouseVelX = 0;
        let mouseVelY = 0;

        let time = 0;
        function animateSpace() {
            requestAnimationFrame(animateSpace);
            time += 0.001;

            // Calculate mouse velocity (how fast the mouse is moving)
            mouseVelX += (mouseX - prevMouseX - mouseVelX) * 0.1;
            mouseVelY += (mouseY - prevMouseY - mouseVelY) * 0.1;
            prevMouseX = mouseX;
            prevMouseY = mouseY;

            const speed = Math.sqrt(mouseVelX * mouseVelX + mouseVelY * mouseVelY);

            // Gentle constant drift
            particles.rotation.y = time * 0.08;
            particles.rotation.x = time * 0.02;

            // Mouse-driven camera parallax — stronger response
            const targetX = mouseX * 0.5;
            const targetY = -mouseY * 0.5;
            spaceCamera.position.x += (targetX - spaceCamera.position.x) * 0.04;
            spaceCamera.position.y += (targetY - spaceCamera.position.y) * 0.04;

            // Warp/zoom effect: camera pushes forward when mouse moves fast
            const targetZ = 1000 - Math.min(speed * 2, 300);
            spaceCamera.position.z += (targetZ - spaceCamera.position.z) * 0.03;

            // Slight FOV warp on fast movement
            const targetFOV = 75 + Math.min(speed * 0.3, 15);
            spaceCamera.fov += (targetFOV - spaceCamera.fov) * 0.05;
            spaceCamera.updateProjectionMatrix();

            spaceCamera.lookAt(spaceScene.position);
            spaceRenderer.render(spaceScene, spaceCamera);
        }

        animateSpace();
    }

    /* ==========================================================================
       INTERACTIVE COMPONENTS
       ========================================================================== */
    // Mobile Nav Toggle
    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mainNav.classList.toggle('open');
            navToggle.textContent = mainNav.classList.contains('open') ? '[X]' : '[///]';
        });

        // Close nav when a link is clicked
        mainNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('open');
                navToggle.textContent = '[///]';
            });
        });

        document.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
                mainNav.classList.remove('open');
                navToggle.textContent = '[///]';
            }
        });
    }

    // Social Menu Toggle
    const socialToggle = document.getElementById('social-toggle');
    const socialMenu = document.getElementById('social-menu');

    if (socialToggle && socialMenu) {
        socialToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            socialMenu.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!socialMenu.contains(e.target)) {
                socialMenu.classList.remove('open');
            }
        });
    }

    // Timeline item click to expand
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.addEventListener('click', () => {
            // Close others
            timelineItems.forEach(t => t !== item && t.classList.remove('active'));
            // Toggle clicked
            item.classList.toggle('active');
        });
    });

    // Custom Cursor Text Hover states
    const customCursorElements = document.querySelectorAll('.has-custom-cursor, .enlargeable');
    customCursorElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            const text = el.getAttribute('data-cursor-text') || "ENLARGE?";
            cursorText.innerText = text;
            cursorReticle.classList.add('show-text');
        });
        el.addEventListener('mouseleave', () => {
            cursorText.innerText = "";
            cursorReticle.classList.remove('show-text');
        });
    });

    // Image Modal Logic
    const profilePicContainer = document.querySelector('.profile-pic-container');
    const profilePicImg = document.querySelector('.profile-pic');
    const imageModal = document.getElementById('image-modal');
    const enlargedImg = document.getElementById('enlarged-img');
    const closeModal = document.querySelector('.close-modal');

    if (profilePicContainer && imageModal && profilePicImg) {
        profilePicContainer.addEventListener('click', () => {
            if (profilePicImg.src && profilePicImg.src !== "" && !profilePicImg.src.endsWith("#")) {
                enlargedImg.src = profilePicImg.src;
                imageModal.classList.add('show');
            }
        });

        closeModal.addEventListener('click', () => {
            imageModal.classList.remove('show');
        });
        window.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                imageModal.classList.remove('show');
            }
        });
    }

    /* ==========================================================================
       SCROLL TO TOP Logic
       ========================================================================== */
    const scrollTopBtn = document.getElementById('scrollToTop');

    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            // Show button after scrolling down 300px
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

});
