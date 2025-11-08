// Wait for Three.js to load
window.addEventListener('load', () => {
  initThreeScene();
  initScrollEffects();
  initFlipCards();
  initTooltips();
});

function initThreeScene() {
  // Empty function - 3D scene removed
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
  document.querySelectorAll('#work, #bio, #links').forEach(section => {
    observer.observe(section);
  });
}

function initFlipCards() {
  const workCards = document.querySelectorAll('.work-card');
  const modal = document.getElementById('work-modal');
  const modalBody = document.getElementById('modal-body');
  const closeBtn = document.querySelector('.modal-close');
  const prevBtn = document.querySelector('.modal-nav-prev');
  const nextBtn = document.querySelector('.modal-nav-next');

  // Work order array
  const workOrder = ['chat', 'pricing', 'onboarding'];
  let currentWorkIndex = 0;

  // Work content data
  const workContent = {
    pricing: {
      title: 'Ecommerce Search Platform',
      content: `
        <img src="images/crateandbarrel-screenshot.png" alt="Crate & Barrel Search Interface" class="work-image" />
        <h4>What it was</h4>
        <p>Crate & Barrel's search experience was inconsistent across web, mobile, and in-store systems. Product data and inventory states varied between properties, leading to mismatches and lost revenue opportunities.</p>
        <h4>What I learned</h4>
        <p>Search quality isn't just about ranking models — it depends on trustworthy data. Buyers make decisions faster and with more confidence when the product information is accurate, current, and consistent across every touchpoint.</p>
        <h4>What I did</h4>
        <p>I led the rebuild of the enterprise search platform using Apache Solr and Lucidworks Fusion. I established a single source of truth for SKU and inventory data, redesigned ingestion workflows, and introduced merchandising controls accessible across all brands.</p>
        <h4>What changed</h4>
        <p>Search, inventory, and product data became aligned across channels, enabling consistent experiences and reducing manual operational overhead.</p>
        <div class="outcome"><strong>Outcome:</strong> Delivered 7-figure ROI in the first 30 days post-launch. Improved discovery reliability and kept inventory fulfillment accurate across digital and in-store systems.</div>
      `
    },
    onboarding: {
      title: 'Search & Discovery Marketplace',
      content: `
        <img src="images/g2-screenshot.png" alt="G2 Marketplace Search Interface" class="work-image" />
        <h4>What it was</h4>
        <p>Software buyers visiting G2 needed a clearer way to understand, compare, and evaluate products. Search results surfaced options, but it was still difficult to navigate categories and decide confidently.</p>
        <h4>What I learned</h4>
        <p>When the decision space is complex, guidance matters as much as choice. Buyers convert when the path to understanding is structured, trustworthy, and adaptive to their intent.</p>
        <h4>What I did</h4>
        <p>I owned the search and discovery roadmap for the marketplace's buyer experience. I improved ranking and relevance logic, introduced personalization and recommendation patterns, and designed a generative "Did you mean?" flow powered by LLM inference to reduce dead ends. I also built workflows that improved review quality and trust.</p>
        <h4>What changed</h4>
        <p>Users could evaluate software with more confidence, navigate categories more efficiently, and understand comparisons more clearly.</p>
        <div class="outcome"><strong>Outcome:</strong> Increased the core buyer engagement metric 145% year-over-year, strengthening marketplace credibility and buyer decision velocity.</div>
      `
    },
    chat: {
      title: 'AI Search Engine',
      content: `
        <img src="images/youcom-screenshot.png" alt="You.com AI Search Interface" class="work-image" />
        <h4>What it was</h4>
        <p>You.com started as a standard search engine with a layer of experimental mini-apps, including some early generative AI tools for code, writing, and images. Users liked the power, but the experience was still based on traditional search behaviors.</p>
        <h4>What I learned</h4>
        <p>Through user research and rapid testing, we found that people didn't want AI added to search. They wanted to talk to the system and refine their intent naturally. They wanted answers that felt direct, helpful, and grounded in real sources.</p>
        <h4>What I did</h4>
        <p>I led the product direction and UX shift from search results to a conversational interface. I redesigned the input patterns, the response layer, and how context carried across turns. I also worked with engineering to ground responses using retrieval-augmented generation, so every answer pulled citations from our web index.</p>
        <h4>What changed</h4>
        <p>The product went from typing a query into a box to having a guided conversation that adapts, cites sources, and remembers context.</p>
        <div class="outcome"><strong>Outcome:</strong> Grew from ~1M to ~10M monthly active users as we introduced the chat experience. Established the core interaction pattern for the product moving forward.</div>
      `
    }
  };

  // Function to show work content by ID
  function showWorkContent(workId) {
    const content = workContent[workId];
    if (content) {
      modalBody.innerHTML = `<h3>${content.title}</h3>${content.content}`;
      currentWorkIndex = workOrder.indexOf(workId);

      // Scroll to top of modal content
      if (modalBody.parentElement) {
        modalBody.parentElement.scrollTop = 0;
      }

      // Track in Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'open_work_modal', {
          'event_category': 'Work',
          'event_label': content.title
        });
      }
    }
  }

  // Navigate to previous work
  function navigatePrev() {
    currentWorkIndex = (currentWorkIndex - 1 + workOrder.length) % workOrder.length;
    showWorkContent(workOrder[currentWorkIndex]);
  }

  // Navigate to next work
  function navigateNext() {
    currentWorkIndex = (currentWorkIndex + 1) % workOrder.length;
    showWorkContent(workOrder[currentWorkIndex]);
  }

  // Open modal when clicking a card
  workCards.forEach(card => {
    card.addEventListener('click', function() {
      const workId = this.getAttribute('data-work-id');
      showWorkContent(workId);
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    // Add keyboard accessibility
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'Click to view details');

    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Navigation button handlers
  if (prevBtn) {
    prevBtn.addEventListener('click', navigatePrev);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', navigateNext);
  }

  // Close modal
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);

  // Close modal when clicking outside content
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Keyboard navigation for modal
  document.addEventListener('keydown', function(e) {
    if (!modal.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      navigatePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      navigateNext();
    }
  });
}

function initTooltips() {
  const tooltipWords = document.querySelectorAll('.tooltip-word');
  const tooltipModal = document.getElementById('tooltip-modal');
  const tooltipModalTitle = document.getElementById('tooltip-modal-title');
  const tooltipModalBody = document.getElementById('tooltip-modal-body');
  const tooltipModalClose = document.querySelector('.tooltip-modal-close');
  const tooltipModalOverlay = document.querySelector('.tooltip-modal-overlay');

  // Detect if mobile (screen width or touch capability)
  const isMobile = () => window.innerWidth <= 768 || 'ontouchstart' in window;

  tooltipWords.forEach(word => {
    word.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      const tooltipText = this.getAttribute('data-tooltip');
      const wordText = this.textContent;

      if (isMobile()) {
        // Open modal on mobile
        tooltipModalTitle.textContent = wordText;
        tooltipModalBody.textContent = tooltipText;
        tooltipModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Track in Google Analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', 'open_tooltip', {
            'event_category': 'Tooltip',
            'event_label': wordText
          });
        }
      } else {
        // Desktop: toggle active class for CSS tooltip
        const wasActive = this.classList.contains('tooltip-active');
        tooltipWords.forEach(w => w.classList.remove('tooltip-active'));
        if (!wasActive) {
          this.classList.add('tooltip-active');
        }
      }
    });

    // Keep hover for desktop
    if (!isMobile()) {
      word.addEventListener('mouseenter', function() {
        this.classList.add('tooltip-active');
      });

      word.addEventListener('mouseleave', function() {
        this.classList.remove('tooltip-active');
      });
    }
  });

  // Close modal function
  function closeTooltipModal() {
    tooltipModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Close modal on button click
  if (tooltipModalClose) {
    tooltipModalClose.addEventListener('click', closeTooltipModal);
  }

  // Close modal on overlay click
  if (tooltipModalOverlay) {
    tooltipModalOverlay.addEventListener('click', closeTooltipModal);
  }

  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && tooltipModal.classList.contains('active')) {
      closeTooltipModal();
    }
  });

  // Close tooltips when clicking outside (desktop only)
  document.addEventListener('click', function(e) {
    if (!isMobile() && !e.target.classList.contains('tooltip-word')) {
      tooltipWords.forEach(w => w.classList.remove('tooltip-active'));
    }
  });
}
