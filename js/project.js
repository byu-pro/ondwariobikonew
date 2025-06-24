// project.js - Shared logic for all project detail pages

document.addEventListener('DOMContentLoaded', () => {

    // --- Global Elements ---
    const preloader = document.getElementById('preloader');
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    /**
     * Handles the preloader and page load transitions.
     */
    function initPageTransitions() {
        // On page load, reveal the content
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            if(preloader) {
                preloader.classList.add('loaded');
            }
            // Trigger initial reveal animations after a short delay
            setTimeout(initRevealAnimations, 500);
        });

        // Add transition effect when clicking main navigation links
        document.querySelectorAll('.page-link').forEach(link => {
            if (link.dataset.listenerAttached) return;
            link.dataset.listenerAttached = 'true';
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const destination = this.href;
                document.body.classList.remove('loaded');
                if(preloader) {
                    preloader.classList.remove('loaded');
                }
                setTimeout(() => {
                    window.location.href = destination;
                }, 900); // Match transition time in CSS
            });
        });
    }

    /**
     * Initializes the Intersection Observer for reveal-on-scroll animations.
     */
    function initRevealAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.reveal-up, .reveal-image, .reveal-line, .reveal-text').forEach(el => observer.observe(el));
    }

    /**
     * Sets up the custom cursor movement and interaction states.
     */
    function initCustomCursor() {
        if (!cursorDot || !cursorOutline) return;

        window.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            cursorDot.style.left = `${clientX}px`;
            cursorDot.style.top = `${clientY}px`;
            cursorOutline.animate({ left: `${clientX}px`, top: `${clientY}px` }, { duration: 600, fill: 'forwards' });
        });
        
        document.body.addEventListener('mouseleave', () => {
            cursorDot.classList.add('cursor-hidden');
            cursorOutline.classList.add('cursor-hidden');
        });

        document.body.addEventListener('mouseenter', () => {
            cursorDot.classList.remove('cursor-hidden');
            cursorOutline.classList.remove('cursor-hidden');
        });

        const interactiveElements = document.querySelectorAll('a, button');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
        });
        
        const textElements = document.querySelectorAll('p, h1, h2, h3');
        textElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('text-hover'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('text-hover'));
        });
    }
    
    /**
     * Sets up the mobile navigation menu toggle.
     */
    function initMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        if (!menuToggle || !mobileMenu) return;

        const menuSpans = menuToggle.querySelectorAll('span');
        menuToggle.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('open');
            document.body.style.overflow = isOpen ? 'hidden' : '';
            menuSpans[0].style.transform = isOpen ? 'translateY(5px) rotate(45deg)' : '';
            menuSpans[1].style.transform = isOpen ? 'translateY(-5px) rotate(-45deg)' : '';
        });

        // Handle menu link clicks
        document.querySelectorAll('#mobile-menu .menu-link').forEach(link => {
            link.addEventListener('click', (e) => {
                // Close the menu
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
                menuSpans.forEach(span => span.style.transform = '');
                
                // Only prevent default if it's a hash link (same page navigation)
                if (link.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(link.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    }

    /**
     * Updates the clock in the footer to Kenya time (EAT).
     */
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
    
    /**
     * Adds a magnetic effect to specified links.
     */
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

    /**
     * Handles hover effect for the next project link.
     */
    function initNextProjectHover() {
        const link = document.querySelector('.next-project-link');
        const preview = document.querySelector('.next-project-preview');
        if (!link || !preview) return;
    
        link.addEventListener('mousemove', (e) => {
            preview.style.opacity = '1';
            preview.style.transform = `translate(${e.clientX}px, ${e.clientY}px) scale(1)`;
        });
    
        link.addEventListener('mouseleave', () => {
            preview.style.opacity = '0';
            preview.style.transform = `translate(-50%, -50%) scale(0.8)`;
        });
    }

    // --- Initialization ---
    initPageTransitions();
    initCustomCursor();
    initMobileMenu();
    initClock();
    initMagneticLinks();
    initNextProjectHover();
});