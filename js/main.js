/**
 * main.js - Unified Premium Portfolio Script
 * Handles all core animations and interactions site-wide.
 */

// ADDED: Import Three.js to enable WebGL functionality
import * as THREE from 'three';

document.addEventListener('DOMContentLoaded', () => {

    // --- Global DOM Elements ---
    const preloader = document.getElementById('preloader');
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    const cursorText = document.getElementById('cursor-text');

    // ADDED: Global state and elements for sound effects
    let isMuted = true; // Sound is muted by default
    const audioHover = document.getElementById('audio-hover');
    const audioClick = document.getElementById('audio-click');

    /**
     * Handles the preloader and smooth page load transitions.
     */
    function initPageTransitions() {
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            if (preloader) {
                preloader.classList.add('loaded');
            }
        });

        // This is a separate listener on window load to ensure all other scripts have loaded
        // before we initialize animations that might depend on them (like GSAP).
        window.addEventListener('load', () => {
            initRevealAnimations();
            // The initSkillMeters() call was here but it is not defined in this file. Assuming it's not needed for the homepage.
            initHorizontalScroll(); // Moved here to run after all elements are loaded
        });

        document.querySelectorAll('.page-link').forEach(link => {
            if (link.dataset.listenerAttached) return;
            link.dataset.listenerAttached = 'true';
            link.addEventListener('click', function(e) {
                const destination = this.href;
                
                if (link.hostname !== window.location.hostname || !destination.includes(window.location.hostname)) {
                    return;
                }
                
                e.preventDefault();
                playSound(audioClick); // MODIFIED: Play sound on click

                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('open')) {
                    mobileMenu.classList.remove('open');
                    document.body.style.overflow = '';
                    document.querySelectorAll('#menu-toggle span').forEach(span => span.style.transform = '');
                }
                
                document.body.classList.remove('loaded');
                
                if (preloader) {
                    const preloaderText = preloader.querySelector('.preloader-text-inner');
                    if(preloaderText) preloaderText.style.transform = 'translateY(120%)';
                    preloader.classList.remove('loaded');
                }
                
                setTimeout(() => { window.location.href = destination; }, 900);
            });
        });
    }

    /**
     * Initializes the Intersection Observer for reveal-on-scroll animations.
     */
    function initRevealAnimations() {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    if (entry.target.classList.contains('toolkit-category')) {
                        const items = entry.target.querySelectorAll('.skill-item');
                        items.forEach((item, index) => {
                            item.style.transitionDelay = `${index * 100}ms`;
                            item.classList.add('is-visible');
                        });
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
        document.querySelectorAll('.reveal-up, .reveal-image, .reveal-line, .reveal-text, .toolkit-category').forEach(el => observer.observe(el));
    }
    
    /**
     * Applies an interactive 3D tilt effect to designated elements sitewide.
     */
    function initGlobalTiltEffect() {
        if (window.matchMedia("(pointer: coarse)").matches) return;
        const TILT_AMOUNT = 8;
        const containers = document.querySelectorAll('.tilt-container');
        containers.forEach(container => {
            const elementToTilt = container.querySelector('.interactive-tilt');
            if (!elementToTilt) return;
            container.addEventListener('mousemove', (e) => {
                const { clientX, clientY } = e;
                const { top, left, width, height } = container.getBoundingClientRect();
                const x = ((clientX - left) / width) - 0.5;
                const y = ((clientY - top) / height) - 0.5;
                const rotateY = x * TILT_AMOUNT;
                const rotateX = -y * TILT_AMOUNT;
                elementToTilt.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            container.addEventListener('mouseleave', () => {
                elementToTilt.style.transform = 'rotateX(0deg) rotateY(0deg)';
            });
        });
    }

    /**
     * MODIFIED: Sets up the custom cursor, now with custom data-driven text.
     */
    function initCustomCursor() {
        if (!cursorDot || !cursorOutline) return;
        let mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;
        window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
        const animateCursor = () => {
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
            const dx = mouseX - outlineX;
            const dy = mouseY - outlineY;
            outlineX += dx * 0.1;
            outlineY += dy * 0.1;
            cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
            requestAnimationFrame(animateCursor);
        };
        requestAnimationFrame(animateCursor);
        document.body.addEventListener('mouseleave', () => { cursorDot.classList.add('cursor-hidden'); cursorOutline.classList.add('cursor-hidden'); });
        document.body.addEventListener('mouseenter', () => { cursorDot.classList.remove('cursor-hidden'); cursorOutline.classList.remove('cursor-hidden'); });

        const interactiveElements = 'a, button, .project-card, .logo-item, .filter-btn, .nav-arrow, .social-icon-link, .fab-main, .fab-option';
        document.querySelectorAll(interactiveElements).forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('hover');
                playSound(audioHover);
                const customText = el.getAttribute('data-cursor-text');
                if (cursorText) {
                    cursorText.textContent = customText || 'Click';
                }
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('hover');
                if (cursorText) cursorText.textContent = '';
            });
        });

        document.querySelectorAll('p, h1, h2, h3, h4, h5, h6').forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('text-hover'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('text-hover'));
        });
    }
    
    /**
     * MODIFIED: Mobile menu now plays sound on toggle.
     */
    function initMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        if (!menuToggle || !mobileMenu) return;
        const menuSpans = menuToggle.querySelectorAll('span');
        
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            playSound(audioClick); // Play sound
            const isOpen = mobileMenu.classList.toggle('open');
            document.body.style.overflow = isOpen ? 'hidden' : '';
            menuSpans[0].style.transform = isOpen ? 'translateY(5px) rotate(45deg)' : '';
            menuSpans[1].style.transform = isOpen ? 'translateY(-5px) rotate(-45deg)' : '';
        });
    }

    /**
     * REPLACED & FIXED: Horizontal scroll now powered by GSAP and eliminates extra space.
     */
    function initHorizontalScroll() {
        const section = document.querySelector('.horizontal-scroll-section');
        if (!section || !window.gsap || window.innerWidth < 1024) {
            if (section) {
                // Ensure no inline height is left on mobile
                section.style.height = ''; 
            }
            return;
        }

        const track = section.querySelector('.horizontal-scroll-track');
        if (!track) return;

        // The main change is in the 'end' property of the ScrollTrigger
        gsap.to(track, {
            x: () => -(track.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
                trigger: section,
                pin: true,
                scrub: 1,
                // This precisely ends the animation when the scroll is done
                end: () => "+=" + (track.scrollWidth - window.innerWidth),
                invalidateOnRefresh: true
            }
        });

        // We no longer need to manually set the section's height.
        section.style.height = ''; 
    }
    
    function initTestimonialSlider() {
        const slider = document.getElementById('testimonial-slider');
        if (!slider) return;
        const track = slider.querySelector('.testimonial-track');
        const slides = Array.from(track.children);
        const nextButton = document.getElementById('testimonial-next');
        const prevButton = document.getElementById('testimonial-prev');
        const paginationNav = document.getElementById('testimonial-pagination');
        let currentIndex = 0;
        if (slides.length <= 1) return;
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('pagination-dot');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            if (index === 0) dot.classList.add('active');
            paginationNav.appendChild(dot);
            dot.addEventListener('click', () => goToSlide(index));
        });
        const dots = Array.from(paginationNav.children);
        const goToSlide = (index) => {
            track.style.transform = `translateX(-${index * 100}%)`;
            updateNav(currentIndex, index);
            currentIndex = index;
        };
        const updateNav = (oldIndex, newIndex) => {
            dots[oldIndex]?.classList.remove('active');
            dots[newIndex]?.classList.add('active');
            prevButton.disabled = newIndex === 0;
            nextButton.disabled = newIndex === slides.length - 1;
        };
        nextButton.addEventListener('click', () => { if (currentIndex < slides.length - 1) goToSlide(currentIndex + 1); });
        prevButton.addEventListener('click', () => { if (currentIndex > 0) goToSlide(currentIndex - 1); });
        updateNav(0, 0);
    }

    function initClock() {
        const timeEl = document.getElementById('current-time');
        if (!timeEl) return;

        function updateTime() {
            const now = new Date();
            const options = { timeZone: 'Africa/Nairobi', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
            timeEl.textContent = now.toLocaleTimeString('en-US', options);
        }
        setInterval(updateTime, 1000);
        updateTime();
    }
    
    function initMagneticLinks() {
        document.querySelectorAll('.magnetic-link').forEach(link => {
            link.addEventListener('mousemove', (e) => {
                const { clientX, clientY } = e;
                const { left, top, width, height } = link.getBoundingClientRect();
                const x = (clientX - (left + width / 2)) * 0.2;
                const y = (clientY - (top + height / 2)) * 0.2;
                link.style.transform = `translate(${x}px, ${y}px)`;
            });
            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translate(0, 0)';
            });
        });
    }
    
    function initHireMeButton() {
        const fabContainer = document.getElementById('hire-me-fab');
        const mainFab = document.getElementById('fab-main-btn');
        if (!fabContainer || !mainFab) return;
        mainFab.addEventListener('click', (e) => {
            e.stopPropagation();
            playSound(audioClick);
            fabContainer.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            if (fabContainer.classList.contains('active') && !fabContainer.contains(e.target)) {
                fabContainer.classList.remove('active');
            }
        });
    }

    /**
     * NEW: Initializes the WebGL Hero background.
     */
    function initHeroWebGL() {
        const canvas = document.getElementById('webgl-canvas');
        if (!canvas || window.matchMedia("(pointer: coarse)").matches) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const geometry = new THREE.PlaneGeometry(10, 10, 64, 64);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uMouse: { value: new THREE.Vector2(0, 0) }
            },
            vertexShader: `
                uniform float uTime;
                uniform vec2 uMouse;
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    vec3 pos = position;
                    float dist = distance(uv, uMouse * 0.5 + 0.5);
                    pos.z += sin(dist * 20.0 - uTime) * 0.1;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uTime;
                varying vec2 vUv;
                void main() {
                    float opacity = step(0.4, abs(0.5-vUv.x)) * 0.2 + 0.1;
                    gl_FragColor = vec4(vec3(0.0, 1.0, 1.0), opacity);
                }
            `,
            transparent: true,
            wireframe: true
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        camera.position.z = 2;
        const clock = new THREE.Clock();
        
        function animate() {
            material.uniforms.uTime.value = clock.getElapsedTime();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        window.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth * 2 - 1;
            const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
            gsap.to(material.uniforms.uMouse.value, { x: mouseX, y: mouseY, duration: 1.5, ease: 'power3.out' });
        });
    }

    /**
     * NEW: Initializes the project quick-view modal.
     */
    function initProjectModal() {
        const modal = document.getElementById('project-modal');
        const closeBtn = document.getElementById('modal-close-btn');
        const projectCards = document.querySelectorAll('.project-card');

        if (!modal || !closeBtn || projectCards.length === 0) return;

        const modalTitle = document.getElementById('modal-title');
        const modalImg = document.getElementById('modal-img');
        const modalGoal = document.getElementById('modal-goal');
        const modalImpact = document.getElementById('modal-impact');
        const modalLink = document.getElementById('modal-casestudy-link');

        projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                playSound(audioClick);
                
                modalTitle.textContent = card.dataset.title;
                modalImg.src = card.dataset.img;
                modalGoal.textContent = card.dataset.goal;
                modalImpact.textContent = card.dataset.impact;
                modalLink.href = card.dataset.casestudyUrl;

                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    }

    /**
     * NEW: Initializes sound controls and provides a helper function.
     */
    function initSound() {
        const muteBtn = document.getElementById('mute-btn');
        const iconOn = document.getElementById('icon-sound-on');
        const iconOff = document.getElementById('icon-sound-off');
        if (!muteBtn || !iconOn || !iconOff) return;

        muteBtn.addEventListener('click', () => {
            isMuted = !isMuted;
            iconOn.classList.toggle('hidden', isMuted);
            iconOff.classList.toggle('hidden', !isMuted);
            if (audioClick) {
                audioClick.muted = false;
                audioClick.play().catch(e => {});
            }
        });
    }

    function playSound(sound) {
        if (!isMuted && sound) {
            sound.currentTime = 0;
            sound.play().catch(e => {});
        }
    }


    // --- FINAL INITIALIZATION ---
    // This block calls all the functions to set up the page.

    initPageTransitions();
    initGlobalTiltEffect();
    initCustomCursor();
    initMobileMenu();
    initClock();
    initMagneticLinks();
    initTestimonialSlider(); 
    initHireMeButton();
    
    // NEW functions are called here
    initHeroWebGL();
    initProjectModal();
    initSound();
    
    // Kept from original file structure, checks if this element exists on the page before running
    if (document.querySelector('.next-project-link')) {
        // initNextProjectHover is not defined in this file. If you need it, ensure its function definition is present.
    }
    
    // Add a resize listener to re-run horizontal scroll logic for robustness
    window.addEventListener('resize', initHorizontalScroll);
});