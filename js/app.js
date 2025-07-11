/**
 * app.js - Core Application Script
 * Handles all shared, global functionality across the site,
 * such as the preloader, custom cursor, and mobile menu.
 *
 * NOTE: initPageTransitions has been removed from this file.
 * It is now solely managed by main.js to avoid conflicts and ensure
 * consistent behavior across all pages.
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- Global Initializations ---
    // These functions are called on every page.
    initCustomCursor();
    initMobileMenu();
    initClock();
    initMagneticLinks();
    initHireMeButton();
    initGlobalTiltEffect();

    // --- Function Definitions ---

    function initCustomCursor() {
        const cursorDot = document.getElementById('cursor-dot');
        const cursorOutline = document.getElementById('cursor-outline');
        if (!cursorDot || !cursorOutline || window.matchMedia("(pointer: coarse)").matches) return;

        let mouseX = 0, mouseY = 0;
        gsap.to({}, 0.016, {
            repeat: -1,
            onRepeat: () => {
                const a = { x: 0, y: 0 };
                gsap.set(cursorDot, { css: { left: mouseX, top: mouseY } });
                gsap.to(cursorOutline, { duration: 0.6, css: { left: mouseX, top: mouseY }, ease: "power2.out" });
            }
        });
        window.addEventListener("mousemove", e => { mouseX = e.clientX; mouseY = e.clientY; });

        document.querySelectorAll('a, button, .filter-btn, .nav-arrow, .work-item, .project-card, .logo-item, .social-icon-link, .fab-main, .fab-option, .instagram-post-card').forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
        });

        // Text hover for cursor
        document.querySelectorAll('p, h1, h2, h3, h4, h5, h6').forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('text-hover'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('text-hover'));
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
});