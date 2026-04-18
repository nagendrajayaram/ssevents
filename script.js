/* ═══════════════════════════════════════════════════════════
   SRI SAI EVENTS — script.js
═══════════════════════════════════════════════════════════ */

/* ── SMOOTH SCROLL ──────────────────────────────────────── */
function scrollTo(sectionId) {
  const el = document.getElementById(sectionId);
  if (!el) return;
  const offset = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top: offset, behavior: 'smooth' });
}

/* ── NAVBAR: scroll state ───────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── MOBILE MENU ────────────────────────────────────────── */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
  });
})();

function closeMobile() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger) hamburger.classList.remove('open');
  if (mobileMenu) mobileMenu.classList.remove('open');
}

/* ── INTERSECTION OBSERVER: fade-in animations ──────────── */
(function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );
  elements.forEach((el) => observer.observe(el));
})();

/* ── ACTIVE NAV LINK on scroll ──────────────────────────── */
(function initActiveNavLink() {
  const sections = ['home', 'about', 'services', 'gallery', 'contact'];
  const navLinks = document.querySelectorAll('.nav-link');

  function setActive(id) {
    navLinks.forEach((link) => {
      link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--gold)' : '';
    });
  }

  function onScroll() {
    let current = sections[0];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el && window.scrollY + 120 >= el.offsetTop) current = id;
    });
    setActive(current);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── HELPERS: collect form data ─────────────────────────── */
function getFormData() {
  const name    = document.getElementById('name')?.value.trim()    || '';
  const phone   = document.getElementById('phone')?.value.trim()   || '';
  const event   = document.getElementById('event')?.value          || '';
  const date    = document.getElementById('date')?.value           || '';
  const message = document.getElementById('message')?.value.trim() || '';
  return { name, phone, event, date, message };
}

function validateForm() {
  const { name, phone, message } = getFormData();
  if (!name)    { alert('Please enter your name.');            return false; }
  if (!phone)   { alert('Please enter your phone number.');    return false; }
  if (!message) { alert('Please describe your requirements.'); return false; }
  return true;
}

/* ── SEND VIA WHATSAPP ──────────────────────────────────── */
function sendViaWhatsApp() {
  if (!validateForm()) return;

  const { name, phone, event, date, message } = getFormData();

  const lines = [
    '🌸 *New Enquiry – Sri Sai Events* 🌸',
    '',
    `*Name:* ${name}`,
    `*Phone:* ${phone}`,
    event  ? `*Event Type:* ${event}`  : null,
    date   ? `*Event Date:* ${date}`   : null,
    `*Message:*`,
    message,
    '',
    '_Sent from srisaievents.com_'
  ].filter(l => l !== null).join('\n');

  const encoded = encodeURIComponent(lines);
  const url = `https://wa.me/917338483892?text=${encoded}`;

  showSuccessAndOpen(url);
}

/* ── SEND VIA EMAIL (Outlook / Mail) ────────────────────── */
function sendViaEmail() {
  if (!validateForm()) return;

  const { name, phone, event, date, message } = getFormData();

  const subject = `Event Enquiry from ${name} – Sri Sai Events`;

  const body = [
    'Dear Sri Sai Events Team,',
    '',
    'I would like to enquire about your event services. Below are my details:',
    '',
    `Name        : ${name}`,
    `Phone       : ${phone}`,
    event  ? `Event Type  : ${event}`  : null,
    date   ? `Event Date  : ${date}`   : null,
    '',
    'Message / Requirements:',
    message,
    '',
    'Please get in touch with me at your earliest convenience.',
    '',
    `Regards,`,
    name
  ].filter(l => l !== null).join('\n');

  const mailtoUrl =
    `mailto:kumarsaaho99@gmail.com` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  showSuccessAndOpen(mailtoUrl);
}

/* ── SHOW SUCCESS STATE & OPEN URL ──────────────────────── */
function showSuccessAndOpen(url) {
  const form       = document.getElementById('enquiryForm');
  const successMsg = document.getElementById('formSuccess');

  if (form)       form.style.display = 'none';
  if (successMsg) successMsg.classList.add('show');

  // Open in new tab
  setTimeout(() => { window.open(url, '_blank'); }, 300);
}

/* ── HERO IMAGE CAROUSEL ────────────────────────────────── */
(function initCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  if (!slides.length) return;

  const dots = document.querySelectorAll('.carousel-dot');
  let current = 0;
  let timer;

  function goTo(idx) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function startTimer() {
    timer = setInterval(() => goTo(current + 1), 4500);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(timer);
      goTo(i);
      startTimer();
    });
  });

  startTimer();
})();

/* ── DYNAMIC GALLERY: load images from folder data-attribute ─
   Service pages declare:
     <div class="sp-gallery-carousel" data-image-folder="images/birthday-party">
   This function scans the folder (using known image names by convention: 01.jpg, 02.jpg …)
   and builds the slide + dot HTML dynamically.
   
   Because pure HTML/JS cannot list a directory, we use a convention-based probe approach:
   we attempt to load sequential images (01.jpg, 02.jpg, ... up to a reasonable max)
   and add each one that loads successfully.
────────────────────────────────────────────────────────── */
(function initDynamicGalleries() {
  const carousels = document.querySelectorAll('.sp-gallery-carousel[data-image-folder]');
  if (!carousels.length) return;

  carousels.forEach(function(carousel) {
    const folder = carousel.getAttribute('data-image-folder');
    if (!folder) return;

    const altLabels = {
      'images/birthday-party':    ['Birthday party event', 'Birthday celebration decor', 'Balloon decoration'],
      'images/flower-decoration': ['Flower decoration event', 'Floral arch decoration', 'Wedding flower setup', 'Floral centerpiece'],
      'images/tent-house':        ['Grand stage setup', 'Grand event venue', 'Event lighting setup'],
      'images/video-photography': ['Video photography event', 'Professional photography', 'Cinematic videography'],
      'images/makeup-artist':     ['Professional makeup artist', 'Glamour makeup', 'Hair styling'],
    };

    const altList = altLabels[folder] || [];
    const MAX_IMAGES = 20;
    let loaded = [];
    let pending = 0;

    function buildCarousel(images) {
      if (!images.length) return;

      const dotsContainer = carousel.querySelector('.sgc-dots');
      const counter       = carousel.querySelector('.sgc-counter');
      const prevBtn       = carousel.querySelector('.sgc-prev');
      const nextBtn       = carousel.querySelector('.sgc-next');

      // Inject slides before the buttons
      images.forEach(function(src, idx) {
        const slide = document.createElement('div');
        slide.className = 'sgc-slide' + (idx === 0 ? ' active' : '');

        // Blurred background layer — fills frame, hides letterbox bars
        const bgImg = document.createElement('img');
        bgImg.src = src;
        bgImg.alt = '';
        bgImg.setAttribute('aria-hidden', 'true');
        bgImg.className = 'sgc-slide-bg';

        // Foreground layer — shows the full image without cropping
        const img = document.createElement('img');
        img.src = src;
        img.alt = altList[idx] || 'Sri Sai Events gallery image';
        img.className = 'sgc-slide-img';

        slide.appendChild(bgImg);
        slide.appendChild(img);
        carousel.insertBefore(slide, prevBtn);

        // Add dot
        const dot = document.createElement('button');
        dot.className = 'sgc-dot' + (idx === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Slide ' + (idx + 1));
        dotsContainer.appendChild(dot);
      });

      if (counter) counter.textContent = '1 / ' + images.length;

      // Wire up the carousel controls
      wireCarousel(carousel);
    }

    // Probe images sequentially, trying both .jpg and .jpeg for each index
    function probeImages(idx) {
      if (idx > MAX_IMAGES) {
        buildCarousel(loaded);
        return;
      }
      var num = String(idx).padStart(2, '0');
      var extensions = ['jpg', 'jpeg'];

      function tryExtension(extIdx) {
        if (extIdx >= extensions.length) {
          // Both extensions failed for this index — stop probing
          buildCarousel(loaded);
          return;
        }
        var src = folder + '/' + num + '.' + extensions[extIdx];
        var img = new Image();
        img.onload = function() {
          loaded.push(src);
          probeImages(idx + 1);
        };
        img.onerror = function() {
          // Try the next extension before giving up on this index
          tryExtension(extIdx + 1);
        };
        img.src = src;
      }

      tryExtension(0);
    }

    probeImages(1);
  });
})();

/* ── CAROUSEL WIRE-UP (shared between static & dynamic carousels) ── */
function wireCarousel(carousel) {
  const slides  = carousel.querySelectorAll('.sgc-slide');
  const dots    = carousel.querySelectorAll('.sgc-dot');
  const prevBtn = carousel.querySelector('.sgc-prev');
  const nextBtn = carousel.querySelector('.sgc-next');
  const counter = carousel.querySelector('.sgc-counter');
  if (!slides.length) return;

  let current = 0;
  let timer;

  function goTo(idx) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
    if (counter) counter.textContent = (current + 1) + ' / ' + slides.length;
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(function() { goTo(current + 1); }, 4000);
  }

  if (prevBtn) prevBtn.addEventListener('click', function() {
    goTo(current - 1); startTimer();
  });
  if (nextBtn) nextBtn.addEventListener('click', function() {
    goTo(current + 1); startTimer();
  });

  dots.forEach(function(dot, i) {
    dot.addEventListener('click', function() { goTo(i); startTimer(); });
  });

  /* Touch / swipe support */
  let touchX = 0;
  carousel.addEventListener('touchstart', function(e) {
    touchX = e.changedTouches[0].screenX;
  }, { passive: true });
  carousel.addEventListener('touchend', function(e) {
    const diff = touchX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); startTimer(); }
  }, { passive: true });

  /* Keyboard */
  carousel.setAttribute('tabindex', '0');
  carousel.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft')  { goTo(current - 1); startTimer(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); startTimer(); }
  });

  /* Pause on hover */
  carousel.addEventListener('mouseenter', function() { clearInterval(timer); });
  carousel.addEventListener('mouseleave', startTimer);

  if (counter) counter.textContent = '1 / ' + slides.length;
  startTimer();
}

/* ── SERVICE PAGE GALLERY CAROUSEL (static fallback) ────────
   Handles carousels that already have their slides in HTML
   (i.e. carousels WITHOUT data-image-folder attribute).
────────────────────────────────────────────────────────── */
(function initGalleryCarousels() {
  document.querySelectorAll('.sp-gallery-carousel:not([data-image-folder])').forEach(function(carousel) {
    wireCarousel(carousel);
  });
})();

/* ── FOOTER YEAR ────────────────────────────────────────── */
(function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();
