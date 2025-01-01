# Development Guide

## Setup

1. **Prerequisites**
   - Node.js v22.12.0 or higher
   - TypeScript ~5.5.3
   - Edge browser for testing

2. **Installation**
   ```bash
   # Clone repository
   git clone https://github.com/your-username/x-spot-the-bot.git
   cd x-spot-the-bot

   # Install dependencies
   npm install

   # Build extension
   npm run build
   ```

## Development Workflow

1. **Development Mode**
   ```bash
   # Start development server
   npm run dev

   # Watch mode with auto-reload
   npm run dev:watch
   ```

2. **Testing**
   ```bash
   # Run all tests
   npm run test

   # Run tests in watch mode
   npm run test:watch

   # Run tests with coverage
   npm run test:coverage
   ```

3. **Code Quality**
   ```bash
   # Format code
   npm run format

   # Lint code
   npm run lint

   # Type check
   npm run typecheck

   # Run all checks
   npm run check
   ```

## Code Standards

### TypeScript

1. **File Organization**
   - One class per file
   - Clear file naming
   - Consistent directory structure
   - Related files grouped together

2. **Imports/Exports**
   ```typescript
   // Type-only imports
   import type { ProfileData } from '../types/profile.js';

   // ESM imports with .js extension
   import { DOMExtractor } from './dom/dom-extractor.js';

   // Named exports preferred
   export class ProfileAnalyzer { }
   ```

3. **Class Structure**
   ```typescript
   export class ServiceName {
     // Private fields with #
     readonly #config = { };
     
     // Public methods first
     public methodName(): void { }
     
     // Private methods last
     #helperMethod(): void { }
   }
   ```

### Testing

1. **Test Structure**
   ```typescript
   describe('ServiceName', () => {
     let service: ServiceName;

     beforeEach(() => {
       service = new ServiceName();
     });

     describe('methodName', () => {
       it('should describe expected behavior', () => {
         // Arrange
         const input = '';

         // Act
         const result = service.methodName(input);

         // Assert
         expect(result).toBeDefined();
       });
     });
   });
   ```

2. **Test Helpers**
   ```typescript
   // DOM helpers
   import { createNotificationCell } from '../../../test/helpers/dom.js';

   // Test fixtures
   import { mockProfiles } from '../../../test/fixtures/profiles.js';
   ```

### UI Components

1. **Component Structure**
   ```typescript
   export class ComponentName {
     readonly #element: HTMLElement;
     
     constructor() {
       this.#element = this.#createElement();
     }
     
     #createElement(): HTMLElement {
       const el = document.createElement('div');
       // Add attributes, styles, etc.
       return el;
     }
   }
   ```

2. **Styling**
   ```css
   /* Use namespaced classes */
   .xbd-component-name { }

   /* High specificity selectors */
   .xbd-component-name[data-theme="dark"] { }

   /* Important rules when needed */
   .xbd-warning { color: red !important; }
   ```

### Error Handling

1. **Service Errors**
   ```typescript
   try {
     const result = await service.method();
   } catch (error) {
     console.error('[XBot:Service] Error:', error);
     return null;
   }
   ```

2. **DOM Operations**
   ```typescript
   const element = document.querySelector('[data-testid="id"]');
   if (!element) {
     console.warn('[XBot:DOM] Element not found');
     return;
   }
   ```

## Git Workflow

1. **Branches**
   - `main`: Production-ready code
   - `develop`: Development branch
   - `feature/*`: New features
   - `fix/*`: Bug fixes
   - `refactor/*`: Code improvements

2. **Commits**
   ```
   type(scope): description

   - feat: New feature
   - fix: Bug fix
   - refactor: Code improvement
   - test: Test updates
   - docs: Documentation
   ```

3. **Pull Requests**
   - Clear title and description
   - Reference issues
   - Include tests
   - Update documentation

## Release Process

1. **Version Update**
   ```bash
   npm version patch|minor|major
   ```

2. **Build & Test**
   ```bash
   npm run build
   npm run test
   ```

3. **Manual Testing**
   - Load in Edge
   - Test core features
   - Check performance
   - Verify UI/UX

4. **Release**
   - Update CHANGELOG.md
   - Create GitHub release
   - Tag version
   - Update Edge store 