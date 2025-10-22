document.addEventListener('DOMContentLoaded', () => {
    const section = document.querySelector('.allocations');

    // Fade-in content on scroll
    function isInViewport(el) {
        const rect = el.getBoundingClientRect();
        return rect.top <= window.innerHeight - 100;
    }

    function revealSection() {
        if (isInViewport(section)) {
            section.classList.add('visible');
        }
    }

    window.addEventListener('scroll', revealSection);
    revealSection(); // initial check

    // Counting numbers animation
    const countElements = document.querySelectorAll('.count');
    countElements.forEach(el => {
        const endValue = parseFloat(el.textContent.replace(/,/g,''));
        el.textContent = '0';
        let start = 0;
        const duration = 2000;
        const step = endValue / (duration / 20);

        function countUp() {
            start += step;
            if(start > endValue) start = endValue;
            el.textContent = Math.floor(start).toLocaleString();
            if(start < endValue) requestAnimationFrame(countUp);
        }
        countUp();
    });
});
