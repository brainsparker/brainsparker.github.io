// Wait for Three.js to load
window.addEventListener('load', () => {
  initThreeScene();
  initScrollEffects();
});

function initThreeScene() {
  const canvas = document.getElementById('bg-canvas');
  const scene = new THREE.Scene();

  // Camera setup
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 30;

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create Ouroboros (torus with snake-like appearance)
  const ouroborosGroup = new THREE.Group();

  // Main body - torus
  const torusGeometry = new THREE.TorusGeometry(12, 0.8, 16, 100);
  const torusMaterial = new THREE.MeshPhongMaterial({
    color: 0x4a5568,
    emissive: 0x1a1a2e,
    emissiveIntensity: 0.3,
    shininess: 100,
    wireframe: false
  });
  const torus = new THREE.Mesh(torusGeometry, torusMaterial);
  ouroborosGroup.add(torus);

  // Wireframe overlay for depth
  const wireframeGeometry = new THREE.TorusGeometry(12, 0.85, 16, 100);
  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x8899aa,
    wireframe: true,
    transparent: true,
    opacity: 0.3
  });
  const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
  ouroborosGroup.add(wireframe);

  // Add particles around the Ouroboros
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 800;
  const posArray = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 10 + Math.random() * 8;
    const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 20;
    const y = (Math.random() - 0.5) * 40;
    const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 20;

    posArray[i] = i % 3 === 0 ? x : i % 3 === 1 ? y : z;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.15,
    color: 0x6699cc,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 2);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x6699cc, 2, 100);
  pointLight1.position.set(20, 20, 20);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x8899aa, 1.5, 100);
  pointLight2.position.set(-20, -20, 20);
  scene.add(pointLight2);

  // Position and rotate the Ouroboros
  ouroborosGroup.rotation.x = Math.PI / 4;
  ouroborosGroup.position.y = 2;
  scene.add(ouroborosGroup);

  // Mouse tracking
  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  // Scroll tracking
  let scrollY = 0;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  // Animation loop
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.005;

    // Rotate Ouroboros
    ouroborosGroup.rotation.z += 0.002;
    ouroborosGroup.rotation.y += 0.003;

    // Mouse interaction
    ouroborosGroup.rotation.x = Math.PI / 4 + mouseY * 0.3;
    ouroborosGroup.rotation.z += mouseX * 0.001;

    // Scroll effect - move scene down
    camera.position.y = scrollY * 0.01;
    ouroborosGroup.position.y = 2 - scrollY * 0.005;

    // Animate particles
    particlesMesh.rotation.y = time * 0.2;
    const positions = particlesMesh.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += Math.sin(time + positions[i]) * 0.01;
    }
    particlesMesh.geometry.attributes.position.needsUpdate = true;

    // Fade out canvas as you scroll
    const heroHeight = window.innerHeight;
    const fadeStart = heroHeight * 0.5;
    const fadeEnd = heroHeight * 1.2;
    if (scrollY > fadeStart) {
      const fadeProgress = Math.min((scrollY - fadeStart) / (fadeEnd - fadeStart), 1);
      canvas.style.opacity = 1 - fadeProgress * 0.7;
    } else {
      canvas.style.opacity = 1;
    }

    renderer.render(scene, camera);
  }

  animate();

  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function initScrollEffects() {
  // Smooth scroll for scroll indicator
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    });
  }

  // Parallax effect on hero title
  const heroTitle = document.querySelector('.mega-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroHeight = window.innerHeight;

    if (scrollY < heroHeight) {
      const parallaxAmount = scrollY * 0.5;
      if (heroTitle) {
        heroTitle.style.transform = `translateY(${parallaxAmount}px)`;
        heroTitle.style.opacity = 1 - (scrollY / heroHeight) * 1.5;
      }
      if (heroSubtitle) {
        heroSubtitle.style.transform = `translateY(${parallaxAmount * 0.8}px)`;
        heroSubtitle.style.opacity = 1 - (scrollY / heroHeight) * 1.5;
      }
    }
  });

  // Intersection Observer for story sections
  const storyObserverOptions = {
    threshold: 0.3,
    rootMargin: '0px'
  };

  const storyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, storyObserverOptions);

  // Observe story content
  document.querySelectorAll('.story-content').forEach(content => {
    storyObserver.observe(content);
  });

  // Intersection Observer for bio and links
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe sections
  document.querySelectorAll('#bio, #links').forEach(section => {
    observer.observe(section);
  });
}
