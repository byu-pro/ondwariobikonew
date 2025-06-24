/**
 * work.js - Script for the Work Page
 * Handles the project filtering logic and animations.
 */
document.addEventListener('DOMContentLoaded', () => {
    const filterControls = document.getElementById('filter-controls');
    const workGrid = document.getElementById('work-grid');

    if (!filterControls || !workGrid) {
        console.warn('Filter controls or work grid not found. Aborting work.js initialization.');
        return;
    }

    const projectItems = workGrid.querySelectorAll('.work-item');
    const filterButtons = filterControls.querySelectorAll('.filter-btn');

    // --- Filtering Logic ---
    filterControls.addEventListener('click', (e) => {
        // Only proceed if a button was clicked
        if (!e.target.matches('.filter-btn')) {
            return;
        }

        const clickedButton = e.target;
        
        // Prevent clicking the same filter again
        if (clickedButton.classList.contains('active')) {
            return;
        }

        // Update active state on buttons
        filterButtons.forEach(button => button.classList.remove('active'));
        clickedButton.classList.add('active');

        const filterValue = clickedButton.dataset.filter;

        // Animate and filter items
        projectItems.forEach(item => {
            const itemCategory = item.dataset.category;
            const shouldShow = filterValue === 'all' || filterValue === itemCategory;
            
            // Add 'hiding' class to trigger the exit animation
            if (!shouldShow) {
                item.classList.add('hide');
            } else {
                item.classList.remove('hide');
            }
        });
    });

    // Initialize layout on load
    // This is a failsafe in case of any weird browser caching
    const initialFilter = filterControls.querySelector('.active')?.dataset.filter || 'all';
    projectItems.forEach(item => {
        const itemCategory = item.dataset.category;
        if (initialFilter !== 'all' && initialFilter !== itemCategory) {
            item.classList.add('hide');
        }
    });
});
