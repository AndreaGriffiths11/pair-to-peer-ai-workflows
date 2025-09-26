// Slides Module
class SlidesPresentation {
    constructor() {
        this.currentSlideIndex = 0;
        this.slides = document.querySelectorAll('.slide');
        this.totalSlides = this.slides.length;
        this.speakerNotes = [
            "Welcome and introduce yourself. Set the stage for the problem.",
            "Hook the audience with the contradiction - same tools, different outcomes.",
            "Establish the core challenge - digital teammates without management training.",
            "Set clear expectations for what they'll learn today.",
            "Connect to familiar concept of pair programming to make AI collaboration relatable.",
            "Show the evolution from simple assistance to agent orchestration.",
            "Ground the discussion in real market data and research.",
            "Transition to the core content - the three patterns.",
            "Pattern 1: Emphasize that speed without standards leads to chaos.",
            "Pattern 2: Focus on sustainable velocity vs. unsustainable speed.",
            "Pattern 3: Knowledge sharing prevents over-dependence on AI experts.",
            "Acknowledge that even with good patterns, AI work is still complex.",
            "Give concrete, actionable steps they can implement immediately.",
            "Show the tools in action - this makes everything tangible.",
            "Connect back to the bigger picture and vision.",
            "Thank the audience and open for questions."
        ];

        this.init();
    }

    init() {
        this.updateTotalSlides();
        this.initializeEventListeners();
        this.showSlide(0);
    }

    updateTotalSlides() {
        const totalSlidesElement = document.getElementById('totalSlides');
        if (totalSlidesElement) {
            totalSlidesElement.textContent = this.totalSlides;
        }
    }

    initializeEventListeners() {
        // Navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousSlide());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // View buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            if (btn.tagName === 'BUTTON') {
                btn.addEventListener('click', () => this.setActiveView(btn));
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                this.nextSlide();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.previousSlide();
            } else if (e.key === 'Home') {
                e.preventDefault();
                this.goToSlide(0);
            } else if (e.key === 'End') {
                e.preventDefault();
                this.goToSlide(this.totalSlides - 1);
            }
        });

        // Clear data functionality
        const clearDataBtn = document.querySelector('[data-action="clearData"]');
        if (clearDataBtn) {
            clearDataBtn.addEventListener('click', () => this.clearAllData());
        }
    }

    showSlide(index) {
        // Hide all slides
        this.slides.forEach(slide => {
            slide.classList.remove('active');
            slide.setAttribute('aria-hidden', 'true');
        });

        // Show current slide
        if (this.slides[index]) {
            this.slides[index].classList.add('active');
            this.slides[index].setAttribute('aria-hidden', 'false');
        }

        // Update UI
        this.updateSlideCounter(index);
        this.updateNavigationButtons(index);
        this.updateSpeakerNotes(index);

        // Announce slide change to screen readers
        const announcement = document.getElementById('slide-announcement');
        if (announcement) {
            announcement.textContent = `Slide ${index + 1} of ${this.totalSlides}`;
        }
    }

    updateSlideCounter(index) {
        const currentSlideElement = document.getElementById('currentSlide');
        if (currentSlideElement) {
            currentSlideElement.textContent = index + 1;
        }
    }

    updateNavigationButtons(index) {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (prevBtn) {
            prevBtn.disabled = index === 0;
        }

        if (nextBtn) {
            nextBtn.disabled = index === this.totalSlides - 1;
        }
    }

    updateSpeakerNotes(index) {
        const notesContent = document.getElementById('notesContent');
        if (notesContent) {
            notesContent.textContent = this.speakerNotes[index] || "No notes for this slide.";
        }
    }

    nextSlide() {
        if (this.currentSlideIndex < this.totalSlides - 1) {
            this.currentSlideIndex++;
            this.showSlide(this.currentSlideIndex);
        }
    }

    previousSlide() {
        if (this.currentSlideIndex > 0) {
            this.currentSlideIndex--;
            this.showSlide(this.currentSlideIndex);
        }
    }

    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.currentSlideIndex = index;
            this.showSlide(this.currentSlideIndex);
        }
    }

    setActiveView(button) {
        // Remove active class from all view buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            if (btn.tagName === 'BUTTON') {
                btn.classList.remove('active');
            }
        });
        // Add active class to clicked button
        button.classList.add('active');
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all stored data? This will remove any saved progress and cannot be undone.')) {
            try {
                localStorage.clear();
                sessionStorage.clear();
                alert('All data has been cleared successfully.');
            } catch (error) {
                alert('Error clearing data: ' + error.message);
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new SlidesPresentation();
});

export default SlidesPresentation;