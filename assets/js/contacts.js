// ================================
// Contacts Page Interactivity
// ================================

// Add a smooth fade-in effect for sections as user scrolls
document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".contact h2, .contact h3, .contact p, .contact form");

    const revealOnScroll = () => {
        let triggerBottom = window.innerHeight * 0.85;

        sections.forEach(section => {
            let boxTop = section.getBoundingClientRect().top;

            if (boxTop < triggerBottom) {
                section.classList.add("show");
            }
        });
    };

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();
});

// Form feedback animation
const feedbackForm = document.querySelector("form");
if (feedbackForm) {
    feedbackForm.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("✅ Thank you! Your feedback has been submitted.");
        feedbackForm.reset();
    });
}
