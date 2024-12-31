# X Spot The Bot

A browser extension that helps identify potential bot accounts in X (Twitter) notifications using behavioral analysis.

## Features

- Real-time bot detection in notifications
- Profile analysis based on behavioral patterns
- Local history tracking of suspicious accounts
- Non-intrusive UI indicators
- Privacy-focused design (all analysis done locally)
- Type-safe implementation with strict checks

## Development Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Load the extension in Edge:
   - Navigate to `edge://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` directory

## Project Structure

```
src/
  ├── content/         # Content scripts
  │   └── index.ts    # Main extension entry point
  ├── services/       # Core functionality
  │   ├── dom-extractor.ts    # DOM operations
  │   ├── profile-analyzer.ts # Bot detection
  │   ├── storage.ts         # Data persistence
  │   └── ui-manager.ts      # UI components
  ├── types/          # TypeScript definitions
  │   └── profile.ts  # Core type definitions
  └── icons/          # Extension icons
scripts/              # Build utilities
docs/                 # Documentation
  ├── DEVELOPMENT.md  # Development guide
  └── ARCHITECTURE.md # System architecture
```

## Technical Details

- TypeScript with strict type checking
- ES2022 modules with proper ESM imports
- Edge extension APIs (chrome.* namespace)
- Vite for bundling and development
- Jest for testing (with ESM support)
- MutationObserver for DOM monitoring
- Type-safe DOM operations
- Comprehensive test coverage

## Development Commands

```bash
# Build extension
npm run build

# Run tests
npm run test

# Development with watch mode
npm run dev

# Lint code
npm run lint

# Format code
npm run format

# Check all (format, lint, test)
npm run check
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the development guide in `docs/DEVELOPMENT.md`
4. Ensure all tests pass with `npm run check`
5. Submit a pull request

## License

MIT
