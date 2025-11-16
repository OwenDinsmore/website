/**
 * Keycap Buttons Component
 * Handles the interactive buttons with Newton's Cradle and Games dropdown
 */

import { NewtonsCradle } from './newtonsCradle.js';

export class KeycapButtons {
  constructor(container) {
    this.container = container;
    this.cradle = null;
    this.isDropdownOpen = false;

    this.links = [
      { name: 'Left Ball', url: null, icon: '', isDraggable: true },
      { name: 'GitHub', url: 'https://github.com/your-username', icon: 'gh', isDraggable: false },
      { name: 'Email', url: 'mailto:your.email@example.com', icon: '@', isDraggable: false },
      { name: 'LinkedIn', url: 'https://linkedin.com/in/your-profile', icon: 'in', isDraggable: false },
      { name: 'Right Ball', url: null, icon: '', isDraggable: true }
    ];

    this.games = [
      { name: 'Pong', id: 'pong' },
      { name: 'Brick Breaker', id: 'breakout' },
      { name: 'Country Guesser', id: 'country-guesser' }
    ];

    this.init();
  }

  init() {
    this.createButtons();
    this.setupEventListeners();
  }

  createButtons() {
    console.log('Creating buttons in container:', this.container);

    this.container.innerHTML = `
      <div class="keycap-buttons">
        <div class="keycap-button keycap-button--games" id="gamesButton">
          <span class="keycap-button__label">Games</span>
          <div class="games-dropdown" id="gamesDropdown">
            ${this.games.map(game => `
              <button class="game-option" data-game="${game.id}">
                ${game.name}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="keycap-button-wrapper">
          <div class="keycap-button keycap-button--links" id="linksButton">
            <span class="keycap-button__label">Links</span>
          </div>
          <canvas class="newtons-cradle-canvas" id="cradleCanvas" width="280" height="200"></canvas>
        </div>
      </div>
    `;

    console.log('Buttons HTML created');

    // Initialize Newton's Cradle
    setTimeout(() => {
      const canvas = document.getElementById('cradleCanvas');
      console.log('Canvas element:', canvas);
      if (canvas) {
        try {
          this.cradle = new NewtonsCradle(canvas, this.links);
          console.log('Newton\'s Cradle initialized');
        } catch (err) {
          console.error('Failed to initialize Newton\'s Cradle:', err);
        }
      } else {
        console.error('Canvas element not found!');
      }
    }, 100);
  }

  setupEventListeners() {
    setTimeout(() => {
      const gamesButton = document.getElementById('gamesButton');
      const linksButton = document.getElementById('linksButton');
      const gamesDropdown = document.getElementById('gamesDropdown');
      const canvas = document.getElementById('cradleCanvas');

      console.log('Setting up event listeners...', { gamesButton, linksButton, canvas });

      if (gamesButton) {
        // Games button toggle
        gamesButton.addEventListener('click', (e) => {
          if (e.target.closest('.game-option')) return;

          this.isDropdownOpen = !this.isDropdownOpen;
          gamesDropdown.classList.toggle('active', this.isDropdownOpen);
          gamesButton.classList.toggle('active', this.isDropdownOpen);
          console.log('Games dropdown toggled:', this.isDropdownOpen);
        });
      }

      // Game option clicks
      document.querySelectorAll('.game-option').forEach(option => {
        option.addEventListener('click', (e) => {
          const gameId = e.target.dataset.game;
          this.launchGame(gameId);
          this.isDropdownOpen = false;
          gamesDropdown.classList.remove('active');
          gamesButton.classList.remove('active');
        });
      });

      // Close dropdowns when clicking outside
      document.addEventListener('click', (e) => {
        if (gamesButton && !gamesButton.contains(e.target) && this.isDropdownOpen) {
          this.isDropdownOpen = false;
          gamesDropdown.classList.remove('active');
          gamesButton.classList.remove('active');
        }
      });

      // Handle window resize
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          if (this.cradle) {
            this.cradle.resize();
          }
        }, 250);
      });
    }, 150);
  }

  launchGame(gameId) {
    console.log(`Launching game: ${gameId}`);
    // TODO: Implement game launching logic
    // This will be connected to the game modules when they're implemented
    alert(`Game "${gameId}" will be implemented soon!`);
  }

  cleanup() {
    if (this.cradle) {
      this.cradle.cleanup();
    }
  }
}
