document.addEventListener("DOMContentLoaded", function() {
  // Subtle fade-in for the hero section
  const hero = document.querySelector('.hero');
  hero.style.opacity = 0;
  setTimeout(function() {
    hero.style.transition = "opacity 0.5s ease-in";
    hero.style.opacity = 1;
  }, 100);

  // Dark Mode Toggle
  const darkModeToggle = document.getElementById('darkModeToggle');
  darkModeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
  });

  // Back to Top Button functionality
  const backToTop = document.getElementById('backToTop');
  backToTop.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});
