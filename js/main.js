document.addEventListener('DOMContentLoaded', () => {
  // --- Active Nav Link Highlighting ---
  const currentPath = window.location.pathname;

  // Plain links
  document.querySelectorAll('nav.links > a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    if ((currentPath.endsWith('/') || currentPath.endsWith('index.html')) && href === 'index.html') {
      link.classList.add('active');
    } else if (href !== 'index.html' && currentPath.includes(href.replace('.html', ''))) {
      link.classList.add('active');
    }
  });

  // Dropdown parent highlighting — mark parent active if any child matches
  document.querySelectorAll('.nav-item').forEach(item => {
    const parentLink = item.querySelector(':scope > .nav-link');
    const childLinks = item.querySelectorAll('.dropdown a');
    let anyChildActive = false;
    childLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      if (href !== 'index.html' && currentPath.includes(href.replace('.html', ''))) {
        link.classList.add('active');
        anyChildActive = true;
      }
    });
    if (anyChildActive && parentLink) {
      parentLink.classList.add('active');
    }
  });

  // --- Scroll Reveal Animations ---
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length > 0) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  }

  // --- Back to Top Button ---
  const backTop = document.getElementById('backTop');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('show', window.scrollY > 600);
    });
  }

  // --- Mobile Navigation Menu Toggle ---
  const toggle = document.querySelector('.menu-toggle');
  const linksNav = document.querySelector('nav.links');
  if (toggle && linksNav) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      linksNav.classList.toggle('mobile-open');
    });
  }

  // --- Dropdown Toggle (click on BOTH desktop and mobile) ---
  document.querySelectorAll('.nav-item > .nav-link').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = btn.closest('.nav-item');
      const wasOpen = parent.classList.contains('open');
      // Close all other open dropdowns first
      document.querySelectorAll('.nav-item.open').forEach(el => el.classList.remove('open'));
      // Toggle this one
      if (!wasOpen) {
        parent.classList.add('open');
      }
    });
  });

  // Close dropdowns when clicking anywhere outside nav
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item') && !e.target.closest('.menu-toggle')) {
      document.querySelectorAll('.nav-item.open').forEach(el => el.classList.remove('open'));
      // Also close mobile menu when clicking outside
      if (linksNav) linksNav.classList.remove('mobile-open');
    }
  });

  // --- Services Tab Switching ---
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const targetPaneId = 'pane-' + btn.dataset.tab;
      document.querySelectorAll('.pane').forEach(p => p.classList.remove('active'));
      const targetPane = document.getElementById(targetPaneId);
      if (targetPane) targetPane.classList.add('active');
    });
  });
});
