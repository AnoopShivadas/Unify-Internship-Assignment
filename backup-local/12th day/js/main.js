document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScheduleTabs();
  initScrollEffects();
  initAnimations();
});

function initNavigation() {
  const header = document.getElementById('header');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  updateActiveNavLink();
  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
}

function updateActiveNavLink() {
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  let currentSection = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.pageYOffset >= sectionTop - 200) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

function initScheduleTabs() {
  const tabs = document.querySelectorAll('.schedule-tab');
  const contents = document.querySelectorAll('.schedule-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetDay = tab.getAttribute('data-day');

      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });

      contents.forEach(content => {
        content.classList.remove('active');
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const targetContent = document.getElementById(`${targetDay}-content`);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });

    tab.addEventListener('keydown', (e) => {
      const tabList = Array.from(tabs);
      const currentIndex = tabList.indexOf(tab);
      let targetTab = null;

      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        targetTab = tabList[currentIndex - 1] || tabList[tabList.length - 1];
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        targetTab = tabList[currentIndex + 1] || tabList[0];
      } else if (e.key === 'Home') {
        e.preventDefault();
        targetTab = tabList[0];
      } else if (e.key === 'End') {
        e.preventDefault();
        targetTab = tabList[tabList.length - 1];
      }

      if (targetTab) {
        targetTab.click();
        targetTab.focus();
      }
    });
  });
}

function initScrollEffects() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  const animateElements = document.querySelectorAll('.card, .schedule-item, .stat-card, .glass-card');

  animateElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
    observer.observe(el);
  });
}

function initAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    document.documentElement.style.setProperty('--transition-fast', '0ms');
    document.documentElement.style.setProperty('--transition-base', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');
    return;
  }

  const scoreFills = document.querySelectorAll('.score-fill');

  const scoreObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.style.width;
        fill.style.width = '0%';

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            fill.style.width = width;
          });
        });

        scoreObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.5 });

  scoreFills.forEach(fill => {
    scoreObserver.observe(fill);
  });
}

window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    if (navMenu && navToggle) {
      navMenu.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }
});
