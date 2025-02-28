# CLAUDE.md - Coding Guidelines

## Build Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Code Style Guidelines

### Components
- Use functional components with hooks
- Component files use PascalCase (.jsx extension)
- Export components directly (not default) when used as subcomponents

### Imports
- React imports first, then libraries, then local modules
- Use absolute imports with @ alias for src directory (e.g., `@/components/Scene`)

### Naming Conventions
- PascalCase for components and classes
- camelCase for variables, functions, and instances
- UPPERCASE_SNAKE_CASE for constants

### Three.js & 3D Development
- Group 3D objects in logical hierarchies
- Keep physics calculations and rendering logic separated
- Use useRef for Three.js object references
- Cleanup effects with proper disposal

### Error Handling
- Use try/catch blocks for asynchronous operations
- Implement graceful fallbacks for failed resource loading

### Performance
- Use React.memo when needed for expensive components
- Implement useMemo for expensive calculations
- Use useCallback for functions passed to child components