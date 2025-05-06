document.addEventListener('DOMContentLoaded', () => {
  // Typewriter effect
  const el = document.getElementById('typewriter');
  const phrases = ["Sparkle with JS", "Add Some Shine", "Click the Button!"];
  let partIndex = 0, charIndex = 0, deleting = false;

  function typeLoop() {
    const text = phrases[partIndex];
    el.textContent = deleting
      ? text.substring(0, charIndex--)
      : text.substring(0, charIndex++);
    if (!deleting && charIndex === text.length + 1) {
      deleting = true;
      setTimeout(typeLoop, 1000);
    } else if (deleting && charIndex === 0) {
      deleting = false;
      partIndex = (partIndex + 1) % phrases.length;
    }
    setTimeout(typeLoop, deleting ? 75 : 150);
  }
  typeLoop();

  // Sparkle effect on button click
  const btn = document.getElementById('sparkle-btn');
  btn.addEventListener('click', (e) => {
    const count = 20;
    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement('span');
      sparkle.classList.add('sparkle');
      document.body.appendChild(sparkle);
      const size = Math.random() * 6 + 4;
      sparkle.style.width = sparkle.style.height = `${size}px`;
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * 50 + 50;
      const xMove = Math.cos(angle) * distance;
      const yMove = Math.sin(angle) * distance;
      sparkle.style.left = `${e.clientX - size/2}px`;
      sparkle.style.top = `${e.clientY - size/2}px`;
      requestAnimationFrame(() => {
        sparkle.style.transform = `translate(${xMove}px, ${yMove}px)`;
      });
      sparkle.addEventListener('animationend', () => sparkle.remove());
    }
  });
});
