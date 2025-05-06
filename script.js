document.addEventListener('DOMContentLoaded', () => {
  // Retro fade-in on hero
  const hero = document.querySelector('.hero');
  hero.style.opacity = 0;
  setTimeout(() => {
    hero.style.transition = 'opacity 0.5s ease-in';
    hero.style.opacity = 1;
  }, 100);

  // Typewriter
  const el = document.getElementById('typewriter');
  const phrases = [
    "Welcome to Sparker.co",
    "Ideas into Action",
    "Build. Share. Grow."
  ];
  let partIndex = 0,
      charIndex = 0,
      deleting = false;

  function loop() {
    const fullText = phrases[partIndex];
    el.textContent = deleting
      ? fullText.substring(0, charIndex--)
      : fullText.substring(0, charIndex++);

    if (!deleting && charIndex === fullText.length + 1) {
      deleting = true;
      setTimeout(loop, 1000);
    } else if (deleting && charIndex === 0) {
      deleting = false;
      partIndex = (partIndex + 1) % phrases.length;
    }

    setTimeout(loop, deleting ? 75 : 150);
  }

  loop();
});
