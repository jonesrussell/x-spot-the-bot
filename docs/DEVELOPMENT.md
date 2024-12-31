# Development Guide

## Setup

1. Install dependencies:
```bash
npm install
```

2. Build the extension:
```bash
npm run build
```

## Development Workflow

1. Make changes to TypeScript files in `src/`
2. Run build to compile and bundle
3. Load unpacked extension in Edge
4. Test changes in notifications page

## Important Notes

### TypeScript Configuration
- Using ES2022 modules (newest concrete version as of 2024)
- Node module resolution for development
- Strict type checking enabled

### Module Imports
- Use .js extensions for all imports
- Example: `import { StorageService } from '../services/storage.js';`

### DOM Operations
- Use data-testid attributes for element selection
- Always include null checks
- Add debug logging for development

### Bot Detection
- Implement detection logic in ProfileAnalyzer
- Document detection criteria
- Add unit tests for algorithms

## Testing

1. Build the extension
2. Load in Edge
3. Visit twitter.com/notifications
4. Check console for debug logs
5. Verify UI indicators appear

## Debugging

- Check browser console for logs
- Use debug logging in services
- Monitor network requests
- Test with known bot accounts

## Best Practices

1. Follow Single Responsibility Principle
2. Add TypeScript interfaces for data structures
3. Handle edge cases and errors
4. Document public methods
5. Use consistent naming conventions 