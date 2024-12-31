# X Spot The Bot

A browser extension that helps identify potential bot accounts in X (Twitter) notifications using behavioral analysis.

## Features

- Real-time bot detection in notifications
- Profile analysis based on behavioral patterns
- Local history tracking of suspicious accounts
- Non-intrusive UI indicators
- Privacy-focused design

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
  content/         # Content scripts
  services/        # Core functionality
  types/           # TypeScript definitions
  icons/           # Extension icons
scripts/           # Build utilities
```

## Technical Details

- TypeScript (es2022 modules)
- Edge extension APIs
- Vite for bundling
- MutationObserver for DOM monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT
