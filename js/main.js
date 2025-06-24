/**
 * main.js - Unified Premium Portfolio Script
 * Handles all core animations and interactions site-wide.
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- Global DOM Elements ---
    const preloader = document.getElementById('preloader');
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    const cursorText = document.getElementById('cursor-text');

    /**
     * Handles the preloader and smooth page load transitions.
     */
    function initPageTransitions() {
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            if (preloader) {
                preloader.classList.add('loaded');
            }
            setTimeout(initRevealAnimations, 500);
            setTimeout(initSkillMeters, 500);
        });

        document.querySelectorAll('.page-link').forEach(link => {
            if (link.dataset.listenerAttached) return;
            link.dataset.listenerAttached = 'true';
            link.addEventListener('click', function(e) {
                // MODIFIED: Added an exception for services.html to fix navigation bug
                if (this.href.includes('work.html') || this.href.includes('services.html')) {
                    return; // Let the default link behavior happen
                }
                
                e.preventDefault();
                const destination = this.href;
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
                    // For toolkit category, reveal list items with a stagger
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
     * NEW & IMPROVED: Applies an interactive 3D tilt effect to designated elements sitewide.
     */
    function initGlobalTiltEffect() {
        // Don't run tilt effect on touch devices
        if (window.matchMedia("(pointer: coarse)").matches) return;

        const TILT_AMOUNT = 8; // Max tilt in degrees. Adjust for more/less effect.
        const containers = document.querySelectorAll('.tilt-container');

        containers.forEach(container => {
            const elementToTilt = container.querySelector('.interactive-tilt');
            if (!elementToTilt) return;

            container.addEventListener('mousemove', (e) => {
                const { clientX, clientY } = e;
                const { top, left, width, height } = container.getBoundingClientRect();
                
                // Calculate mouse position from center of the container (-0.5 to 0.5)
                const x = ((clientX - left) / width) - 0.5;
                const y = ((clientY - top) / height) - 0.5;

                // Apply transform based on mouse position
                const rotateY = x * TILT_AMOUNT;
                const rotateX = -y * TILT_AMOUNT;
                
                elementToTilt.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            // Reset transform when mouse leaves the container
            container.addEventListener('mouseleave', () => {
                elementToTilt.style.transform = 'rotateX(0deg) rotateY(0deg)';
            });
        });
    }


    /**
     * Sets up the custom cursor movement and interaction states.
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

        const interactiveElements = [
            { selector: 'a, button', text: 'Click' },
            { selector: '.project-card', text: 'View' },
            { selector: '.logo-item', text: 'Visit' }
        ];
        interactiveElements.forEach(item => {
            document.querySelectorAll(item.selector).forEach(el => {
                el.addEventListener('mouseenter', () => { cursorOutline.classList.add('hover'); if (cursorText && item.text) cursorText.textContent = item.text; });
                el.addEventListener('mouseleave', () => { cursorOutline.classList.remove('hover'); if (cursorText) cursorText.textContent = ''; });
            });
        });
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

    function initHorizontalScroll() {
        const section = document.querySelector('.horizontal-scroll-section');
        if (!section) return;
        const handleScroll = () => {
            if (window.innerWidth >= 1024) {
                const track = section.querySelector('.horizontal-scroll-track');
                const stickyWrapper = section.querySelector('.sticky-wrapper');
                if (!track || !stickyWrapper) return;
                const scrollableWidth = track.scrollWidth - window.innerWidth;
                section.style.height = `${track.scrollWidth}px`;
                const stickyTop = section.offsetTop;
                const scrollFromTop = window.scrollY;
                if (scrollFromTop > stickyTop && scrollFromTop <= stickyTop + scrollableWidth) {
                    track.style.transform = `translateX(-${scrollFromTop - stickyTop}px)`;
                } else if (scrollFromTop <= stickyTop) {
                    track.style.transform = 'translateX(0px)';
                } else {
                    track.style.transform = `translateX(-${scrollableWidth}px)`;
                }
            } else {
                section.style.height = 'auto';
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    /**
     * Initializes the new testimonial slider functionality.
     */
    function initTestimonialSlider() {
        const slider = document.getElementById('testimonial-slider');
        if (!slider) return;

        const track = slider.querySelector('.testimonial-track');
        const slides = Array.from(track.children);
        const nextButton = document.getElementById('testimonial-next');
        const prevButton = document.getElementById('testimonial-prev');
        const paginationNav = document.getElementById('testimonial-pagination');
        let currentIndex = 0;

        // Create pagination dots
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
            // Update dots
            dots[oldIndex]?.classList.remove('active');
            dots[newIndex]?.classList.add('active');

            // Update buttons
            prevButton.disabled = newIndex === 0;
            nextButton.disabled = newIndex === slides.length - 1;
        };
        
        nextButton.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) {
                goToSlide(currentIndex + 1);
            }
        });

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                goToSlide(currentIndex - 1);
            }
        });
        
        // Initialize nav state
        updateNav(0, 0);
    }


    function initNextProjectHover() {
        const link = document.querySelector('.next-project-link');
        const preview = document.querySelector('.next-project-preview');
        if (!link || !preview) return;
        link.addEventListener('mousemove', (e) => { preview.style.opacity = '1'; preview.style.transform = `translate(${e.clientX}px, ${e.clientY}px) scale(1)`; });
        link.addEventListener('mouseleave', (e) => { preview.style.opacity = '0'; preview.style.transform = `translate(${e.clientX}px, ${e.clientY}px) scale(0.8)`; });
    }

    /**
     * Animates skill meters when they enter the viewport.
     */
    function initSkillMeters() {
        const skillItems = document.querySelectorAll('.skill-item');
        if (skillItems.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const item = entry.target;
                    const progressBar = item.querySelector('.progress-bar-inner');
                    const percentText = item.querySelector('.skill-percent');
                    const targetPercent = parseInt(item.dataset.percent, 10);
                    
                    // Animate progress bar width
                    progressBar.style.width = `${targetPercent}%`;

                    // Animate percentage text count-up
                    let currentPercent = 0;
                    const interval = setInterval(() => {
                        if (currentPercent >= targetPercent) {
                            clearInterval(interval);
                            percentText.textContent = `${targetPercent}%`;
                        } else {
                            currentPercent++;
                            percentText.textContent = `${currentPercent}%`;
                        }
                    }, 1500 / targetPercent);

                    observer.unobserve(item);
                }
            });
        }, { threshold: 0.5 });

        skillItems.forEach(item => observer.observe(item));
    }

    function initClock() {
        const timeEl = document.getElementById('current-time');
        if (!timeEl) return;
        const updateTime = () => timeEl.textContent = new Date().toLocaleTimeString('en-US', { timeZone: 'Africa/Nairobi', hour: '2-digit', minute: '2-digit', hour12: true });
        updateTime();
        setInterval(updateTime, 30000);
    }
    
    function initMagneticLinks() {
        document.querySelectorAll('.magnetic-link').forEach(link => {
            const span = link.querySelector('span');
            if (!span) return;
            link.addEventListener('mousemove', (e) => {
                const rect = link.getBoundingClientRect();
                span.style.transform = `translate(${(e.clientX - (rect.left + rect.width / 2)) * 0.3}px, ${(e.clientY - (rect.top + rect.height / 2)) * 0.3}px)`;
            });
            link.addEventListener('mouseleave', () => { span.style.transform = 'translate(0, 0)'; });
        });
    }

    function initResizeHandler() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            document.body.classList.add('is-resizing');
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => { document.body.classList.remove('is-resizing'); initHorizontalScroll(); }, 250);
        });
    }

    // --- INITIALIZE ALL FUNCTIONS ---
    initPageTransitions();
    initGlobalTiltEffect(); // UPDATED
    initCustomCursor();
    initMobileMenu();
    initClock();
    initMagneticLinks();
    initResizeHandler();
    initTestimonialSlider(); 
    
    if (document.querySelector('.horizontal-scroll-section')) initHorizontalScroll();
    if (document.querySelector('.next-project-link')) initNextProjectHover();
    if (document.querySelector('.skill-item')) initSkillMeters();
});