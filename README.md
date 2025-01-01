# X Spot The Bot

A browser extension that helps identify potential bot accounts in X (Twitter) notifications using behavioral analysis.

## Features

- Real-time bot detection in notifications
- Live summary panel showing bot detection statistics
- Profile analysis based on behavioral patterns:
  * Username patterns (random alphanumeric, bot keywords, numeric patterns)
  * Profile completeness (followers/following ratio)
  * Account verification status
- Local history tracking of suspicious accounts
- Non-intrusive UI indicators:
  - 🤖 Red - High probability bot (>=60%)
  - ⚠️ Orange - Medium probability bot (30-59%)
  - ✓ Green - Likely real account (<30%)
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

## Usage

1. Open X (Twitter) notifications
2. The extension will automatically:
   - Show a summary panel at the top with live statistics
   - Analyze each notification for bot patterns
   - Display indicators next to usernames
   - Track counts of detected bots
3. Hover over indicators to see detection reasons
4. Filter console logs with `[XBot:Analyzer]` to see detailed results

## Project Structure

```
src/
  ├── content/         # Content scripts
  │   └── index.ts    # Main extension entry point
  ├── services/       # Core functionality
  │   ├── analysis/   # Bot detection services
  │   │   ├── pattern-matcher.ts
  │   │   ├── profile-analyzer.ts
  │   │   └── score-calculator.ts
  │   ├── dom/        # DOM operations
  │   │   ├── dom-extractor.ts
  │   │   └── element-extractor.ts
  │   ├── ui/         # UI components
  │   │   ├── components/
  │   │   ├── styles/
  │   │   ├── style-manager.ts
  │   │   └── theme-manager.ts
  │   ├── feed/       # Feed monitoring
  │   ├── notification/ # Notification handling
  │   └── storage.ts  # Data persistence
  ├── test/          # Test utilities
  │   ├── fixtures/  # Test data
  │   └── helpers/   # Test helpers
  ├── types/         # TypeScript definitions
  └── icons/         # Extension icons
```

## Technical Details

- TypeScript with strict type checking
- ES2022 modules with proper ESM imports
- Edge extension APIs (chrome.* namespace)
- Vite for bundling and development
- Vitest for testing with DOM support
- MutationObserver for DOM monitoring
- Type-safe DOM operations
- Comprehensive test coverage
- CSS Architecture:
  * CSS modules for component styles
  * CSS variables for theming
  * Mobile-first responsive design
  * BEM-like naming (.xbd-component-element)
  * Dark mode media queries
  * Important rules for X overrides
  * z-index management for overlays
  * Flexbox-based layouts

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

## Bot Detection Patterns

The extension uses multiple patterns to identify potential bots:

1. Username Analysis:
   - Random alphanumeric (0.3): `^[a-z0-9]{8,}$`
   - Many numbers (0.2): `[0-9]{4,}`
   - Bot keywords (0.3): `bot|spam|[0-9]+[a-z]+[0-9]+`
   - Random/numeric suffix (0.2): `[a-z]+[0-9]{4,}$`

2. Profile Analysis:
   - No followers/following
   - High following to followers ratio
   - Display name matches username
   - Verification status

3. Score Calculation:
   - Pattern matching scores
   - Profile completeness factors
   - Capped probability (0.8 max)
   - Threshold-based analysis

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the development guide in `docs/DEVELOPMENT.md`
4. Ensure all tests pass with `npm run check`
5. Submit a pull request

## License

MIT
