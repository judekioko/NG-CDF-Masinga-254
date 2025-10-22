// === About Page Specific JavaScript ===
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAboutAnimations();
    initScrollAnimations();
    initInteractiveElements();
});

function initAboutAnimations() {
    // Add floating animation to main title icon
    const mainIcon = document.querySelector('.about h2 i');
    if (mainIcon) {
        mainIcon.classList.add('floating');
    }
    
    // Add highlight class to all headings
    const headings = document.querySelectorAll('.charter h3');
    headings.forEach(heading => {
        heading.classList.add('highlight');
    });
    
    // Stagger animation for core values
    const coreValuesItems = document.querySelectorAll('.charter ul li');
    coreValuesItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        
        // Add scroll animation class
        item.classList.add('scroll-animate');
    });
    
    // Add Kenyan shield decoration to vision and mission
    const visionHeader = document.querySelector('.charter h3:nth-of-type(1)');
    const missionHeader = document.querySelector('.charter h3:nth-of-type(2)');
    
    if (visionHeader) {
        const shield = document.createElement('span');
        shield.className = 'kenyan-shield';
        shield.innerHTML = '🛡️';
        visionHeader.appendChild(shield.cloneNode(true));
    }
    
    if (missionHeader) {
        const shield = document.createElement('span');
        shield.className = 'kenyan-shield';
        shield.innerHTML = '🛡️';
        missionHeader.appendChild(shield.cloneNode(true));
    }
}

function initScrollAnimations() {
    // Create Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Add specific animations based on element type
                if (entry.target.tagName === 'H3') {
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all elements with scroll-animate class
    const animateElements = document.querySelectorAll('.scroll-animate');
    animateElements.forEach(el => observer.observe(el));
    
    // Observe charter sections
    const charterSections = document.querySelectorAll('.charter h3, .charter p, .charter ul');
    charterSections.forEach(section => {
        section.classList.add('scroll-animate');
        observer.observe(section);
    });
}

function initInteractiveElements() {
    // Add click handlers for list items
    const listItems = document.querySelectorAll('.charter ul li');
    listItems.forEach(item => {
        item.addEventListener('click', function() {
            // Toggle active state
            this.classList.toggle('active');
            
            // Add temporary highlight effect
            this.style.backgroundColor = '#e8f5e8';
            setTimeout(() => {
                if (!this.classList.contains('active')) {
                    this.style.backgroundColor = '';
                }
            }, 2000);
        });
    });
    
    // Add progress bar animation for service commitments
    const serviceSection = document.querySelector('.charter h3:nth-of-type(4)'); // Service Commitment
    if (serviceSection) {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        progressContainer.innerHTML = '<div class="progress-bar"></div>';
        
        // Insert after the service commitment heading
        serviceSection.parentNode.insertBefore(progressContainer, serviceSection.nextSibling);
        
        // Restart progress animation when section comes into view
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target.querySelector('.progress-bar');
                    progressBar.style.animation = 'none';
                    setTimeout(() => {
                        progressBar.style.animation = 'progressAnimation 2s ease-in-out';
                    }, 100);
                }
            });
        });
        
        progressObserver.observe(progressContainer);
    }
    
    // Kenyan flag color cycle animation for main title
    const mainTitle = document.querySelector('.about h2');
    if (mainTitle) {
        let colorIndex = 0;
        const colors = ['#000000', '#ff0000', '#006400'];
        
        setInterval(() => {
            mainTitle.style.color = colors[colorIndex];
            colorIndex = (colorIndex + 1) % colors.length;
        }, 2000);
    }
}

// Additional utility functions
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Export functions for global use (if needed)
window.aboutModule = {
    initAboutAnimations,
    initScrollAnimations,
    initInteractiveElements,
    animateValue
};

// Initialize when page loads
window.addEventListener('load', function() {
    // Add loaded class for any post-load animations
    document.body.classList.add('about-page-loaded');
    
    // Trigger a custom event for any other scripts that might need it
    window.dispatchEvent(new CustomEvent('aboutPageReady'));
});