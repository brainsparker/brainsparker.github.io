document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('typewriter');
  const phrases = ["Sparker.co", "Ideas into Action", "Build and Share"];
  let partIndex = 0, charIndex = 0, deleting = false;

  function loop() {
    const text = phrases[partIndex];
    el.textContent = deleting
      ? text.substring(0, charIndex--)
      : text.substring(0, charIndex++);
    if (!deleting && charIndex === text.length + 1) {
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
