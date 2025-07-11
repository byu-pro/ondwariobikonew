/**
 * work-page.js - Consolidated Script for the Work Page
 * This script focuses on work-grid specific animations and assumes global
 * functionalities like page transitions, custom cursor, and mobile menu
 * are handled by `app.js` and `main.js` which should be loaded before this.
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- Work Page Specific Initializations ---
    initWorkGrid();

    // --- Global Initializations (if needed to be called explicitly here,
    // otherwise assume app.js/main.js handle them on DCL) ---
    // It's good practice to ensure reveal animations are applied to
    // elements on this specific page if they are present.
    initRevealAnimations(); // CRITICAL: This ensures reveal animations work on this page.

    // --- Function Definitions ---

    /**
     * Initializes the Intersection Observer for reveal-on-scroll animations.
     * This function is crucial for making the hero text and other sections appear.
     * (Duplicated from main.js, but often necessary if specific page elements
     * need their reveal triggered, and if main.js's DCL listener might fire late
     * or on different elements).
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

    /**
     * Initializes the filtering and animation logic for the work grid.
     */
    function initWorkGrid() {
        // Ensure GSAP and Flip plugin are loaded before proceeding
        if (typeof gsap === 'undefined' || typeof Flip === 'undefined') {
            console.error('GSAP or Flip plugin is not loaded. Ensure they are correctly imported in your HTML.');
            return;
        }

        const filterControls = document.getElementById('filter-controls');
        const workGrid = document.getElementById('work-grid');

        if (!filterControls || !workGrid) return;

        const projectItems = Array.from(workGrid.querySelectorAll('.work-item'));
        const filterButtons = filterControls.querySelectorAll('.filter-btn');

        // Entrance Animation for the grid items
        gsap.from(projectItems, { // Changed to gsap.from for initial animation
            duration: 0.8,
            y: 30, // Start from slightly below
            opacity: 0, // Start invisible
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
            const state = Flip.getState(projectItems); // Capture state before changes

            projectItems.forEach(item => {
                const itemCategory = item.dataset.category;
                const shouldShow = filterValue === 'all' || filterValue === itemCategory;

                // Use display: 'none' or 'block' to remove/add from flow
                // Flip will handle the animation for existing items.
                // New items (from 'none' to 'block') will animate in via onEnter.
                // Items going from 'block' to 'none' will animate out via onLeave.
                if (shouldShow) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });

            Flip.from(state, {
                duration: 0.7,
                scale: true, // Animate scale during flip
                ease: "power3.inOut",
                stagger: 0.08, // Stagger animation for items
                absolute: true, // Keep elements absolutely positioned during animation
                onEnter: elements => gsap.fromTo(elements, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }),
                onLeave: elements => gsap.to(elements, { opacity: 0, scale: 0.8, duration: 0.6, ease: "power3.in" }),
            });
        });
    }
});