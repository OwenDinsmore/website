/**
 * ASCII Art Generator for Name Banner
 * Uses Figlet.js to create boxy ASCII art
 */

import figlet from 'figlet';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class ASCIIGenerator {
  static async generate(text, font = 'Block') {
    return new Promise((resolve, reject) => {
      figlet.text(
        text,
        {
          font: font,
          horizontalLayout: 'fitted',
          verticalLayout: 'fitted',
          width: 120,
          whitespaceBreak: true
        },
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  static async generateSplit(firstName, lastName, font = 'Block') {
    const firstLine = await this.generate(firstName, font);
    const secondLine = await this.generate(lastName, font);
    return `${firstLine}\n${secondLine}`;
  }

  static async tryFonts(text) {
    const fonts = ['Block', 'Rectangles', 'Banner3', 'ANSI Shadow'];
    const results = {};

    for (const font of fonts) {
      try {
        results[font] = await this.generate(text, font);
      } catch (err) {
        console.error(`Failed to generate with font ${font}:`, err);
        results[font] = null;
      }
    }

    return results;
  }

  static createBanner(asciiArt) {
    const banner = document.createElement('pre');
    banner.className = 'ascii-banner';
    banner.setAttribute('aria-hidden', 'true');
    banner.textContent = asciiArt;

    const container = document.createElement('div');
    container.className = 'ascii-container';

    const srText = document.createElement('span');
    srText.className = 'visually-hidden';
    srText.textContent = 'Owen Dinsmore';

    container.appendChild(srText);
    container.appendChild(banner);

    return container;
  }

  static setupScrollAnimation() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const banner = document.querySelector('.ascii-banner');
    const globeSection = document.getElementById('globe');

    if (!banner || !globeSection) return;

    gsap.to(banner, {
      y: -100,
      opacity: 0.3,
      scrollTrigger: {
        trigger: globeSection,
        start: 'top bottom',
        end: 'top center',
        scrub: 1,
      }
    });
  }

  static async initializeBanner(targetElement, text, options = {}) {
    const {
      font = 'Block',
      split = false,
      animate = true
    } = options;

    try {
      let asciiArt;

      if (split) {
        asciiArt = await this.generateSplit('OWEN', 'DINSMORE', font);
      } else {
        asciiArt = await this.generate(text, font);
      }

      const banner = this.createBanner(asciiArt);
      targetElement.innerHTML = '';
      targetElement.appendChild(banner);

      if (animate) {
        gsap.from('.ascii-banner', {
          opacity: 0,
          scale: 0.95,
          duration: 1,
          ease: 'power2.out',
          delay: 0.3
        });

        this.setupScrollAnimation();
      }

      return asciiArt;
    } catch (err) {
      console.error('Failed to initialize ASCII banner:', err);
      throw err;
    }
  }
}
