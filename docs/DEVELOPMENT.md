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
2. Build to compile and bundle
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
- Add debug logging with [XBot:DOM] prefix
- Handle dynamic class names by avoiding CSS class selectors

### UI Components
- Summary Panel:
  - Sticky header at top of notifications
  - Shows live bot detection statistics
  - Dark theme matching X's UI
  - Updates in real-time as notifications are processed
- Warning Indicators:
  - 🤖 Red (>=60% probability)
  - ⚠️ Orange (30-59% probability)
  - ✓ Green (<30% probability)
  - Hover to show detection reasons
- CSS Requirements:
  - Use !important for all styles
  - High z-index (9999999) to stay on top
  - Support dark/light themes
  - Maintain relative positioning

### Bot Detection
- Probability threshold: >= 0.6 for warnings
- Score components:
  - Username patterns (max 0.5)
  - No followers/following (0.3)
  - Display name similarity (0.2)
- Maximum total score: 0.9
- Avoid duplicate detections
- Skip community posts

### Debug Logging
- Use consistent prefixes:
  - [XBot:Core] - Initialization and processing
  - [XBot:DOM] - Element operations
  - [XBot:Analyzer] - Bot detection results
  - [XBot:UI] - Panel and indicator updates
- Include relevant data in logs
- Filter console by prefix for debugging

## Testing

1. Build the extension
2. Load in Edge
3. Visit twitter.com/notifications
4. Check console for debug logs
5. Verify UI indicators appear
6. Test with known bot accounts
7. Verify no duplicate warnings

## Debugging

- Check browser console for logs
- Filter console by [XBot
- Monitor extraction failures
- Check score breakdowns
- Verify pattern matches

## Best Practices

1. Follow Single Responsibility Principle
2. Add TypeScript interfaces for data structures
3. Handle edge cases and errors
4. Document public methods
5. Use consistent naming conventions
6. Add detailed debug logging
7. Avoid CSS class selectors
8. Track processed elements 