// ===== News Page JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    initNewsFilters();
    initNewsSearch();
    initFeaturedSlider();
    initScrollAnimations();
});

// Category Filter Functionality
function initNewsFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const newsCards = document.querySelectorAll('.news-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const category = this.dataset.category;
            
            // Filter news cards
            newsCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                    // Re-trigger animation
                    card.style.animation = 'none';
                    setTimeout(() => {
                        card.style.animation = 'fadeInUp 0.6s ease forwards';
                    }, 10);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Search Functionality
function initNewsSearch() {
    const searchInput = document.getElementById('newsSearch');
    const newsCards = document.querySelectorAll('.news-card');

    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();

        newsCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const content = card.querySelector('p:not(.news-meta)').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        // If search is empty, respect current filter
        if (searchTerm === '') {
            const activeFilter = document.querySelector('.filter-btn.active');
            if (activeFilter && activeFilter.dataset.category !== 'all') {
                activeFilter.click();
            }
        }
    });
}

// Featured News Slider
function initFeaturedSlider() {
    const slides = document.querySelectorAll('.featured-slide');
    let currentSlide = 0;

    if (slides.length <= 1) return;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Auto advance slides every 5 seconds
    setInterval(nextSlide, 5000);

    // Optional: Add navigation buttons
    createSliderControls();
}

function createSliderControls() {
    const slider = document.querySelector('.featured-slider');
    const slides = document.querySelectorAll('.featured-slide');
    
    if (slides.length <= 1) return;

    // Create control container
    const controls = document.createElement('div');
    controls.className = 'slider-controls';
    controls.style.cssText = `
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 10px;
        z-index: 100;
    `;

    // Create dots for each slide
    slides.forEach((slide, index) => {
        const dot = document.createElement('button');
        dot.className = 'slider-dot';
        dot.style.cssText = `
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid white;
            background: ${index === 0 ? 'white' : 'transparent'};
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        dot.addEventListener('click', () => {
            slides.forEach(s => s.classList.remove('active'));
            slide.classList.add('active');
            
            // Update dot styles
            controls.querySelectorAll('.slider-dot').forEach((d, i) => {
                d.style.background = i === index ? 'white' : 'transparent';
            });
        });
        
        controls.appendChild(dot);
    });

    slider.appendChild(controls);
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all news cards
    document.querySelectorAll('.news-card').forEach(card => {
        observer.observe(card);
    });

    // Observe sidebar sections
    document.querySelectorAll('.sidebar-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateX(-20px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
}

// Pagination functionality
document.querySelectorAll('.page-btn').forEach(button => {
    button.addEventListener('click', function() {
        if (this.disabled) return;
        
        // Remove active class from all buttons
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button (if it's a number)
        if (!this.querySelector('i')) {
            this.classList.add('active');
        }
        
        // Scroll to top of news section
        document.querySelector('.news-section').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Category list click handlers
document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Extract category from classes
        const categories = ['education', 'infrastructure', 'security', 'community'];
        const category = categories.find(cat => this.classList.contains(cat));
        
        if (category) {
            // Find and click the corresponding filter button
            const filterBtn = document.querySelector(`.filter-btn[data-category="${category}"]`);
            if (filterBtn) {
                filterBtn.click();
                
                // Scroll to news grid
                document.querySelector('.news-grid').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Recent items click handler (would normally load full article)
document.querySelectorAll('.recent-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Loading article:', this.querySelector('.recent-title').textContent);
        // In production, this would navigate to the full article page
    });
});

// Read more button handlers
document.querySelectorAll('.read-more, .news-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Loading full article...');
        // In production, this would navigate to the full article page
        
        // Visual feedback
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
});

// Add loading animation for images
document.querySelectorAll('.news-image img').forEach(img => {
    img.addEventListener('load', function() {
        this.style.opacity = '1';
    });
    
    // Set initial opacity
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';
});

// Export functions for potential use elsewhere
window.newsModule = {
    initNewsFilters,
    initNewsSearch,
    initFeaturedSlider,
    initScrollAnimations
};