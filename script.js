document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('typewriter');
  const text = "SPARKER";
  let i = 0;

  function type() {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(type, 300);
    }
  }

  type();
});
