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

    // Smoke system variables
    let smokeTimer = null;

    // Update cursor position
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

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
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
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
        { id: 'ACH-001', category: 'AWARDS AND ACHIEVEMENTS', title: 'Cybersecurity Training', desc: 'Trained over 10,000 employees in cybersecurity and information security awareness.' },
        { id: 'ACH-002', category: 'AWARDS AND ACHIEVEMENTS', title: 'CEO Certificate of Appreciation', desc: 'Awarded a Certificate of Appreciation from the CEO of Abu Dhabi Airports.' },
        { id: 'ACH-003', category: 'AWARDS AND ACHIEVEMENTS', title: 'ISO Certification Recognition', desc: 'Recognized by the Board of Directors for achieving ISO certification in information security.' },
        { id: 'ACH-004', category: 'AWARDS AND ACHIEVEMENTS', title: 'SOC Project Initiation', desc: 'Initiated and led the Security Operations Center (SOC) project for Abu Dhabi Airports.' },
        { id: 'ACH-005', category: 'AWARDS AND ACHIEVEMENTS', title: 'Innovative Security Solutions', desc: 'Received a Certificate of Appreciation for implementing innovative security solutions for multiple entities in Abu Dhabi.' },
        { id: 'ACH-006', category: 'AWARDS AND ACHIEVEMENTS', title: 'Technology Personality of the Year', desc: 'Named "Technology Personality of the Year" at the Ples Jako Brno event.' },
        { id: 'ACH-007', category: 'AWARDS AND ACHIEVEMENTS', title: 'InfoSec Awareness Lead', desc: 'Initiator and lead trainer for information security awareness at Abu Dhabi Airports, in collaboration with GCAS.' },
        { id: 'ACH-008', category: 'AWARDS AND ACHIEVEMENTS', title: 'Blizzard Vulnerability Patching', desc: 'Received recognition from Blizzard Entertainment for helping patch multiple security vulnerabilities.' },
        { id: 'ACH-009', category: 'AWARDS AND ACHIEVEMENTS', title: 'International Acknowledgments', desc: 'Awarded several acknowledgments from international companies for assisting in securing their systems.' },
        { id: 'ACH-010', category: 'AWARDS AND ACHIEVEMENTS', title: 'Cybersecurity Competitions', desc: 'Participated in multiple international cybersecurity competitions.' },
        { id: 'ACH-011', category: 'AWARDS AND ACHIEVEMENTS', title: 'Defcon 17 Winner', desc: 'Won 1st place in Social Engineering at Defcon 17.' },
        { id: 'ACH-012', category: 'AWARDS AND ACHIEVEMENTS', title: 'Medical Device Security Studies', desc: 'Contributed to multiple medical studies on securing electronic medical devices from tampering.' },
        { id: 'ACH-013', category: 'AWARDS AND ACHIEVEMENTS', title: 'Authored Technical Books', desc: 'Author of multiple books on Artificial Intelligence, Information Security, and Cybersecurity.' },
        { id: 'ACH-014', category: 'AWARDS AND ACHIEVEMENTS', title: 'Steam Server Development', desc: 'Designed and developed multiple servers and services used on the Steam platform.' },
        { id: 'PER-001', category: 'PERSONAL ACHIEVEMENTS', title: 'Global Steam Server Mgt', desc: 'Developed and managed a gaming server for a popular Steam game, supporting 1,000,000 players worldwide with 99% uptime.' },
        { id: 'PER-002', category: 'PERSONAL ACHIEVEMENTS', title: 'Startup Advisor', desc: 'Freelance advisor for startups, with one client now generating millions in annual revenue.' },
        { id: 'PER-003', category: 'PERSONAL ACHIEVEMENTS', title: 'Gaming Community Awards', desc: 'Recipient of multiple high-level awards within gaming communities.' },
        { id: 'PER-004', category: 'PERSONAL ACHIEVEMENTS', title: 'Martial Arts Trainer', desc: 'Active martial arts trainer, mentoring young students in karate.' },
        { id: 'PER-005', category: 'PERSONAL ACHIEVEMENTS', title: 'Karate Tournaments', desc: 'Competitor in multiple local and international karate tournaments.' },
        { id: 'PER-006', category: 'PERSONAL ACHIEVEMENTS', title: 'Archery Competitor', desc: 'Regular participant in archery tournaments.' },
        { id: 'PER-007', category: 'PERSONAL ACHIEVEMENTS', title: 'Equestrian Events', desc: 'Engaged in equestrian events and competitions.' },
        { id: 'PER-008', category: 'PERSONAL ACHIEVEMENTS', title: 'Business Networking Host', desc: 'Host of exclusive business networking events, facilitating brainstorming sessions for entrepreneurs and executives.' },
        { id: 'PER-009', category: 'PERSONAL ACHIEVEMENTS', title: 'Game Studio Consulting', desc: 'Provided consulting services to multiple game development studios, offering expertise in console, PC, Mac, and mobile game development and support.' },
        { id: 'PER-010', category: 'PERSONAL ACHIEVEMENTS', title: 'Game Publishing', desc: 'Developed, participated, and assisted in publishing multiple games across mobile, console, and PC platforms.' },
        { id: 'PER-011', category: 'PERSONAL ACHIEVEMENTS', title: 'Open-Source Contributor', desc: 'Active contributor to various digital software and online developer communities, collaborating on open-source projects.' }
    ];

    const projectGrid = document.querySelector('.project-grid');

    if (projectGrid) {
        projectsData.forEach(proj => {
            const cardHTML = `
                <div class="project-card bounds-hover project-dynamic" data-project-id="${proj.id}">
                    <div class="card-corner tl"></div>
                    <div class="card-corner tr"></div>
                    <div class="card-corner bl"></div>
                    <div class="card-corner br"></div>
                    
                    <div class="project-overlay">
                        <span class="decrypt-text" data-value="ACCESS GRANTED">LOCKED</span>
                    </div>
                    
                    <div class="project-content">
                        <div class="project-header">
                            <span class="project-id">${proj.id}</span>
                            <span class="project-status">${proj.category}</span>
                        </div>
                        <h3 class="project-title">${proj.title}</h3>
                        <div class="project-hidden-details hidden">
                            <p class="project-desc">${proj.desc}</p>
                        </div>
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
                            <span class="book-action">[ ACCESS ARCHIVE ]</span>
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

        const geometry = new THREE.SphereGeometry(1.8, 64, 64);

        const textureLoader = new THREE.TextureLoader();
        // Colored Earth texture from unpkg CDN
        const earthTexture = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg');

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

        // Satellites
        const satellites = [];
        const satGeometry = new THREE.OctahedronGeometry(0.08, 0);
        const satMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            emissive: 0x00ffff,
            emissiveIntensity: 0.5,
            shininess: 100
        });

        for (let i = 0; i < 3; i++) {
            const sat = new THREE.Mesh(satGeometry, satMaterial);
            const pivot = new THREE.Object3D();

            sat.position.set(2.4 + Math.random() * 0.5, 0, 0);

            pivot.rotation.x = Math.random() * Math.PI * 2;
            pivot.rotation.y = Math.random() * Math.PI * 2;
            pivot.rotation.z = Math.random() * Math.PI * 2;

            pivot.userData.speedX = (Math.random() - 0.5) * 0.02;
            pivot.userData.speedY = (Math.random() - 0.5) * 0.02;
            pivot.userData.speedZ = (Math.random() - 0.5) * 0.02;

            pivot.add(sat);
            scene.add(pivot);
            satellites.push(pivot);
        }

        const animateGlobe = function () {
            requestAnimationFrame(animateGlobe);
            earth.rotation.y += 0.005;

            satellites.forEach(pivot => {
                pivot.rotation.x += pivot.userData.speedX;
                pivot.rotation.y += pivot.userData.speedY;
                pivot.rotation.z += pivot.userData.speedZ;
            });

            renderer.render(scene, camera);
        };

        animateGlobe();
    }

    /* ==========================================================================
       INTERACTIVE COMPONENTS
       ========================================================================== */
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
