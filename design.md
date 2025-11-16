# Terminal Portfolio Website

## Core Concept
Terminal-themed resume/portfolio with scroll-driven animations

## Tech Stack
- Vanilla JS/React (specify which)
- Three.js (for 3D globe only)
- GSAP + ScrollTrigger
- [Your choice of build tool]

## Design System
### Colors
- Background: #000000 (pure black)
- Primary text: #FFFFFF, #E5E5E5 (white, light grey)
- Accents: 
  - Dark green: #114a1fff (terminal dark green)
  - Orange: #FF6B35
- Terminal cursor: blinking neon green

### Typography
- Monospace font: 'Fira Code' / 'JetBrains Mono' / 'Source Code Pro'
- Font sizes: [specify your scale]

### Animation Principles
- Smooth 60fps performance
- Scroll-driven (not auto-play)
- Stagger delays for sequential effects
- Respect prefers-reduced-motion

## Sections & Animations
- Landing Screen
    - Owen Dinsmore written similar to Claude Code, boxy, terminal style, dark green and light grey borders. Takes up a majority of space.
    - Hanging terminal at the bottom, dark green outline with dark green ">" and "scroll to continue". If clicked the terminal should bring up a small menu to prompt the user to input "contacts" where boxes will appear for linkedin, github, and email under my name and above the terminal. These should be card style. "resume" should bring up a download link for my resume.
- Globe screen
    - 1. Globe enters from bottom of the viewport 2. Rolls diagonally upward across screen (single full rotation: 360°) 3. Exits through top, completely leaving viewport 4. During animation, previous section fades out completely 5. After exit, next section fades in
- Stacking rectangles
    - Once globe leaves wide rectangular cards should 'shoot up' filling in Education (two rectangles), experience, and projects, which can be clickable and expandable to view more about it. 
- Orbit
    - two orbital graphs to display skills. The top right one (the center of the orbit is off screen, meaning it's less than a quarter of a circle for each orbit.) These lines have planets. Their should be white 'light' illuminating from that 'offscreen center' 
- footer

## Performance Requirements
- Lighthouse score >90
- Mobile responsive
- Works without JS (progressive enhancement)
```

## **2. Iterative Build Approach**

**Phase-by-phase instructions work best:**

### **Phase 1: Structure**
```
"Set up project structure with:
- Semantic HTML for accessibility
- CSS custom properties for design tokens
- Mobile-first responsive layout
- Terminal window chrome (title bar, buttons)
- Sections for: [list your sections]
Include proper meta tags and optimize for SEO."
```

### **Phase 2: Animation Infrastructure**
```
"Install and configure:
- GSAP with ScrollTrigger plugin
- Three.js (minimal bundle)
- Lenis or similar smooth scroll library

Create animation utility functions:
- setupScrollTrigger(element, config)
- createStaggerAnimation(elements, config)
- optimizeForMobile()

Add performance monitoring in dev mode."
```

### **Phase 3: Build Animations One-by-One**
```
"Implement [specific animation name]:
- Trigger: [when it should start]
- Duration: [scroll distance]
- Effect: [describe in detail]
- Easing: [specify curve]
- Mobile behavior: [how it adapts]

Ensure:
- Smooth performance (use transform/opacity only)
- Respects reduced motion preferences
- Debug markers for development"
```

### **Phase 4: The Globe**
```
"Create rolling globe effect:
- Three.js scene (canvas element)
- Low-poly sphere (32 segments max)
- Materials: [your color scheme]
- ScrollTrigger integration:
  * Enters from [position] at [scroll point]
  * Rotates [X degrees] while translating [Y distance]
  * Exits at [position] at [scroll point]
  
Optimize:
- Pause rendering when off-screen
- Use requestAnimationFrame wisely
- Dispose geometry when done"
```

## **3. UX/UI Considerations to Specify**

**Explicitly tell Claude Code:**
```
"Apply these UX principles:

ACCESSIBILITY:
- ARIA labels for animations
- Keyboard navigation works perfectly
- Focus indicators visible and styled to match theme
- Skip-to-content link
- Alt text for all visual elements

PERFORMANCE:
- Lazy load Three.js and GSAP only when needed
- Debounce scroll handlers
- Use CSS containment where possible
- Implement intersection observer for off-screen animations
- Bundle size under 200KB (gzipped)

RESPONSIVENESS:
- Breakpoints: 768px (tablet), 1024px (desktop)
- Touch-friendly tap targets (44px minimum)
- Disable complex animations on mobile if needed
- Test on actual devices, not just DevTools

TERMINAL AUTHENTICITY:
- Command prompt styling: user@portfolio:~$
- Blinking cursor effect
- Text appears with typewriter effect where appropriate
- Scanline/CRT effect optional (subtle)
- Green on black has 4.5:1 contrast minimum

SCROLL UX:
- Clear scroll affordances (subtle indicators)
- Prevent janky scroll (no scroll hijacking)
- Progress indicator
- Sections have clear visual separation
- 'Back to top' button appears after scrolling"
```

## **4. Structured Prompting Format**

**For each animation, use this template:**
```
Create [animation name] with the following specs:

TRIGGER:
- Element: [selector]
- Start: [scroll position]
- End: [scroll position]

ANIMATION:
- Properties: [transform/opacity/etc]
- From: [initial state]
- To: [final state]
- Duration: [linked to scroll distance]
- Easing: [easeOut/easeInOut/custom]

CONSIDERATIONS:
- Mobile: [how it changes on mobile]
- Performance: [use will-change, etc]
- Fallback: [what happens if JS disabled]

CODE STYLE:
- Use semantic variable names
- Add inline comments for complex logic but only for complicated lines of code
- Modular/reusable where possible
```

## **5. Testing & Polish Instructions**

**After building:**
```
"Optimize and test:

PERFORMANCE AUDIT:
- Run Lighthouse
- Check bundle size with webpack-bundle-analyzer
- Profile animations with DevTools Performance tab
- Test on throttled CPU (4x slowdown)

CROSS-BROWSER:
- Test in Chrome, Firefox, Safari
- Polyfills for older browsers if needed
- Graceful degradation strategy

REFINEMENT:
- Adjust easing curves for 'juiciness'
- Fine-tune scroll speeds
- Add micro-interactions (hover states, cursor effects)
- Easter eggs (hidden terminal commands?)

DEPLOYMENT:
- Optimize assets (imagemin, terser)
- Add service worker for offline support
- CDN for static assets
- Analytics integration"
```

## **6. Claude Code-Specific Tips**

- **Use file context:** `@file` to reference your PROJECT_BRIEF.md in every prompt
- **Iterate in small chunks:** Don't ask for everything at once
- **Request code reviews:** "Review this animation code for performance issues"
- **Ask for alternatives:** "Give me 2 options for implementing this scroll effect"
- **Debug together:** Paste error messages and ask for fixes with context

## **7. Example Master Prompt**
```
@PROJECT_BRIEF.md

Build the hero section of my terminal portfolio with these requirements:

STRUCTURE:
- Full viewport height
- Centered terminal window (800px max width)
- ASCII art logo using Figlet
- Animated typewriter text: "Hi, I'm Owen > _"
- Blinking cursor

STYLING:
- Use design tokens from PROJECT_BRIEF
- Glassmorphism effect on terminal window
- Subtle box shadow with green glow
- Scanline overlay (5% opacity)

ANIMATION:
- Logo fades in (1s delay)
- Typewriter effect (50ms per char)
- Cursor blinks at 530ms interval
- On scroll: entire section fades + scales down slightly

PERFORMANCE:
- No layout shift
- Preload critical fonts
- GPU-accelerated transforms only

ACCESSIBILITY:
- Screen reader announces text naturally
- Respects prefers-reduced-motion
- Proper heading hierarchy

Please implement with clean, intuitevley commented code and let me know if you need any clarification.