document.addEventListener("DOMContentLoaded", () => {
  const welcomeScreen = document.getElementById("welcome-screen");
  const enterBtn = document.getElementById("enter-site");
  const managerContainer = document.querySelector(".manager-container");

  // Fade out welcome screen
  if (enterBtn) {
    enterBtn.addEventListener("click", () => {
      welcomeScreen.style.transition = "opacity 0.8s ease";
      welcomeScreen.style.opacity = "0";
      // Accessibility: mark dialog hidden and move focus to main nav toggle
      welcomeScreen.setAttribute("aria-hidden", "true");
      setTimeout(() => {
        welcomeScreen.style.display = "none";
        const menuToggle = document.querySelector(".menu-toggle");
        if (menuToggle) {
          menuToggle.focus();
        }
      }, 800);
    });
  }

  // Slide in fund manager message on scroll
  if (managerContainer) {
    const revealManager = () => {
      const rect = managerContainer.getBoundingClientRect().top;
      if (rect < window.innerHeight * 0.8) {
        managerContainer.style.opacity = "1";
        managerContainer.style.transform = "translateX(0)";
        managerContainer.style.transition = "all 1s ease-out";
        window.removeEventListener("scroll", revealManager);
      }
    };
    window.addEventListener("scroll", revealManager);
  }
});
