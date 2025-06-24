/**
 * work.js - Advanced filtering and animations for the Work Page
 * Uses GSAP and the Flip plugin for fluid grid animations.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Wait for GSAP and the Flip plugin to be ready
    gsap.registerPlugin(Flip);

    const filterControls = document.getElementById('filter-controls');
    const workGrid = document.getElementById('work-grid');
    
    if (!filterControls || !workGrid) {
        console.warn('Filter controls or work grid not found on this page.');
        return;
    }
    
    const projectItems = Array.from(workGrid.querySelectorAll('.work-item'));
    const filterButtons = filterControls.querySelectorAll('.filter-btn');

    // --- Classy Entrance Animation ---
    // Stagger the appearance of each grid item on page load
    gsap.from(projectItems, {
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.5, // Delay to allow other page elements to load
    });

    // --- Sophisticated Filtering Logic with GSAP Flip ---
    filterControls.addEventListener('click', (e) => {
        const clickedButton = e.target.closest('.filter-btn');
        if (!clickedButton || clickedButton.classList.contains('active')) {
            return;
        }

        // Update active state on buttons
        filterButtons.forEach(button => button.classList.remove('active'));
        clickedButton.classList.add('active');
        
        const filterValue = clickedButton.dataset.filter;

        // 1. Get the current state of the grid
        const state = Flip.getState(projectItems);

        // 2. Hide/show items based on the filter (this causes the layout jump)
        projectItems.forEach(item => {
            const itemCategory = item.dataset.category;
            const shouldShow = filterValue === 'all' || filterValue === itemCategory;
            // Use GSAP's set for immediate effect, preparing for the animation
            gsap.set(item, { display: shouldShow ? 'block' : 'none' });
        });

        // 3. Animate from the old state to the new state
        Flip.from(state, {
            duration: 0.7,
            scale: true,
            ease: "power3.inOut",
            stagger: 0.08,
            // You can add absolute positioning during the flip to prevent reflow issues
            absolute: true, 
            onEnter: elements => gsap.fromTo(elements, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.6 }),
            onLeave: elements => gsap.to(elements, { opacity: 0, scale: 0.8, duration: 0.6 }),
        });
    });
});