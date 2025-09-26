// Navigation Module
class Navigation {
    constructor() {
        this.init();
    }

    init() {
        this.initMobileMenu();
        this.initScrollProgress();
        this.initBackToTop();
    }

    initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');

        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu(menuToggle, mobileMenu);
            });

            // Close menu when clicking outside
            document.addEventListener('click', (event) => {
                if (!event.target.closest('.mobile-nav') && mobileMenu.classList.contains('active')) {
                    this.closeMobileMenu(menuToggle, mobileMenu);
                }
            });

            // Close menu when pressing Escape
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && mobileMenu.classList.contains('active')) {
                    this.closeMobileMenu(menuToggle, mobileMenu);
                    menuToggle.focus();
                }
            });

            // Handle focus trap in mobile menu
            this.setupFocusTrap(mobileMenu);
        }
    }

    toggleMobileMenu(menuToggle, mobileMenu) {
        const isOpen = mobileMenu.classList.contains('active');

        if (isOpen) {
            this.closeMobileMenu(menuToggle, mobileMenu);
        } else {
            this.openMobileMenu(menuToggle, mobileMenu);
        }
    }

    openMobileMenu(menuToggle, mobileMenu) {
        mobileMenu.classList.add('active');
        menuToggle.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');

        // Focus first menu item
        const firstMenuItem = mobileMenu.querySelector('a');
        if (firstMenuItem) {
            setTimeout(() => firstMenuItem.focus(), 100);
        }
    }

    closeMobileMenu(menuToggle, mobileMenu) {
        mobileMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    }

    setupFocusTrap(mobileMenu) {
        const focusableElements = mobileMenu.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        mobileMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    // Tab
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });
    }

    initScrollProgress() {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);

            const progressIndicator = document.getElementById('mobileProgressIndicator');
            if (progressIndicator) {
                progressIndicator.style.width = scrollPercent + '%';
            }

            // Show/hide back to top button
            const backToTopButton = document.getElementById('backToTop');
            if (backToTopButton) {
                if (scrollTop > 300) {
                    backToTopButton.classList.add('visible');
                } else {
                    backToTopButton.classList.remove('visible');
                }
            }
        };

        // Throttle scroll events for performance
        let ticking = false;
        const throttledUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateProgress();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', throttledUpdate);
        // Initialize progress on load
        updateProgress();
    }

    initBackToTop() {
        const backToTopButton = document.getElementById('backToTop');
        if (backToTopButton) {
            backToTopButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToTop();
            });

            // Add keyboard support
            backToTopButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.scrollToTop();
                }
            });
        }
    }

    scrollToTop() {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        window.scrollTo({
            top: 0,
            behavior: reduceMotion ? 'auto' : 'smooth'
        });

        // Focus the main heading after scroll
        setTimeout(() => {
            const mainHeading = document.querySelector('h1');
            if (mainHeading) {
                mainHeading.focus();
            }
        }, reduceMotion ? 0 : 500);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new Navigation();
});

export default Navigation;