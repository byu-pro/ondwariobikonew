// main.js - Premium Portfolio Script
document.addEventListener('DOMContentLoaded', () => {
    // --- Project Data ---
    const projects = [
        {
            slug: "project-alpha.html",
            title: "Project Alpha",
            category: "Branding & Identity",
            imageUrl: "https://source.unsplash.com/random/1200x900/?design,branding"
        },
        {
            slug: "project-beta.html",
            title: "Project Beta",
            category: "Web Design & UX",
            imageUrl: "https://source.unsplash.com/random/1200x900/?design,web"
        },
        {
            slug: "project-gamma.html",
            title: "Project Gamma",
            category: "Mobile Application",
            imageUrl: "https://source.unsplash.com/random/1200x900/?design,mobile"
        },
        {
            slug: "project-delta.html",
            title: "Project Delta",
            category: "Packaging Design",
            imageUrl: "https://source.unsplash.com/random/1200x900/?design,packaging"
        }
    ];

    // --- DOM Elements ---
    const preloader = document.getElementById('preloader');
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    let scrollDirection = 0;
    let lastScrollTime = 0;

    // --- Core Functions ---

    function populateProjects() {
        const track = document.querySelector('.horizontal-scroll-track');
        if (!track) return;

        track.innerHTML = projects.map(p => `
            <a href="${p.slug}" class="project-card page-link">
                <div class="project-image-container">
                    <img src="${p.imageUrl}" alt="${p.title}" class="project-image">
                    <div class="project-overlay"></div>
                </div>
                <div class="project-info">
                    <h3 class="project-title">${p.title}</h3>
                    <p class="project-category">${p.category}</p>
                </div>
            </a>
        `).join('');

        // Initialize hover effects for desktop
        if (window.innerWidth >= 1024) {
            document.querySelectorAll('.project-card').forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.querySelector('.project-image').style.transform = 'scale(1.05)';
                });
                card.addEventListener('mouseleave', () => {
                    card.querySelector('.project-image').style.transform = 'scale(1)';
                });
            });
        }
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
            link.addEventListener('click', function(e) {
                if (this.hasAttribute('data-no-transition')) return;
                
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
            '.reveal-line, .reveal-text, .reveal-image, .reveal-up, .project-card'
        ).forEach(el => observer.observe(el));
    }

    function initCustomCursor() {
        if (!cursorDot || !cursorOutline) return;

        const moveCursor = (e) => {
            const { clientX, clientY } = e;
            cursorDot.style.transform = `translate(${clientX}px, ${clientY}px)`;
            cursorOutline.animate({
                left: `${clientX}px`,
                top: `${clientY}px`
            }, { duration: 800, fill: 'forwards', easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
        };

        window.addEventListener('mousemove', moveCursor);

        const handleCursorState = (state) => {
            cursorDot.classList.toggle('cursor-hidden', !state);
            cursorOutline.classList.toggle('cursor-hidden', !state);
        };

        document.body.addEventListener('mouseleave', () => handleCursorState(false));
        document.body.addEventListener('mouseenter', () => handleCursorState(true));

        const initCursorInteraction = (elements, className) => {
            elements.forEach(el => {
                el.addEventListener('mouseenter', () => cursorOutline.classList.add(className));
                el.addEventListener('mouseleave', () => cursorOutline.classList.remove(className));
            });
        };

        initCursorInteraction(document.querySelectorAll('a, button'), 'hover');
        initCursorInteraction(document.querySelectorAll('p, h1, h2, h3, .project-card'), 'text-hover');
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

        document.querySelectorAll('.menu-link').forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.classList.contains('page-link')) return;
                
                e.preventDefault();
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
                menuSpans.forEach(span => span.style.transform = '');
                
                const targetId = link.getAttribute('href');
                document.querySelector(targetId)?.scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    }

    function initHorizontalScroll() {
        const section = document.querySelector('.horizontal-scroll-section');
        const track = document.querySelector('.horizontal-scroll-track');
        if (!section || !track) return;

        if (window.innerWidth < 1024) {
            // Mobile Premium Implementation
            section.style.height = 'auto';
            track.style.display = 'flex';
            track.style.overflowX = 'auto';
            track.style.scrollSnapType = 'x mandatory';
            track.style.scrollBehavior = 'smooth';
            track.style.padding = '0 5vw';
            track.style.gap = '4vw';
            track.style.transform = 'none';

            document.querySelectorAll('.project-card').forEach(card => {
                card.style.width = '80vw';
                card.style.minWidth = '80vw';
                card.style.height = '70vh';
                card.style.scrollSnapAlign = 'center';
                card.style.margin = '0';
            });

            // Enhanced touch scrolling with momentum
            let startX, scrollLeft, isDown;
            const momentumThreshold = 0.5;
            const momentumMultiplier = 0.3;

            track.addEventListener('touchstart', (e) => {
                isDown = true;
                startX = e.touches[0].pageX;
                scrollLeft = track.scrollLeft;
            }, { passive: true });

            track.addEventListener('touchmove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                
                const x = e.touches[0].pageX;
                const walk = (x - startX) * 1.5;
                track.scrollLeft = scrollLeft - walk;
                
                // Update scroll direction for parallax
                const now = Date.now();
                if (now - lastScrollTime > 16) { // ~60fps
                    const newDirection = Math.sign(track.scrollLeft - scrollLeft);
                    if (newDirection !== scrollDirection) {
                        scrollDirection = newDirection;
                        updateParallaxEffects();
                    }
                    lastScrollTime = now;
                }
            }, { passive: false });

            track.addEventListener('touchend', () => {
                isDown = false;
                
                // Apply momentum
                const velocity = scrollDirection * momentumMultiplier;
                if (Math.abs(velocity) > momentumThreshold) {
                    const targetScroll = track.scrollLeft + (velocity * 100);
                    track.scrollTo({
                        left: targetScroll,
                        behavior: 'smooth'
                    });
                }
            }, { passive: true });

            // Dynamic parallax effect
            function updateParallaxEffects() {
                document.querySelectorAll('.project-image').forEach(img => {
                    const card = img.closest('.project-card');
                    const cardRect = card.getBoundingClientRect();
                    const viewportCenter = window.innerWidth / 2;
                    const cardCenter = cardRect.left + (cardRect.width / 2);
                    const distanceFromCenter = (cardCenter - viewportCenter) / viewportCenter;
                    
                    img.style.transform = `scale(${1 + (0.05 * -distanceFromCenter * scrollDirection)})`;
                });
            }

            // Auto-snap to nearest card
            track.addEventListener('scroll', () => {
                clearTimeout(track.scrollEndTimer);
                track.scrollEndTimer = setTimeout(() => {
                    const cards = Array.from(document.querySelectorAll('.project-card'));
                    const trackCenter = track.scrollLeft + (track.clientWidth / 2);
                    
                    const closestCard = cards.reduce((closest, card) => {
                        const cardCenter = card.offsetLeft + (card.clientWidth / 2);
                        const distance = Math.abs(trackCenter - cardCenter);
                        return distance < closest.distance ? 
                            { card, distance } : closest;
                    }, { card: cards[0], distance: Infinity }).card;
                    
                    track.scrollTo({
                        left: closestCard.offsetLeft - ((track.clientWidth - closestCard.clientWidth) / 2),
                        behavior: 'smooth'
                    });
                }, 100);
            }, { passive: true });

        } else {
            // Desktop Implementation
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
        setInterval(updateTime, 30000); // Update every 30 seconds
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
            document.body.classList.remove('loaded');
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                window.requestAnimationFrame(() => {
                    initHorizontalScroll();
                    document.body.classList.add('loaded');
                });
            }, 250);
        });
    }

    // --- Initialize Everything ---
    populateProjects();
    initPageTransitions();
    initCustomCursor();
    initMobileMenu();
    initHorizontalScroll();
    initClock();
    initMagneticLinks();
    initResizeHandler();
});
// Add this to your initPageTransitions() function
function initPageTransitions() {
    window.addEventListener('load', () => {
        // ... existing load handler code ...
        
        // Add this image loader
        document.querySelectorAll('.project-image').forEach(img => {
            if (img.complete) {
                img.closest('.project-card').classList.add('loaded');
            } else {
                img.addEventListener('load', () => {
                    img.closest('.project-card').classList.add('loaded');
                });
                img.addEventListener('error', () => {
                    console.error('Image failed to load:', img.src);
                });
            }
        });
    });
    // ... rest of your existing code ...
}
// Inside initCustomCursor function
const cursorText = document.getElementById('cursor-text');

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        cursorOutline.classList.add('hover');
        cursorText.textContent = 'View'; // Set text on hover
    });
    card.addEventListener('mouseleave', () => {
        cursorOutline.classList.remove('hover');
        cursorText.textContent = ''; // Clear text
    });
});
