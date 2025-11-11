// ===== Tenders Page JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    initTenderTabs();
    initCountdowns();
    initDownloadButtons();
    initArchiveSearch();
});

// Tender Tabs Functionality
function initTenderTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tender-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Show corresponding content
            const tabName = this.dataset.tab;
            const targetContent = document.querySelector(`[data-content="${tabName}"]`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Countdown Timer for Urgent Tenders
function initCountdowns() {
    const urgentTenders = document.querySelectorAll('.tender-card.urgent');

    urgentTenders.forEach(tender => {
        const deadlineText = tender.querySelector('.detail-item:last-child span').textContent;
        // Extract deadline date (format: "Deadline: Nov 16, 2025 at 10:00 AM")
        const deadlineMatch = deadlineText.match(/(\w+ \d+, \d+)/);
        
        if (deadlineMatch) {
            const deadlineDate = new Date(deadlineMatch[1] + ' 10:00:00');
            updateCountdown(tender, deadlineDate);
            
            // Update countdown every hour
            setInterval(() => updateCountdown(tender, deadlineDate), 3600000);
        }
    });
}

function updateCountdown(tenderElement, deadline) {
    const now = new Date();
    const timeLeft = deadline - now;
    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    
    const urgencyBadge = tenderElement.querySelector('.urgency-badge');
    if (urgencyBadge && daysLeft >= 0) {
        if (daysLeft === 0) {
            urgencyBadge.textContent = 'CLOSES TODAY';
            urgencyBadge.style.animation = 'blink 0.5s infinite';
        } else if (daysLeft === 1) {
            urgencyBadge.textContent = 'CLOSES TOMORROW';
        } else {
            urgencyBadge.textContent = `CLOSES IN ${daysLeft} DAYS`;
        }
    }
}

// Download Buttons
function initDownloadButtons() {
    const downloadButtons = document.querySelectorAll('.btn-primary');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get tender card
            const tenderCard = this.closest('.tender-card');
            const tenderTitle = tenderCard.querySelector('h3').textContent.trim();
            
            // Visual feedback
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing...';
            this.disabled = true;
            
            // Simulate download preparation
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-check"></i> Downloaded';
                this.style.background = '#4CAF50';
                
                console.log('Downloading tender documents for:', tenderTitle);
                // In production, this would trigger actual document download
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.disabled = false;
                    this.style.background = '';
                }, 2000);
            }, 1500);
        });
    });
}

// Details Buttons
document.querySelectorAll('.btn-secondary').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        const tenderCard = this.closest('.tender-card, .awarded-card');
        const tenderTitle = tenderCard.querySelector('h3').textContent.trim();
        
        console.log('Opening details for:', tenderTitle);
        // In production, this would open a modal or navigate to detail page
        
        // Visual feedback
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
});

// Archive Search
function initArchiveSearch() {
    const searchButton = document.querySelector('.archive-search button');
    const searchInput = document.querySelector('.archive-search input');
    
    if (!searchButton || !searchInput) return;
    
    searchButton.addEventListener('click', function() {
        performArchiveSearch(searchInput.value);
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performArchiveSearch(this.value);
        }
    });
}

function performArchiveSearch(query) {
    console.log('Searching archive for:', query);
    
    // Visual feedback
    const searchButton = document.querySelector('.archive-search button');
    const originalIcon = searchButton.innerHTML;
    searchButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    // Simulate search
    setTimeout(() => {
        searchButton.innerHTML = originalIcon;
        
        // In production, this would fetch and display results
        const infoElement = document.querySelector('.archive-info');
        if (query.trim()) {
            infoElement.textContent = `Searching for "${query}"... Results would appear here.`;
            infoElement.style.background = '#e3f2fd';
            infoElement.style.color = '#1976D2';
        } else {
            infoElement.textContent = 'View all past tenders and their outcomes for transparency and reference.';
            infoElement.style.background = '#f8f9fa';
            infoElement.style.color = '#666';
        }
    }, 1000);
}

// Archive Filters
document.querySelectorAll('.archive-filters select').forEach(select => {
    select.addEventListener('change', function() {
        console.log('Filter changed:', this.value);
        // In production, this would filter the archive results
    });
});

// Animate stat cards on scroll
const statCards = document.querySelectorAll('.stat-card');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'scale(1)';
            animateStatNumber(entry.target);
        }
    });
}, { threshold: 0.5 });

statCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'scale(0.9)';
    observer.observe(card);
});

// Animate stat numbers
function animateStatNumber(card) {
    const numberElement = card.querySelector('h3');
    const targetNumber = parseInt(numberElement.textContent);
    const duration = 1000;
    const steps = 30;
    const increment = targetNumber / steps;
    let current = 0;
    let step = 0;
    
    const timer = setInterval(() => {
        step++;
        current = Math.min(current + increment, targetNumber);
        numberElement.textContent = Math.floor(current);
        
        if (step >= steps) {
            clearInterval(timer);
            numberElement.textContent = targetNumber;
        }
    }, duration / steps);
}

// Add click animations to guideline cards
document.querySelectorAll('.guideline-card').forEach(card => {
    card.addEventListener('click', function() {
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
});

// Export functions for potential use elsewhere
window.tendersModule = {
    initTenderTabs,
    initCountdowns,
    performArchiveSearch
};