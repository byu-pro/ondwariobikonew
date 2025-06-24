// main.js - Premium Portfolio Script
document.addEventListener('DOMContentLoaded', () => {
    // --- Project Data ---
    // Updated to match the content in index.html for consistency
    const projects = [
        {
            slug: "project-alpha.html",
            title: "Nairobi Coffee Co.",
            category: "Branding & Identity",
            imageUrl: "https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2232&q=80"
        },
        {
            slug: "project-beta.html",
            title: "Safari Explorer",
            category: "Web Design & UX",
            imageUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
        },
        {
            slug: "project-gamma.html",
            title: "PesaTrack",
            category: "Mobile Application",
            imageUrl: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
        },
        {
            slug: "project-delta.html",
            title: "Maisha Tea",
            category: "Packaging Design",
            imageUrl: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
        },
        {
            slug: "project-epsilon.html", // Assuming this page exists or will be created
            title: "AfroFuturism",
            category: "Digital Art Series",
            imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
        }
    ];

    // --- DOM Elements ---
    const preloader = document.getElementById('preloader');
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    const cursorText = document.getElementById('cursor-text');

    // --- Core Functions ---

    function populateProjects() {
        const track = document.querySelector('.horizontal-scroll-track');
        if (!track) return;

        track.innerHTML = projects.map(p => `
            <a href="${p.slug}" class="project-card page-link">
                <div class="project-image-container">
                    <img src="${p.imageUrl}" alt="${p.title}" class="project-image" loading="lazy">
                    <div class="project-overlay"></div>
                </div>
                <div class="project-info">
                    <h3 class="project-title">${p.title}</h3>
                    <p class="project-category">${p.category}</p>
                </div>
            </a>
        `).join('');

        // Re-initialize event listeners after populating
        initPageTransitions(); 
        initImageLoading();
    }

    function initImageLoading() {
        document.querySelectorAll('.project-image').forEach(img => {
            if (img.complete) {
                img.closest('.project-card').classList.add('loaded');
            } else {
                img.addEventListener('load', () => {
                    img.closest('.project-card').classList.add('loaded');
                });
            }
        });
    }

    function initPageTransitions() {
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            if (preloader) {
                preloader.classList.add('loaded');
            }
            setTimeout(initRevealAnimations, 500);
        });

        document.querySelectorAll('.page-link').forEach(link => {
            if (link.dataset.listenerAttached) return; // Prevent multiple listeners
            link.dataset.listenerAttached = 'true';

            link.addEventListener('click', function(e) {
                e.preventDefault();
                const destination = this.href;
                
                document.body.classList.remove('loaded');
                if (preloader) preloader.classList.remove('loaded');
                
                setTimeout(() => {
                    window.location.href = destination;
                }, 900);
            });
        });
    }

    function initRevealAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll(
            '.reveal-line, .reveal-text, .reveal-image, .reveal-up'
        ).forEach(el => observer.observe(el));
    }

    function initCustomCursor() {
        if (!cursorDot || !cursorOutline) return;

        window.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            cursorDot.style.transform = `translate(${clientX}px, ${clientY}px)`;
            cursorOutline.style.transform = `translate(${clientX}px, ${clientY}px)`;
        });

        document.body.addEventListener('mouseleave', () => {
            cursorDot.classList.add('cursor-hidden');
            cursorOutline.classList.add('cursor-hidden');
        });

        document.body.addEventListener('mouseenter', () => {
            cursorDot.classList.remove('cursor-hidden');
            cursorOutline.classList.remove('cursor-hidden');
        });

        // Interactive elements with cursor text
        const interactiveElements = [
            { selector: 'a, button', text: 'Click' },
            { selector: '.project-card', text: 'View' }
        ];

        interactiveElements.forEach(item => {
            document.querySelectorAll(item.selector).forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursorOutline.classList.add('hover');
                    if (cursorText && item.text) cursorText.textContent = item.text;
                });
                el.addEventListener('mouseleave', () => {
                    cursorOutline.classList.remove('hover');
                    if (cursorText) cursorText.textContent = '';
                });
            });
        });
        
        // Text hover elements
        document.querySelectorAll('p, h1, h2, h3').forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('text-hover'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('text-hover'));
        });
    }

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
    }

    function initHorizontalScroll() {
        const section = document.querySelector('.horizontal-scroll-section');
        const track = document.querySelector('.horizontal-scroll-track');
        if (!section || !track) return;

        if (window.innerWidth < 1024) {
            // Mobile uses native scrolling, so no JS logic is needed here.
            // The responsive CSS in main.css handles the layout and scrolling.
            document.body.classList.add('is-mobile-scroll');
            section.style.height = 'auto'; // Ensure height is reset for mobile
            track.style.transform = 'none'; // Ensure transform is reset
        } else {
            // Desktop Implementation
            document.body.classList.remove('is-mobile-scroll');
            const scrollableWidth = track.scrollWidth - window.innerWidth;
            section.style.height = `${track.scrollWidth}px`;

            window.addEventListener('scroll', () => {
                const stickyWrapper = document.querySelector('.sticky-wrapper');
                if (!stickyWrapper) return;

                const stickyTop = stickyWrapper.parentElement.offsetTop;
                const scrollFromTop = window.scrollY;
                
                if (scrollFromTop > stickyTop && scrollFromTop <= stickyTop + scrollableWidth) {
                    const progress = (scrollFromTop - stickyTop) / scrollableWidth;
                    track.style.transform = `translateX(-${scrollableWidth * Math.min(progress, 1)}px)`;
                } else if (scrollFromTop <= stickyTop) {
                    track.style.transform = 'translateX(0)';
                } else {
                    track.style.transform = `translateX(-${scrollableWidth}px)`;
                }
            });
        }
    }

    function initClock() {
        const timeEl = document.getElementById('current-time');
        if (!timeEl) return;

        function updateTime() {
            const now = new Date();
            const options = { 
                timeZone: 'Africa/Nairobi',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            };
            timeEl.textContent = now.toLocaleTimeString('en-US', options);
        }
        updateTime();
        setInterval(updateTime, 30000);
    }

    function initMagneticLinks() {
        document.querySelectorAll('.magnetic-link').forEach(link => {
            link.addEventListener('mousemove', (e) => {
                const rect = link.getBoundingClientRect();
                const x = (e.clientX - (rect.left + rect.width / 2)) * 0.2;
                const y = (e.clientY - (rect.top + rect.height / 2)) * 0.2;
                link.style.transform = `translate(${x}px, ${y}px)`;
            });
            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translate(0, 0)';
            });
        });
    }

    function initResizeHandler() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Re-initialize the scroll logic on resize
                initHorizontalScroll();
            }, 250);
        });
    }

    // --- Initialize Everything ---
    if (document.querySelector('.horizontal-scroll-track')) {
        populateProjects();
    }
    initPageTransitions(); // Called globally as it applies to all pages
    initCustomCursor();
    initMobileMenu();
    initHorizontalScroll();
    initClock();
    initMagneticLinks();
    initResizeHandler();
});