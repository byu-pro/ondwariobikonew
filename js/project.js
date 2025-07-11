// project.js - Shared logic for all project detail pages

document.addEventListener('DOMContentLoaded', () => {

    // --- Initialization ---
    // Global functions are expected to be initialized by app.js and main.js
    initRevealAnimations(); // Keep this if project pages have reveal animations
    initNextProjectHover();

    // --- Function Definitions ---

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
});