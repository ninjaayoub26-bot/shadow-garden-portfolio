/**
 * SHADOW GARDEN — STUDIO PORTFOLIO JAVASCRIPT
 * Developer: Ayoub Zouggar | Independent Web Developer | Tangier, Morocco
 * Brand: SHADOW GARDEN
 * Pure Vanilla ES6+, High-Performance 60fps Animations, Accessible
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. STATE & SELECTORS
  // -------------------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer: fine) and (min-width: 992px)').matches;

  const introLoader = document.getElementById('intro-loader');
  const animatedHeadline = document.getElementById('hero-title');
  const bgSpotlight = document.getElementById('bg-spotlight');
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  const header = document.querySelector('.site-header');
  const navToggleBtn = document.querySelector('.nav-toggle-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavCloseBtn = document.querySelector('.mobile-nav__close-btn');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav__link');
  const revealElements = document.querySelectorAll('.reveal-item');
  const copyButtons = document.querySelectorAll('[data-copy]');
  const toast = document.getElementById('toast');
  const backToTopBtn = document.getElementById('back-to-top');
  const currentYearElem = document.getElementById('current-year');
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const waSubmitBtn = document.getElementById('whatsapp-submit-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalDismissBtn = document.getElementById('modal-dismiss-btn');
  const modalBackdrop = document.getElementById('modal-backdrop');

  // Update current year automatically in footer
  if (currentYearElem) {
    currentYearElem.textContent = new Date().getFullYear();
  }

  // -------------------------------------------------------------------------
  // 2. CINEMATIC PAGE INTRO LOADER
  // -------------------------------------------------------------------------
  const finishIntro = () => {
    if (introLoader) {
      introLoader.classList.add('is-hidden');
      introLoader.setAttribute('aria-hidden', 'true');
      setTimeout(() => {
        introLoader.style.display = 'none';
      }, 900);
    }

    // Trigger headline character/word reveal once intro clears
    if (animatedHeadline) {
      setTimeout(() => {
        animatedHeadline.classList.add('is-animated');
      }, 150);
    }
  };

  if (introLoader) {
    if (prefersReducedMotion) {
      introLoader.style.display = 'none';
      if (animatedHeadline) animatedHeadline.classList.add('is-animated');
    } else {
      // Elegant cinematic duration: 1.25s
      setTimeout(finishIntro, 1250);
    }
  } else if (animatedHeadline) {
    animatedHeadline.classList.add('is-animated');
  }

  // -------------------------------------------------------------------------
  // 3. DESKTOP CUSTOM CURSOR WITH SPRING LERP
  // -------------------------------------------------------------------------
  if (isFinePointer && !prefersReducedMotion && cursorDot && cursorRing) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isCursorActive = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isCursorActive) {
        cursorDot.classList.remove('is-hidden');
        cursorRing.classList.remove('is-hidden');
        isCursorActive = true;
      }

      // Fast sync for center dot
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;

      // Update ambient spotlight CSS variables on root
      document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      cursorDot.classList.add('is-hidden');
      cursorRing.classList.add('is-hidden');
      isCursorActive = false;
    });

    document.addEventListener('mouseenter', () => {
      cursorDot.classList.remove('is-hidden');
      cursorRing.classList.remove('is-hidden');
      isCursorActive = true;
    });

    // Spring Lerp Loop for trailing outer ring
    const renderCursorRing = () => {
      // 0.18 lerp factor for smooth liquid responsiveness
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;

      requestAnimationFrame(renderCursorRing);
    };
    requestAnimationFrame(renderCursorRing);

    // Expand on hoverable elements
    const hoverTargets = document.querySelectorAll('a, button, input, textarea, select, .project-card, .principle-card, .channel-card');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorRing.classList.add('is-hovered');
      });
      el.addEventListener('mouseleave', () => {
        cursorRing.classList.remove('is-hovered');
      });
    });

    // Press feedback
    window.addEventListener('mousedown', () => {
      cursorRing.classList.add('is-clicking');
    });
    window.addEventListener('mouseup', () => {
      cursorRing.classList.remove('is-clicking');
    });
  }

  // -------------------------------------------------------------------------
  // 4. HEADER SCROLL & BACK TO TOP VISIBILITY
  // -------------------------------------------------------------------------
  let isScrolling = false;

  const handleHeaderScroll = () => {
    const scrollPos = window.scrollY;

    if (scrollPos > 40) {
      header?.classList.add('is-scrolled');
    } else {
      header?.classList.remove('is-scrolled');
    }

    if (backToTopBtn) {
      if (scrollPos > 450) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
      } else {
        backToTopBtn.style.opacity = '0.35';
        backToTopBtn.style.pointerEvents = 'auto';
      }
    }

    isScrolling = false;
  };

  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(handleHeaderScroll);
      isScrolling = true;
    }
  }, { passive: true });

  handleHeaderScroll();

  // -------------------------------------------------------------------------
  // 5. ACCESSIBLE MOBILE DRAWER NAVIGATION
  // -------------------------------------------------------------------------
  if (navToggleBtn && mobileNav) {
    let isMenuOpen = false;
    const focusableSelectors = 'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    let focusableElements = [];

    const openMenu = () => {
      isMenuOpen = true;
      navToggleBtn.classList.add('is-active');
      navToggleBtn.setAttribute('aria-expanded', 'true');
      navToggleBtn.setAttribute('aria-label', 'Close navigation menu');
      mobileNav.classList.add('is-open');
      mobileNav.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      focusableElements = Array.from(mobileNav.querySelectorAll(focusableSelectors));
      if (focusableElements.length > 0) {
        const target = mobileNavCloseBtn || focusableElements[0];
        target.focus();
      }
    };

    const closeMenu = () => {
      isMenuOpen = false;
      navToggleBtn.classList.remove('is-active');
      navToggleBtn.setAttribute('aria-expanded', 'false');
      navToggleBtn.setAttribute('aria-label', 'Open navigation menu');
      mobileNav.classList.remove('is-open');
      mobileNav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      navToggleBtn.focus();
    };

    navToggleBtn.addEventListener('click', () => {
      if (isMenuOpen) closeMenu();
      else openMenu();
    });

    if (mobileNavCloseBtn) {
      mobileNavCloseBtn.addEventListener('click', () => {
        if (isMenuOpen) closeMenu();
      });
    }

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (isMenuOpen) closeMenu();
      });
    });

    // Close on Escape & trap tab focus
    document.addEventListener('keydown', (e) => {
      if (!isMenuOpen) return;

      if (e.key === 'Escape') {
        closeMenu();
      } else if (e.key === 'Tab') {
        if (focusableElements.length === 0) return;
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  // -------------------------------------------------------------------------
  // 6. SCROLL-SPY ACTIVE NAV HIGHLIGHTING
  // -------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('is-active');
              link.setAttribute('aria-current', 'page');
            } else if (href && href.startsWith('#')) {
              link.classList.remove('is-active');
              link.removeAttribute('aria-current');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
  }

  // -------------------------------------------------------------------------
  // 7. PROGRESSIVE SCROLL REVEAL ANIMATIONS (BLUR-TO-CLEAR & FADE-UP)
  // -------------------------------------------------------------------------
  if (!prefersReducedMotion && 'IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.08
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // -------------------------------------------------------------------------
  // 8. PROJECT CARDS 3D TILT EFFECT (DESKTOP POINTER)
  // -------------------------------------------------------------------------
  if (isFinePointer && !prefersReducedMotion && projectCards.length > 0) {
    projectCards.forEach(card => {
      let isCardHovered = false;

      card.addEventListener('mouseenter', () => {
        isCardHovered = true;
        card.style.transition = 'transform 0.15s ease-out, border-color 0.25s ease-out, box-shadow 0.25s ease-out';
      });

      card.addEventListener('mousemove', (e) => {
        if (!isCardHovered) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Subtle 3D tilt: max 3.5 degrees
        const rotateX = ((y - centerY) / centerY) * -3.5;
        const rotateY = ((x - centerX) / centerX) * 3.5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        isCardHovered = false;
        card.style.transition = 'transform 0.5s var(--ease-out), border-color 0.25s ease-out, box-shadow 0.25s ease-out';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  // -------------------------------------------------------------------------
  // 9. PROJECT DETAILS SPECIFICATION MODAL
  // -------------------------------------------------------------------------
  const projectsData = {
    pulse: {
      category: '01 // TELEMETRY & EDGE MONITORING',
      title: 'Pulse Analytics Engine',
      image: 'project-1.svg',
      description: 'A high-throughput monitoring dashboard engineered to visualize real-time edge network telemetry. Rendered with zero framework dependencies using hardware-accelerated canvas charts and vanilla event pipelines for maximal responsiveness.',
      highlights: [
        'Sub-10ms UI update cycle for streaming time-series data visualization',
        'Pure Vanilla JavaScript architecture with zero external libraries or bundle debt',
        'Fluid responsive dashboard adapting seamlessly across mobile, tablet, and ultra-wide screens',
        'Strict high-contrast dark monochrome visual identity with WCAG accessibility compliance'
      ],
      tags: ['HTML5 Canvas', 'CSS Grid', 'Vanilla ES6+', 'Modern CSS3', 'Performance Profiling'],
      waText: 'Hello Ayoub, I am interested in discussing a dashboard or telemetry interface project like Pulse Analytics Engine.'
    },
    kuro: {
      category: '02 // COMMERCE & DIGITAL ATELIER',
      title: 'Kuro Atelier',
      image: 'project-2.svg',
      description: 'A brutalist, minimalist e-commerce storefront designed for an independent industrial design practice. Engineered to accentuate tactile imagery and craftsmanship through intentional whitespace, fluid typography, and micro-interactions.',
      highlights: [
        'Perfect 100/100 Core Web Vitals score across mobile and desktop audits',
        'Zero layout shift (CLS: 0.00) during asynchronous product catalog hydrations',
        'Accessible cart drawer with keyboard focus trapping and ARIA dialogue compliance',
        'Bespoke monochrome aesthetic engineered exclusively with semantic HTML5 and modern CSS3'
      ],
      tags: ['Semantic HTML5', 'Modern CSS3', 'Vanilla ES6+', 'Responsive Design', 'E-Commerce UX'],
      waText: 'Hello Ayoub, I am interested in discussing a luxury storefront or minimalist e-commerce website like Kuro Atelier.'
    },
    verve: {
      category: '03 // EDITORIAL & CREATIVE LAB',
      title: 'Verve Studio Engine',
      image: 'project-3.svg',
      description: 'A modular editorial publishing system engineered for creative studios and independent practitioners. Leverages CSS clamp() mathematical typography systems and native intersection observers for graceful pacing and storytelling.',
      highlights: [
        'Zero external CSS dependencies or JavaScript animation libraries',
        'Integrated prefers-reduced-motion media query adaptations for accessibility',
        'Complete keyboard navigation support with visible high-contrast outlines',
        'Modular layout architecture allowing dynamic editorial story blocks'
      ],
      tags: ['Modular CSS', 'Fluid clamp() Typography', 'IntersectionObserver', 'Semantic HTML', 'Editorial UX'],
      waText: 'Hello Ayoub, I am interested in discussing an editorial studio layout or portfolio like Verve Studio Engine.'
    },
    synthetix: {
      category: '04 // TOOLING & DESIGN SYSTEMS',
      title: 'Synthetix Design Tokens',
      image: 'project-4.svg',
      description: 'An in-browser design token compiler and component workbench. Enables engineering teams to configure, inspect, and export tokenized monochrome palettes, typographic scales, and CSS variables in real time.',
      highlights: [
        'Live syntax-highlighted token JSON parsing without external parser packages',
        'Exportable CSS custom properties ready for any build system or static web project',
        'Interactive contrast calculator verifying WCAG compliance in real-time',
        'Persistent state management using native browser LocalStorage'
      ],
      tags: ['Vanilla JS', 'CSS Custom Properties', 'LocalStorage API', 'DOM Events', 'Design Tokens'],
      waText: 'Hello Ayoub, I am interested in discussing a design system or component library project like Synthetix Design Tokens.'
    }
  };

  const openProjectModal = (projectId) => {
    const data = projectsData[projectId];
    if (!data || !projectModal) return;

    const modalCategory = document.getElementById('modal-category');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalDesc = document.getElementById('modal-description');
    const modalHighlights = document.getElementById('modal-highlights');
    const modalTags = document.getElementById('modal-tags');
    const modalWaLink = document.getElementById('modal-wa-link');

    if (modalCategory) modalCategory.textContent = data.category;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalImage) {
      modalImage.src = data.image;
      modalImage.alt = `${data.title} Interface Specification`;
    }
    if (modalDesc) modalDesc.textContent = data.description;

    if (modalHighlights) {
      modalHighlights.innerHTML = '';
      data.highlights.forEach(h => {
        const li = document.createElement('li');
        li.textContent = h;
        modalHighlights.appendChild(li);
      });
    }

    if (modalTags) {
      modalTags.innerHTML = '';
      data.tags.forEach(t => {
        const span = document.createElement('span');
        span.className = 'project-tag';
        span.textContent = t;
        modalTags.appendChild(span);
      });
    }

    if (modalWaLink) {
      const waUrl = `https://wa.me/212714413740?text=${encodeURIComponent(data.waText)}`;
      modalWaLink.setAttribute('href', waUrl);
    }

    if (typeof projectModal.showModal === 'function') {
      projectModal.showModal();
    } else {
      projectModal.setAttribute('open', '');
    }
    document.body.style.overflow = 'hidden';
  };

  const closeProjectModal = () => {
    if (!projectModal) return;
    if (typeof projectModal.close === 'function') {
      projectModal.close();
    } else {
      projectModal.removeAttribute('open');
    }
    document.body.style.overflow = '';
  };

  // Open modal buttons
  document.querySelectorAll('.project-details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-project-id');
      if (id) openProjectModal(id);
    });
  });

  // Clicking on project card peek button
  document.querySelectorAll('.project-card__peek-btn').forEach(peek => {
    peek.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = peek.closest('.project-card');
      const id = card?.getAttribute('data-project');
      if (id) openProjectModal(id);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeProjectModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);

  projectModal?.addEventListener('click', (e) => {
    if (e.target === projectModal) closeProjectModal();
  });

  projectModal?.addEventListener('close', () => {
    document.body.style.overflow = '';
  });

  // -------------------------------------------------------------------------
  // 10. COPY-TO-CLIPBOARD WITH TOAST NOTIFICATION
  // -------------------------------------------------------------------------
  let toastTimeoutId = null;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');

    if (toastTimeoutId) clearTimeout(toastTimeoutId);
    toastTimeoutId = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2800);
  };

  const copyTextToClipboard = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // Continue to fallback
    }

    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.setAttribute('readonly', '');
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = `${window.pageYOffset || document.documentElement.scrollTop}px`;
      document.body.appendChild(textArea);
      textArea.select();
      textArea.setSelectionRange(0, textArea.value.length);
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    } catch (err) {
      console.warn('Clipboard fallback failed:', err);
      return false;
    }
  };

  copyButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      const textToCopy = button.getAttribute('data-copy');
      const label = button.getAttribute('data-label') || 'Number';

      if (textToCopy) {
        const ok = await copyTextToClipboard(textToCopy);
        if (ok) {
          showToast(`Copied ${label} (${textToCopy}) to clipboard`);
        } else {
          showToast(`Direct number: ${textToCopy}`);
        }
      }
    });
  });

  // -------------------------------------------------------------------------
  // 11. CONTACT FORM WITH DIRECT WHATSAPP INTEGRATION & VALIDATION
  // -------------------------------------------------------------------------
  if (contactForm) {
    const nameInput = document.getElementById('name');
    const contactField = document.getElementById('contact-field');
    const serviceSelect = document.getElementById('service-type');
    const messageInput = document.getElementById('message');
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    const setFeedback = (input, message = '') => {
      const feedbackEl = input.parentElement?.querySelector('.form-feedback');
      if (feedbackEl) {
        feedbackEl.textContent = message;
      }
      if (message) {
        input.setAttribute('aria-invalid', 'true');
      } else {
        input.removeAttribute('aria-invalid');
      }
    };

    const validateFields = () => {
      let isValid = true;
      const nameVal = nameInput?.value.trim() || '';
      const msgVal = messageInput?.value.trim() || '';

      if (!nameVal || nameVal.length < 2) {
        setFeedback(nameInput, 'Please enter your name (at least 2 characters).');
        isValid = false;
      } else {
        setFeedback(nameInput, '');
      }

      if (!msgVal || msgVal.length < 10) {
        setFeedback(messageInput, 'Please write a project brief (at least 10 characters).');
        isValid = false;
      } else {
        setFeedback(messageInput, '');
      }

      return isValid;
    };

    [nameInput, messageInput].forEach(field => {
      if (field) {
        field.addEventListener('input', () => {
          if (field.getAttribute('aria-invalid') === 'true') {
            setFeedback(field, '');
          }
        });
      }
    });

    // 1. Direct WhatsApp Submission Action
    if (waSubmitBtn) {
      waSubmitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isOk = validateFields();
        if (!isOk) {
          if (!nameInput?.value.trim()) nameInput?.focus();
          else messageInput?.focus();
          return;
        }

        const name = nameInput.value.trim();
        const contactInfo = contactField?.value.trim() || 'Not specified';
        const scope = serviceSelect?.options[serviceSelect.selectedIndex]?.text || 'General Web Project';
        const brief = messageInput.value.trim();

        const waMessage = 
          `Hello Ayoub, I am reaching out from your SHADOW GARDEN portfolio:\n\n` +
          `• Name: ${name}\n` +
          `• Contact / Phone: ${contactInfo}\n` +
          `• Project Scope: ${scope}\n` +
          `• Project Brief: ${brief}`;

        const waUrl = `https://wa.me/212714413740?text=${encodeURIComponent(waMessage)}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');

        if (formStatus) {
          formStatus.className = 'form-status is-success';
          formStatus.textContent = 'WhatsApp conversation opened in a new tab! Thank you for getting in touch.';
        }
      });
    }

    // 2. On-Site Brief Submission Action
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isOk = validateFields();
      if (!isOk) {
        if (!nameInput?.value.trim()) nameInput?.focus();
        else messageInput?.focus();
        return;
      }

      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 0.8s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        Sending Brief...
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        if (formStatus) {
          formStatus.className = 'form-status is-success';
          formStatus.innerHTML = `
            Thank you! Your project brief has been recorded successfully. 
            I will review it and reply within 24 hours. 
            <br>
            <a href="https://wa.me/212714413740" target="_blank" rel="noopener noreferrer" style="color: #FFF; text-decoration: underline; margin-top: 6px; display: inline-block;">
              Click here to chat instantly on WhatsApp (+212 714-413740) ↗
            </a>
          `;
          formStatus.setAttribute('role', 'alert');
        }

        contactForm.reset();
        [nameInput, contactField, messageInput].forEach(f => f?.removeAttribute('aria-invalid'));

        setTimeout(() => {
          if (formStatus) {
            formStatus.className = 'form-status';
            formStatus.textContent = '';
          }
        }, 12000);
      }, 750);
    });
  }

  // -------------------------------------------------------------------------
  // 12. BACK TO TOP SMOOTH SCROLL
  // -------------------------------------------------------------------------
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      const brandLogo = document.querySelector('.brand');
      if (brandLogo) brandLogo.focus();
    });
  }
});
