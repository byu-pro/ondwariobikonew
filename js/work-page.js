/**
 * work-page.js - Consolidated Script for the Work Page
 * Combines global functionality with work-grid specific animations
 * to prevent conflicts and ensure all elements load correctly.
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- Global Initializations (from app.js) ---
    initPageTransitions();
    initCustomCursor();
    initMobileMenu();
    initClock();
    initMagneticLinks();
    initHireMeButton();
    initGlobalTiltEffect();
    initRevealAnimations(); // CRITICAL: This was missing before

    // --- Work Page Specific Initializations (from work.js) ---
    initWorkGrid();

    // --- Function Definitions ---

    // 1. SHARED FUNCTIONS (from app.js / main.js)
    function initPageTransitions() {
        const preloader = document.getElementById('preloader');
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
                const destination = this.href;
                if (!destination || link.hostname !== window.location.hostname || destination.includes('#')) {
                    return;
                }
                e.preventDefault();
                
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('open')) {
                    mobileMenu.classList.remove('open');
                }

                document.body.classList.remove('loaded');
                setTimeout(() => { window.location.href = destination; }, 900);
            });
        });
    }

    function initCustomCursor() {
        const cursorDot = document.getElementById('cursor-dot');
        const cursorOutline = document.getElementById('cursor-outline');
        if (!cursorDot || !cursorOutline || window.matchMedia("(pointer: coarse)").matches) return;

        let mouseX = 0, mouseY = 0;
        gsap.to({}, 0.016, {
            repeat: -1,
            onRepeat: () => {
                gsap.set(cursorDot, { css: { left: mouseX, top: mouseY } });
                gsap.to(cursorOutline, { duration: 0.6, css: { left: mouseX, top: mouseY }, ease: "power2.out" });
            }
        });
        window.addEventListener("mousemove", e => { mouseX = e.clientX; mouseY = e.clientY; });

        document.querySelectorAll('a, button, .filter-btn, .nav-arrow, .work-item').forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
        });
    }

    function initMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        if (!menuToggle || !mobileMenu) return;
        const menuSpans = menuToggle.querySelectorAll('span');
        
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = mobileMenu.classList.toggle('open');
            document.body.style.overflow = isOpen ? 'hidden' : '';
            menuSpans[0].style.transform = isOpen ? 'translateY(5px) rotate(45deg)' : '';
            menuSpans[1].style.transform = isOpen ? 'translateY(-5px) rotate(-45deg)' : '';
        });
    }
    
    function initClock() {
        const timeEl = document.getElementById('current-time');
        if (!timeEl) return;
        const updateTime = () => {
            const now = new Date();
            const options = { timeZone: 'Africa/Nairobi', hour: '2-digit', minute: '2-digit', hour12: true };
            timeEl.textContent = now.toLocaleTimeString('en-US', options).replace(' ', '');
        };
        setInterval(updateTime, 1000);
        updateTime();
    }

    function initMagneticLinks() {
        document.querySelectorAll('.magnetic-link').forEach(link => {
            if (window.matchMedia("(pointer: coarse)").matches) return;
            link.addEventListener('mousemove', e => {
                const { clientX, clientY } = e;
                const { left, top, width, height } = link.getBoundingClientRect();
                const x = (clientX - (left + width / 2)) * 0.3;
                const y = (clientY - (top + height / 2)) * 0.3;
                gsap.to(link, { x: x, y: y, duration: 0.6, ease: "power2.out" });
            });
            link.addEventListener('mouseleave', () => {
                gsap.to(link, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
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

    function initGlobalTiltEffect() {
        if (window.matchMedia("(pointer: coarse)").matches) return;
        const TILT_AMOUNT = 8;
        document.querySelectorAll('.tilt-container').forEach(container => {
            const elementToTilt = container.querySelector('.interactive-tilt');
            if (!elementToTilt) return;
            container.addEventListener('mousemove', (e) => {
                const { top, left, width, height } = container.getBoundingClientRect();
                const x = ((e.clientX - left) / width - 0.5) * TILT_AMOUNT;
                const y = ((e.clientY - top) / height - 0.5) * -TILT_AMOUNT;
                gsap.to(elementToTilt, { rotateX: y, rotateY: x, duration: 0.8, ease: "power3.out" });
            });
            container.addEventListener('mouseleave', () => {
                gsap.to(elementToTilt, { rotateX: 0, rotateY: 0, duration: 1, ease: "elastic.out(1, 0.5)" });
            });
        });
    }

    /**
     * Initializes the Intersection Observer for reveal-on-scroll animations.
     * This function is crucial for making the hero text and other sections appear.
     */
    function initRevealAnimations() {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        // Ensure we are looking for all revealable elements on the page
        document.querySelectorAll('.reveal-up, .reveal-image, .reveal-line, .reveal-text').forEach(el => {
            observer.observe(el);
        });
    }

    // 2. WORK PAGE SPECIFIC FUNCTION
    function initWorkGrid() {
        if (typeof gsap === 'undefined' || typeof Flip === 'undefined') {
            console.error('GSAP or Flip plugin is not loaded.');
            return;
        }

        const filterControls = document.getElementById('filter-controls');
        const workGrid = document.getElementById('work-grid');
        
        if (!filterControls || !workGrid) return;
        
        const projectItems = Array.from(workGrid.querySelectorAll('.work-item'));
        const filterButtons = filterControls.querySelectorAll('.filter-btn');

        // Entrance Animation for the grid items
        gsap.to(projectItems, {
            duration: 0.8,
            y: 0,
            opacity: 1,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 0.5, // Delay slightly to let other animations start
        });

        // Filtering Logic with GSAP Flip
        filterControls.addEventListener('click', (e) => {
            const clickedButton = e.target.closest('.filter-btn');
            if (!clickedButton || clickedButton.classList.contains('active')) return;

            filterButtons.forEach(button => button.classList.remove('active'));
            clickedButton.classList.add('active');
            
            const filterValue = clickedButton.dataset.filter;
            const state = Flip.getState(projectItems);

            projectItems.forEach(item => {
                const itemCategory = item.dataset.category;
                const shouldShow = filterValue === 'all' || filterValue === itemCategory;
                gsap.set(item, { display: shouldShow ? 'block' : 'none' });
            });

            Flip.from(state, {
                duration: 0.7,
                scale: true,
                ease: "power3.inOut",
                stagger: 0.08,
                absolute: true,
                onEnter: elements => gsap.fromTo(elements, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.6 }),
                onLeave: elements => gsap.to(elements, { opacity: 0, scale: 0.8, duration: 0.6 }),
            });
        });
    }
});