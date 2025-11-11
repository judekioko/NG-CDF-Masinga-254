// ===== News Page JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    initNewsFilters();
    initNewsSearch();
    initFeaturedSlider();
    initScrollAnimations();
    initFullArticleNavigation();
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
        
        // Update slider dots if they exist
        updateSliderDots(index);
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Auto advance slides every 5 seconds
    setInterval(nextSlide, 5000);

    // Add navigation buttons
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
            updateSliderDots(index);
        });
        
        controls.appendChild(dot);
    });

    slider.appendChild(controls);
}

function updateSliderDots(activeIndex) {
    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach((dot, index) => {
        dot.style.background = index === activeIndex ? 'white' : 'transparent';
    });
}

// Full Article Navigation
function initFullArticleNavigation() {
    // Add click event listeners to all read more links
    document.querySelectorAll('.read-more, .news-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const articleId = this.getAttribute('href');
            if (articleId && articleId.startsWith('#')) {
                showFullArticle(articleId.substring(1));
            }
        });
    });

    // Recent items click handler
    document.querySelectorAll('.recent-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const articleId = this.getAttribute('href');
            if (articleId && articleId.startsWith('#')) {
                showFullArticle(articleId.substring(1));
            }
        });
    });

    // Back to news functionality
    document.querySelectorAll('.back-to-news').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            hideFullArticle();
        });
    });

    // ESC key to close article
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.querySelector('.full-article.active')) {
            hideFullArticle();
        }
    });

    // Check if page was loaded with a hash (direct link to article)
    if (window.location.hash) {
        const articleId = window.location.hash.substring(1);
        showFullArticle(articleId);
    }
}

// Full article display functionality
function showFullArticle(articleId) {
    const article = document.getElementById(articleId);
    if (!article) {
        console.warn('Article not found:', articleId);
        return;
    }

    // Hide all full articles first
    document.querySelectorAll('.full-article').forEach(article => {
        article.style.display = 'none';
        article.classList.remove('active');
    });
    
    // Hide news sections
    document.querySelector('.news-grid').style.display = 'none';
    document.querySelector('.pagination').style.display = 'none';
    document.querySelector('.featured-news').style.display = 'none';
    document.querySelector('.news-controls').style.display = 'none';
    document.querySelector('.news-sidebar').style.display = 'none';
    
    // Show the selected article
    article.style.display = 'block';
    article.classList.add('active');
    
    // Scroll to top of article
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update browser history
    history.pushState({ article: articleId }, '', `#${articleId}`);
}

function hideFullArticle() {
    // Show news sections
    document.querySelector('.news-grid').style.display = 'grid';
    document.querySelector('.pagination').style.display = 'flex';
    document.querySelector('.featured-news').style.display = 'block';
    document.querySelector('.news-controls').style.display = 'flex';
    document.querySelector('.news-sidebar').style.display = 'flex';
    
    // Hide all full articles
    document.querySelectorAll('.full-article').forEach(article => {
        article.style.display = 'none';
        article.classList.remove('active');
    });

    // Clear URL hash
    history.pushState('', document.title, window.location.pathname + window.location.search);
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.article) {
        showFullArticle(event.state.article);
    } else {
        hideFullArticle();
    }
});

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
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all news cards
    document.querySelectorAll('.news-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
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
        
        const categories = ['education', 'infrastructure', 'security', 'community'];
        const category = categories.find(cat => this.classList.contains(cat));
        
        if (category) {
            const filterBtn = document.querySelector(`.filter-btn[data-category="${category}"]`);
            if (filterBtn) {
                filterBtn.click();
                document.querySelector('.news-grid').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Add loading animation for images
document.querySelectorAll('.news-image img, .article-image').forEach(img => {
    img.addEventListener('load', function() {
        this.style.opacity = '1';
    });
    
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';
});

// Image error handling
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        console.warn('Image failed to load:', this.src);
        this.style.opacity = '1';
    });
});