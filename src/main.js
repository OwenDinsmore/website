/**
 * Terminal Portfolio - Main Entry Point
 * Vanilla JavaScript with modular architecture
 */

import { Globe } from './globe.js';
import { createASCIIBanner } from './asciiArt.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setupGlobeDiagnostics } from './globeTest.js';

gsap.registerPlugin(ScrollTrigger);

// ===================================
// Utility Functions
// ===================================

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ===================================
// Terminal Interface
// ===================================

class TerminalInterface {
  constructor(terminalElement, inputElement, outputElement) {
    this.terminal = terminalElement;
    this.input = inputElement;
    this.output = outputElement;
    this.contactCards = document.getElementById('contactCards');
    this.commands = {
      help: this.showHelp.bind(this),
      contacts: this.showContacts.bind(this),
      resume: this.showResume.bind(this),
      clear: this.clearOutput.bind(this),
    };

    this.init();
  }

  init() {
    // Only activate when clicking the prompt, not the entire terminal
    const prompt = this.terminal.querySelector('.terminal__prompt');
    if (prompt) {
      prompt.addEventListener('click', () => {
        this.terminal.classList.add('active');
        this.input.focus();
      });
    }

    // Also activate when clicking the input itself
    this.input.addEventListener('click', () => {
      this.terminal.classList.add('active');
      this.input.focus();
    });

    // Handle command input
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.processCommand(this.input.value.trim().toLowerCase());
        this.input.value = '';
      }
    });

    // Close terminal when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.terminal.contains(e.target)) {
        this.terminal.classList.remove('active');
      }
    });
  }

  processCommand(command) {
    if (command === '') return;

    // Display command
    this.addOutput(`> ${command}`, 'command');

    // Execute command
    if (this.commands[command]) {
      this.commands[command]();
    } else {
      this.addOutput(`Command not found: ${command}. Type 'help' for available commands.`, 'error');
    }
  }

  addOutput(text, type = 'info') {
    const line = document.createElement('div');
    line.textContent = text;
    line.className = `output-line output-line--${type}`;
    this.output.appendChild(line);
    this.output.scrollTop = this.output.scrollHeight;
  }

  clearOutput() {
    this.output.innerHTML = '';
  }

  showHelp() {
    this.addOutput('Available commands:', 'info');
    this.addOutput('  contacts - Show contact information', 'info');
    this.addOutput('  resume   - Download resume', 'info');
    this.addOutput('  clear    - Clear terminal output', 'info');
    this.addOutput('  help     - Show this help message', 'info');
  }

  showContacts() {
    this.contactCards.hidden = false;
    this.addOutput('Contact cards displayed above.', 'success');
  }

  showResume() {
    this.addOutput('Opening resume...', 'success');
    // TODO: Replace with actual resume URL
    window.open('/path/to/resume.pdf', '_blank');
  }
}


// ===================================
// Tabbed Card Manager
// ===================================

class CardManager {
  constructor() {
    this.tabButtons = document.querySelectorAll('.tab-button');
    this.tabPanels = document.querySelectorAll('.tab-panel');
    this.cards = document.querySelectorAll('[data-card]');
    this.currentTab = 0;
    this.isSwitching = false;
    this.init();
  }

  init() {
    // Setup tab click handlers
    this.setupTabClicks();

    // Setup scroll-to-switch tabs
    this.setupScrollSwitching();

    // Setup clickable cards for expansion
    this.setupCardExpansion();

    // Show first tab's cards
    this.showTabCards(0);
  }

  setupTabClicks() {
    this.tabButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        this.switchTab(index);
      });
    });
  }

  setupScrollSwitching() {
    if (prefersReducedMotion()) return;

    const tabbedCard = document.querySelector('.tabbed-card');
    if (!tabbedCard) return;

    let scrollAccumulator = 0;
    const scrollThreshold = 80;

    const handleWheel = (e) => {
      const isScrollableContent = e.target.closest('.tab-content-wrapper');
      if (isScrollableContent) {
        const wrapper = isScrollableContent;
        const canScrollDown = wrapper.scrollTop < wrapper.scrollHeight - wrapper.clientHeight;
        const canScrollUp = wrapper.scrollTop > 0;

        if ((e.deltaY > 0 && canScrollDown) || (e.deltaY < 0 && canScrollUp)) {
          return;
        }
      }

      if (this.isSwitching) {
        e.preventDefault();
        return;
      }

      const isScrollingDown = e.deltaY > 0;
      const isScrollingUp = e.deltaY < 0;
      const isAtLastTab = this.currentTab === this.tabPanels.length - 1;
      const isAtFirstTab = this.currentTab === 0;

      if ((isScrollingDown && isAtLastTab) || (isScrollingUp && isAtFirstTab)) {
        scrollAccumulator = 0;
        return;
      }

      scrollAccumulator += e.deltaY;

      if (Math.abs(scrollAccumulator) > scrollThreshold) {
        if (scrollAccumulator > 0 && this.currentTab < this.tabPanels.length - 1) {
          this.switchTab(this.currentTab + 1);
        } else if (scrollAccumulator < 0 && this.currentTab > 0) {
          this.switchTab(this.currentTab - 1);
        }
        scrollAccumulator = 0;
      }

      e.preventDefault();
    };

    tabbedCard.addEventListener('wheel', handleWheel, { passive: false });
  }

  switchTab(index) {
    if (this.isSwitching || index === this.currentTab) return;

    this.isSwitching = true;

    // Update buttons
    this.tabButtons.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });

    // Update panels
    this.tabPanels.forEach((panel, i) => {
      panel.classList.toggle('active', i === index);
    });

    // Show cards for new tab
    this.showTabCards(index);

    this.currentTab = index;

    setTimeout(() => {
      this.isSwitching = false;
    }, 300);
  }

  showTabCards(tabIndex) {
    const panel = this.tabPanels[tabIndex];
    if (!panel) return;

    const cards = panel.querySelectorAll('[data-card]');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('visible');
      }, index * 50);
    });
  }

  setupCardExpansion() {
    this.cards.forEach(card => {
      const content = card.querySelector('.card-content');
      if (!content) return;

      // Make entire card clickable to toggle
      card.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') return;

        const isExpanded = card.classList.contains('expanded');

        if (isExpanded) {
          card.classList.remove('expanded');
          content.hidden = true;
        } else {
          card.classList.add('expanded');
          content.hidden = false;
        }
      });
    });
  }
}

// ===================================
// Diagonal Cards Animation
// ===================================

class DiagonalCards {
  constructor() {
    this.container = document.querySelector('.diagonal-cards-container');
    this.section = document.querySelector('.section--diagonal-cards');
    this.cards = document.querySelectorAll('.diagonal-card');

    if (!this.container || this.cards.length === 0) return;

    this.init();
  }

  init() {
    if (prefersReducedMotion()) {
      // Show cards in final position if reduced motion
      this.cards.forEach((card, index) => {
        const xPos = (index - 1) * 450 + window.innerWidth / 2 - 200;
        gsap.set(card, {
          x: xPos,
          y: window.innerHeight / 2 - 250
        });
      });
      return;
    }

    this.setupScrollAnimations();
  }

  setupScrollAnimations() {
    const section = this.section;
    const cards = this.cards;
    const container = this.container;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Calculate stripe dimensions - they need to be large enough to cover
    // the screen when rotated at -45 degrees
    // When rotated 45°, we need extra size to cover corners
    const diagonal = Math.sqrt(vw * vw + vh * vh);
    const stripeWidth = vw / 2.5; // Each stripe covers ~40% width with overlap
    const stripeHeight = diagonal * 1.5; // Tall enough to cover when rotated

    // Horizontal positions for each stripe (left, center, right)
    const stripePositions = [
      vw * 0.15,  // Left stripe
      vw * 0.5,   // Center stripe
      vw * 0.85   // Right stripe
    ];

    // Set card dimensions via CSS
    cards.forEach((card, index) => {
      card.style.width = `${stripeWidth}px`;
      card.style.height = `${stripeHeight}px`;
    });

    // Start position: below and off screen
    const getStartY = () => vh + stripeHeight;

    // Center position: covering the viewport
    const getCenterY = () => vh / 2;

    // Exit position: above and off screen
    const getExitY = () => -stripeHeight;

    // Set initial positions (below screen, rotated, at their X positions)
    cards.forEach((card, index) => {
      gsap.set(card, {
        x: stripePositions[index] - stripeWidth / 2,
        y: getStartY(),
        rotation: -45,
        transformOrigin: 'center center'
      });
    });

    // Visibility toggle
    ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: () => { container.style.visibility = 'visible'; },
      onLeave: () => { container.style.visibility = 'hidden'; },
      onEnterBack: () => { container.style.visibility = 'visible'; },
      onLeaveBack: () => { container.style.visibility = 'hidden'; }
    });

    // Main animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5
      }
    });

    // ENTRY PHASE: Stripes slide in one at a time (left, middle, right)
    // Each stripe fully enters before the next begins
    const entryDuration = 0.13;

    cards.forEach((card, index) => {
      const startTime = index * entryDuration;

      tl.to(card, {
        y: getCenterY(),
        duration: entryDuration,
        ease: 'none'
      }, startTime);
    });

    // PAUSE PHASE (0.39 - 0.61): All stripes visible, covering screen
    // No animation - they hold position

    // EXIT PHASE: Stripes slide out one at a time (left, middle, right)
    const exitDuration = 0.13;
    const exitStart = 0.61;

    cards.forEach((card, index) => {
      const exitStartTime = exitStart + (index * exitDuration);

      tl.to(card, {
        y: getExitY(),
        duration: exitDuration,
        ease: 'none'
      }, exitStartTime);
    });

    container.style.visibility = 'hidden';
  }
}

// ===================================
// Back to Top Button
// ===================================

class BackToTop {
  constructor() {
    this.button = document.getElementById('backToTop');
    this.init();
  }

  init() {
    // Show/hide button based on scroll position
    const handleScroll = debounce(() => {
      if (window.scrollY > 500) {
        this.button.hidden = false;
      } else {
        this.button.hidden = true;
      }
    }, 100);

    window.addEventListener('scroll', handleScroll);

    // Scroll to top on click
    this.button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// ===================================
// Skills Grid Stacking Animation
// ===================================

class SkillsGridAnimation {
  constructor() {
    this.section = document.querySelector('.section--skills-grid');
    this.container = document.querySelector('.skills-grid-container');

    if (!this.section || !this.container) return;

    // Get all skill boxes grouped by type
    this.smallBoxes = Array.from(document.querySelectorAll('.skill-box--small'));
    this.mediumBoxes = Array.from(document.querySelectorAll('.skill-box--medium'));
    this.largeBox = document.querySelector('.skill-box--large');

    this.init();
  }

  init() {
    if (prefersReducedMotion()) {
      // Show all boxes immediately if reduced motion
      this.showAllBoxes();
      return;
    }

    this.setupZipperAnimation();
  }

  showAllBoxes() {
    const allBoxes = [...this.smallBoxes, ...this.mediumBoxes];
    if (this.largeBox) allBoxes.push(this.largeBox);

    allBoxes.forEach(box => {
      box.style.opacity = '1';
      box.style.transform = 'translateX(0)';
    });
  }

  setupZipperAnimation() {
    const vw = window.innerWidth;

    // Set initial state - boxes hidden off to sides (alternating left/right)
    // Row 1: boxes 0,1,2,3 - alternate from left and right
    this.smallBoxes.forEach((box, index) => {
      const fromLeft = index % 2 === 0;
      gsap.set(box, {
        opacity: 0,
        x: fromLeft ? -vw : vw
      });
    });

    // Medium boxes - alternate sides
    this.mediumBoxes.forEach((box, index) => {
      const fromLeft = index % 2 === 0;
      gsap.set(box, {
        opacity: 0,
        x: fromLeft ? -vw : vw
      });
    });

    // Large box from bottom
    if (this.largeBox) {
      gsap.set(this.largeBox, {
        opacity: 0,
        y: 200
      });
    }

    // Create timeline for zipper animation - pinned while animating
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.section,
        start: 'top top',
        end: '+=2000',
        pin: true,
        scrub: 1,
        anticipatePin: 1
      }
    });

    // Zipper in the small boxes - top row first, alternating left/right
    // Row 1: indices 0, 1, 2, 3
    const row1 = this.smallBoxes.slice(0, 4);
    row1.forEach((box, i) => {
      tl.to(box, {
        opacity: 1,
        x: 0,
        duration: 0.15,
        ease: 'power3.out'
      }, i * 0.05);
    });

    // Row 2: indices 4, 5, 6, 7
    const row2 = this.smallBoxes.slice(4, 8);
    row2.forEach((box, i) => {
      tl.to(box, {
        opacity: 1,
        x: 0,
        duration: 0.15,
        ease: 'power3.out'
      }, 0.25 + i * 0.05);
    });

    // Medium boxes zipper in
    this.mediumBoxes.forEach((box, i) => {
      tl.to(box, {
        opacity: 1,
        x: 0,
        duration: 0.18,
        ease: 'power3.out'
      }, 0.5 + i * 0.06);
    });

    // Large box slides up from bottom
    if (this.largeBox) {
      tl.to(this.largeBox, {
        opacity: 1,
        y: 0,
        duration: 0.2,
        ease: 'power2.out'
      }, 0.8);
    }
  }
}

// ===================================
// Backgammon Game (Lazy Loaded)
// ===================================

class BackgammonLoader {
  constructor() {
    this.container = document.querySelector('.backgammon-container');
    this.playBtn = document.querySelector('.backgammon-play-btn');
    this.game = null;
    this.loaded = false;

    if (!this.container || !this.playBtn) return;

    this.init();
  }

  init() {
    // Lazy load the game when play button is clicked
    this.playBtn.addEventListener('click', () => this.loadAndStartGame());
  }

  async loadAndStartGame() {
    if (!this.loaded) {
      try {
        this.playBtn.textContent = '[ ... ]';
        this.playBtn.disabled = true;

        // Dynamic import - Vite will code-split this automatically
        const { Backgammon } = await import('./games/backgammon.js');

        this.game = new Backgammon(this.container);
        this.loaded = true;

        console.log('Backgammon game loaded');
      } catch (err) {
        console.error('Failed to load backgammon:', err);
        this.playBtn.textContent = '[ ERROR ]';
        this.playBtn.disabled = false;
        return;
      }
    } else if (this.game) {
      // Game already loaded, just start/reset
      this.game.startGame();
    }
  }
}

// ===================================
// Initialization
// ===================================

async function init() {
  // Set current year in footer
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  // Generate ASCII art banner
  const bannerContainer = document.getElementById('main-content');
  if (bannerContainer) {
    const banner = createASCIIBanner(true);
    bannerContainer.appendChild(banner);

    // Entrance animation
    if (!prefersReducedMotion()) {
      gsap.from('.ascii-banner', {
        opacity: 0,
        scale: 0.95,
        duration: 1,
        ease: 'power2.out',
        delay: 0.3
      });

      // Scroll animation disabled for now - keeping banner visible
      // const globeSection = document.getElementById('globe');
      // if (globeSection) {
      //   gsap.to('.ascii-banner', {
      //     y: -100,
      //     opacity: 0,
      //     scrollTrigger: {
      //       trigger: globeSection,
      //       start: 'top 80%',
      //       end: 'top 20%',
      //       scrub: 1,
      //     }
      //   });
      // }
    }
  }

  // Initialize terminal interfaces (landing page and footer)
  const terminals = document.querySelectorAll('.terminal');
  terminals.forEach((terminal, index) => {
    const input = terminal.querySelector('.terminal__input');
    const output = terminal.querySelector('.terminal__output');
    new TerminalInterface(terminal, input, output);
  });

  // Initialize 3D globe
  try {
    console.log('Initializing globe...');
    const globe = new Globe('globeCanvas', 'globe');
    console.log('Globe initialized:', globe);
  } catch (err) {
    console.error('Globe initialization failed:', err);
  }

  // Initialize cards with animations
  new CardManager();

  // Initialize diagonal cards with scroll animations
  new DiagonalCards();

  // Initialize skills grid stacking animation
  new SkillsGridAnimation();

  // Initialize backgammon game (lazy loaded)
  new BackgammonLoader();

  // Initialize back to top button
  new BackToTop();

  console.log('Terminal Portfolio initialized');

  // Run globe diagnostics
  setupGlobeDiagnostics();
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for potential module usage
export { TerminalInterface, CardManager, DiagonalCards, SkillsGridAnimation, BackgammonLoader, BackToTop };
