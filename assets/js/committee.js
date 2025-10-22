document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.committee ul li');

    // Check if element is in viewport
    function isInViewport(el) {
        const rect = el.getBoundingClientRect();
        return rect.top <= window.innerHeight - 100;
    }

    // Reveal cards on scroll
    function revealCards() {
        cards.forEach(card => {
            if(isInViewport(card)) {
                card.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', revealCards);
    revealCards(); // initial check

    // Optional: stagger animation
    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.15}s`;
    });
});
