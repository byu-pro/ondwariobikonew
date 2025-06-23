// main.js - Logic for the homepage

document.addEventListener('DOMContentLoaded', () => {

    // --- Data for Projects ---
    const projects = [
        {
            slug: "project-alpha.html",
            title: "Project Alpha",
            category: "Branding & Identity",
            imageUrl: "https://placehold.co/1200x900/003333/ffffff?text=Project+Alpha"
        },
        {
            slug: "project-beta.html",
            title: "Project Beta",
            category: "Web Design & UX",
            imageUrl: "https://placehold.co/1200x900/33001a/ffffff?text=Project+Beta"
        },
        {
            slug: "project-gamma.html",
            title: "Project Gamma",
            category: "Mobile Application",
            imageUrl: "https://placehold.co/1200x900/4a4a4a/ffffff?text=Project+Gamma"
        },
        {
            slug: "project-delta.html",
            title: "Project Delta",
            category: "Packaging Design",
            imageUrl: "https://placehold.co/1200x900/1a1a1a/ffffff?text=Project+Delta"
        }
    ];
    
    // --- Global Elements ---
    const preloader = document.getElementById('preloader');
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    // --- Functions ---

    /**
     * Populates the horizontal scroll track with project cards.
     */
    function populateProjects() {
        const track = document.querySelector('.horizontal-scroll-track');
        if (!track) return;

        let projectHTML = '';
        projects.forEach(p => {
            projectHTML += `
                <a href="${p.slug}" class="project-card page-link">
                    <img src="${p.imageUrl}" alt="${p.title}" class="project-image">
                    <div class="absolute bottom-0 left-0 p-8 text-white bg-gradient-to-t from-black/50 to-transparent w-full">
                        <h3 class="text-3xl font-bold">${p.title}</h3>
                        <p class="text-zinc-300">${p.category}</p>
                    </div>
                </a>
            `;
        });
        track.innerHTML = projectHTML;
    }
    
    /**
     * Handles the preloader and page load transitions.
     */
    function initPageTransitions() {
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            preloader.classList.add('loaded');
            // Trigger initial reveal animations after preloader finishes
            setTimeout(initRevealAnimations, 1000); 
        });

        document.querySelectorAll('.page-link').forEach(link => {
            if (link.dataset.listenerAttached) return;
            link.dataset.listenerAttached = 'true';
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const destination = this.href;
                preloader.classList.remove('loaded'); // Show preloader
                document.body.classList.remove('loaded'); // Hide content
                setTimeout(() => {
                    window.location.href = destination;
                }, 900);
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
        
        document.querySelectorAll('.reveal-line, .reveal-text, .reveal-image').forEach(el => observer.observe(el));
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

        document.querySelectorAll('.menu-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
                menuSpans.forEach(span => span.style.transform = '');
                
                const targetId = link.getAttribute('href');
                document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    /**
     * Translates vertical scroll into horizontal movement for the work section.
     */
    function initHorizontalScroll() {
        if (window.innerWidth < 1024) return; // Only for desktop

        const section = document.querySelector('.horizontal-scroll-section');
        const track = document.querySelector('.horizontal-scroll-track');
        if (!section || !track) return;
        
        const scrollableWidth = track.scrollWidth - window.innerWidth;
        section.style.height = `${track.scrollWidth}px`;

        window.addEventListener('scroll', () => {
            const stickyWrapper = document.querySelector('.sticky-wrapper');
            if (!stickyWrapper) return;

            const stickyTop = stickyWrapper.parentElement.offsetTop;
            const scrollFromTop = window.scrollY;
            
            if (scrollFromTop > stickyTop && scrollFromTop <= stickyTop + scrollableWidth) {
                let progress = (scrollFromTop - stickyTop) / scrollableWidth;
                track.style.transform = `translateX(-${scrollableWidth * Math.min(progress, 1)}px)`;
            } else if (scrollFromTop <= stickyTop) {
                track.style.transform = `translateX(0px)`;
            }
        });
    }

    /**
     * Updates the clock in the footer.
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
     * Reloads the page on resize to recalculate dimensions.
     */
    function initResizeListener() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            document.body.classList.remove('loaded');
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => window.location.reload(), 250);
        });
    }


    // --- Initialization ---
    populateProjects();
    initPageTransitions();
    initCustomCursor();
    initMobileMenu();
    initHorizontalScroll();
    initClock();
    initMagneticLinks();
    initResizeListener();
});
