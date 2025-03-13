// A simple script to add a subtle retro fade-in effect to the hero text
document.addEventListener("DOMContentLoaded", function() {
  const hero = document.querySelector('.hero');
  hero.style.opacity = 0;
  setTimeout(function() {
    hero.style.transition = "opacity 0.5s ease-in";
    hero.style.opacity = 1;
  }, 100);
});
