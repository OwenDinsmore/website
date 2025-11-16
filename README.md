# Terminal Portfolio

A terminal-themed portfolio website featuring scroll-driven animations, interactive 3D globe, and modern web technologies.

## Tech Stack

- **Vanilla JavaScript** - No framework overhead, maximum performance
- **Vite** - Modern build tool with fast HMR
- **Three.js** - 3D globe visualization
- **GSAP + ScrollTrigger** - Smooth scroll-driven animations
- **Fira Code** - Beautiful monospace font

## Project Structure

```
website/
├── src/
│   ├── styles/
│   │   └── main.css          # Main stylesheet with design system
│   └── main.js                # Main JavaScript entry point
├── index.html                 # Main HTML file
├── vite.config.js             # Vite configuration
├── package.json               # Dependencies
└── README.md                  # This file
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

This will start the Vite dev server at `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Features

### Phase 1 (Current): Structure ✅
- Semantic HTML with accessibility features
- CSS custom properties for design system
- Mobile-first responsive layout
- Terminal window styling
- Sections: Landing, Globe, Content, Skills, Footer

### Phase 2 (Next): Animation Infrastructure
- GSAP with ScrollTrigger configuration
- Smooth scroll library integration
- Animation utility functions
- Performance monitoring

### Phase 3: Individual Animations
- Typewriter effects
- Scroll-triggered animations
- Card expansions
- Stagger animations

### Phase 4: 3D Globe
- Three.js scene setup
- Rolling globe animation
- ScrollTrigger integration
- Performance optimizations

## Terminal Commands

Type these commands in the hanging terminal:
- `contacts` - Display contact cards
- `resume` - Download resume
- `clear` - Clear terminal output
- `help` - Show available commands

## Customization

### Update Personal Information

1. **HTML** (`index.html`):
   - Update name in `.name-display`
   - Update contact links in `.contact-cards`
   - Add your education, experience, and projects in respective sections

2. **JavaScript** (`src/main.js`):
   - Update typewriter text in the init function
   - Update resume path in `showResume()` method

3. **CSS** (`src/styles/main.css`):
   - Adjust colors in `:root` custom properties
   - Modify spacing, typography, and layout variables

## Performance

- Lighthouse score target: >90
- Bundle size target: <200KB (gzipped)
- Smooth 60fps animations
- Respects `prefers-reduced-motion`
- Progressive enhancement

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this template for your own portfolio!

## Next Steps

After reviewing Phase 1, we'll proceed to Phase 2 to add animation infrastructure.
