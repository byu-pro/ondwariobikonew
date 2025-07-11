/**
 * main.js - Unified Premium Portfolio Script
 * Handles all core animations and interactions site-wide.
 */

// Import Three.js for WebGL functionality
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';

document.addEventListener('DOMContentLoaded', () => {

    // --- Global DOM Elements ---
    const preloader = document.getElementById('preloader');
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    const cursorText = document.getElementById('cursor-text');

    /**
     * Fixed: Page transitions now work while preserving all animations
     */
    function initPageTransitions() {
        // On page load, reveal the content
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            if (preloader) {
                preloader.classList.add('loaded');
            }
        });

        document.querySelectorAll('.page-link').forEach(link => {
            if (link.dataset.listenerAttached) return;
            link.dataset.listenerAttached = 'true';

            link.addEventListener('click', function(e) {
                // Handle anchor links differently
                if (this.hash && this.href.split('#')[0] === window.location.href.split('#')[0]) {
                    e.preventDefault();
                    const target = document.querySelector(this.hash);
                    if (target) {
                        gsap.to(window, {
                            scrollTo: target,
                            duration: 1,
                            ease: "power3.inOut"
                        });
                    }
                    return;
                }

                // Only intercept internal links
                if (!this.href || this.hostname !== window.location.hostname) {
                    return;
                }

                e.preventDefault();
                const destination = this.href;

                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('open')) {
                    mobileMenu.classList.remove('open');
                    document.body.style.overflow = '';
                    document.querySelectorAll('#menu-toggle span').forEach(span => {
                        span.style.transform = '';
                    });
                }

                // Start exit animation
                document.body.classList.remove('loaded');
                if (preloader) {
                    const preloaderText = preloader.querySelector('.preloader-text-inner');
                    if (preloaderText) {
                        gsap.to(preloaderText, {
                            y: '120%',
                            duration: 0.8,
                            ease: "power3.inOut"
                        });
                    }
                    preloader.classList.remove('loaded');
                }

                // Navigate after animation completes
                gsap.delayedCall(0.9, () => {
                    window.location.href = destination;
                });
            });
        });
    }

    /**
     * PRESERVED: All your original animation functions below
     * (Only initPageTransitions was modified)
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

                        const skillItems = entry.target.querySelectorAll('.skill-item');
                        skillItems.forEach(item => {
                            const targetPercent = item.dataset.percent;
                            const progressBarInner = item.querySelector('.progress-bar-inner');
                            const skillPercentText = item.querySelector('.skill-percent');
                            const counter = { val: 0 };

                            gsap.to(progressBarInner, {
                                width: targetPercent + '%',
                                duration: 1.8,
                                ease: 'cubic.out',
                                delay: 0.3
                            });

                            gsap.to(counter, {
                                val: targetPercent,
                                duration: 1.8,
                                ease: 'cubic.out',
                                delay: 0.3,
                                onUpdate: () => {
                                    skillPercentText.textContent = Math.round(counter.val) + '%';
                                }
                            });
                        });
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
        
        document.querySelectorAll('.reveal-up, .reveal-image, .reveal-line, .reveal-text, .toolkit-category').forEach(el => observer.observe(el));
    }

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
                gsap.to(elementToTilt, { rotateX: rotateX, rotateY: rotateY, duration: 0.8, ease: "power3.out" });
            });
            container.addEventListener('mouseleave', () => {
                gsap.to(elementToTilt, { rotateX: 0, rotateY: 0, duration: 1, ease: "elastic.out(1, 0.5)" });
            });
        });
    }

    function initCustomCursor() {
        if (!cursorDot || !cursorOutline || window.matchMedia("(pointer: coarse)").matches) return;

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

        const interactiveElements = 'a, button, .project-card, .logo-item, .filter-btn, .nav-arrow, .social-icon-link, .fab-main, .fab-option, .instagram-post-card';
        document.querySelectorAll(interactiveElements).forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('hover');
                const customText = el.getAttribute('data-cursor-text');
                if (cursorText) {
                    cursorText.textContent = customText || 'Click';
                    cursorText.style.opacity = 1;
                }
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('hover');
                if (cursorText) {
                    cursorText.textContent = '';
                    cursorText.style.opacity = 0;
                }
            });
        });

        document.querySelectorAll('p, h1, h2, h3, h4, h5, h6').forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('text-hover'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('text-hover'));
        });
    }

    function initHorizontalScroll() {
        const section = document.querySelector('.horizontal-scroll-section');
        if (!section || !window.gsap || window.innerWidth < 1024) {
            if (section) section.style.height = '';
            return;
        }

        const track = section.querySelector('.horizontal-scroll-track');
        if (!track) return;

        gsap.to(track, {
            x: () => -(track.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
                trigger: section,
                pin: true,
                scrub: 1,
                end: () => "+=" + (track.scrollWidth - window.innerWidth),
                invalidateOnRefresh: true
            }
        });
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
            gsap.to(track, {
                x: `-${index * 100}%`,
                duration: 0.6,
                ease: "power3.inOut"
            });
            dots[currentIndex]?.classList.remove('active');
            dots[index]?.classList.add('active');
            prevButton.disabled = index === 0;
            nextButton.disabled = index === slides.length - 1;
            currentIndex = index;
        };
        
        prevButton.addEventListener('click', () => currentIndex > 0 && goToSlide(currentIndex - 1));
        nextButton.addEventListener('click', () => currentIndex < slides.length - 1 && goToSlide(currentIndex + 1));
        prevButton.disabled = true;
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
            if (window.matchMedia("(pointer: coarse)").matches) return;
            link.addEventListener('mousemove', (e) => {
                const { clientX, clientY } = e;
                const { left, top, width, height } = link.getBoundingClientRect();
                const x = (clientX - (left + width / 2)) * 0.2;
                const y = (clientY - (top + height / 2)) * 0.2;
                gsap.to(link, { x: x, y: y, duration: 0.6, ease: "power2.out" });
            });
            link.addEventListener('mouseleave', () => {
                gsap.to(link, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
            });
        });
    }

    function initHireMeButton() {
        const fabContainer = document.getElementById('hire-me-fab');
        const mainFab = document.getElementById('fab-main-btn');
        if (!fabContainer || !mainFab) return;
        
        mainFab.addEventListener('click', (e) => {
            e.stopPropagation();
            fabContainer.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (fabContainer.classList.contains('active') && !fabContainer.contains(e.target)) {
                fabContainer.classList.remove('active');
            }
        });
    }

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

                modalTitle.textContent = card.dataset.title;
                modalImg.src = card.dataset.img;
                modalGoal.textContent = card.dataset.goal;
                modalImpact.textContent = card.dataset.impact;
                modalLink.href = card.dataset.casestudyUrl;

                gsap.to(modal, {
                    opacity: 1,
                    visibility: 'visible',
                    duration: 0.3
                });
                document.body.style.overflow = 'hidden';
            });
        });

        const closeModal = () => {
            gsap.to(modal, {
                opacity: 0,
                visibility: 'hidden',
                duration: 0.3,
                onComplete: () => {
                    document.body.style.overflow = '';
                }
            });
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    }

    function initInstagramCarousel() {
        const carouselTrack = document.querySelector('#instagram-carousel-section .instagram-carousel-track');
        if (!carouselTrack || !window.gsap) return;

        const items = Array.from(carouselTrack.children);
        if (items.length === 0) return;

        carouselTrack.querySelectorAll('.carousel-clone').forEach(clone => clone.remove());

        items.forEach(item => {
            const clone = item.cloneNode(true);
            clone.classList.add('carousel-clone');
            carouselTrack.appendChild(clone);
        });

        let totalWidth = 0;
        items.forEach(item => {
            totalWidth += item.offsetWidth + parseFloat(getComputedStyle(item).marginRight) + parseFloat(getComputedStyle(item).marginLeft);
        });

        gsap.to(carouselTrack, {
            x: -totalWidth,
            ease: "none",
            duration: items.length * 4,
            repeat: -1,
            modifiers: {
                x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
            }
        });
    }

    // --- Initialize Everything ---
    initPageTransitions();
    initGlobalTiltEffect();
    initCustomCursor();
    initClock();
    initMagneticLinks();
    initTestimonialSlider();
    initHireMeButton();
    initRevealAnimations();
    initHorizontalScroll();
    initHeroWebGL();
    initProjectModal();
    initInstagramCarousel();

    window.addEventListener('resize', () => {
        initHorizontalScroll();
        initInstagramCarousel();
    });
});