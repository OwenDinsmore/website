/**
 * Terminal Portfolio - Main Entry Point
 * Vanilla JavaScript with modular architecture
 */

import { Globe } from './globe.js';
import { createASCIIBanner } from './asciiArt.js';
import { NewtonsCradle } from './newtonsCradle.js';
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
    this.cradleCanvas = document.getElementById('cradleCanvas');
    this.commands = {
      help: this.showHelp.bind(this),
      contacts: this.showContacts.bind(this),
      contact: this.showContact.bind(this),
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
    this.addOutput('  contact  - Show interactive contact links', 'info');
    this.addOutput('  contacts - Show contact information', 'info');
    this.addOutput('  resume   - Download resume', 'info');
    this.addOutput('  clear    - Clear terminal output', 'info');
    this.addOutput('  help     - Show this help message', 'info');
  }

  showContact() {
    if (this.cradleCanvas) {
      this.cradleCanvas.classList.add('active');
      this.addOutput('Interactive contact links displayed.', 'success');
    }
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

    // Setup expandable cards
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
    const scrollThreshold = 80; // Small scroll to switch tabs

    const handleWheel = (e) => {
      // Only handle if not scrolling within tab content
      const isScrollableContent = e.target.closest('.tab-content-wrapper');
      if (isScrollableContent) {
        const wrapper = isScrollableContent;
        const canScrollDown = wrapper.scrollTop < wrapper.scrollHeight - wrapper.clientHeight;
        const canScrollUp = wrapper.scrollTop > 0;

        // Allow natural scrolling within content
        if ((e.deltaY > 0 && canScrollDown) || (e.deltaY < 0 && canScrollUp)) {
          return;
        }
      }

      if (this.isSwitching) {
        e.preventDefault();
        return;
      }

      // Check if we're at boundaries and should allow page scroll
      const isScrollingDown = e.deltaY > 0;
      const isScrollingUp = e.deltaY < 0;
      const isAtLastTab = this.currentTab === this.tabPanels.length - 1;
      const isAtFirstTab = this.currentTab === 0;

      // Allow natural page scroll at boundaries
      if ((isScrollingDown && isAtLastTab) || (isScrollingUp && isAtFirstTab)) {
        scrollAccumulator = 0;
        return; // Don't prevent default, allow page scroll
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
      const toggle = card.querySelector('.card-toggle');
      const content = card.querySelector('.card-content');

      if (!toggle || !content) return;

      toggle.addEventListener('click', () => {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

        // Close all other cards
        this.cards.forEach(otherCard => {
          if (otherCard !== card) {
            const otherToggle = otherCard.querySelector('.card-toggle');
            const otherContent = otherCard.querySelector('.card-content');
            if (otherToggle && otherContent) {
              otherToggle.setAttribute('aria-expanded', 'false');
              otherContent.hidden = true;
            }
          }
        });

        // Toggle current card
        toggle.setAttribute('aria-expanded', !isExpanded);
        content.hidden = isExpanded;
      });
    });
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

  // Initialize Newton's Cradle
  const cradleCanvas = document.getElementById('cradleCanvas');
  if (cradleCanvas) {
    try {
      const links = [
        { name: 'Left Ball', url: null, icon: '', isDraggable: true },
        { name: 'GitHub', url: 'https://github.com/your-username', icon: 'gh', isDraggable: false },
        { name: 'Email', url: 'mailto:your.email@example.com', icon: '@', isDraggable: false },
        { name: 'LinkedIn', url: 'https://linkedin.com/in/your-profile', icon: 'in', isDraggable: false },
        { name: 'Right Ball', url: null, icon: '', isDraggable: true }
      ];
      new NewtonsCradle(cradleCanvas, links);
      console.log('Newton\'s Cradle initialized successfully');
    } catch (err) {
      console.error('Failed to initialize Newton\'s Cradle:', err);
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
export { TerminalInterface, CardManager, BackToTop };
