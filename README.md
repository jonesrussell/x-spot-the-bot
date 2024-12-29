# Edge Extension with TypeScript + Vite

A modern browser extension built with TypeScript and Vite, targeting Microsoft Edge.

## Features

- 🚀 Built with TypeScript and Vite for optimal development experience
- ⚡️ Fast development and build times
- 🔒 Follows Manifest V3 specifications
- 🎯 Edge browser extension APIs support
- 📦 Modern build tooling and optimization

## Prerequisites

- Node.js (v16 or higher)
- Microsoft Edge browser
- pnpm (recommended) or npm

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <your-repo-name>
```

2. Install dependencies:
```bash
pnpm install
```

## Development

Start the development server:
```bash
pnpm dev
```

### Loading the extension in Edge

1. Open Edge and navigate to `edge://extensions`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `dist` folder from this project

The extension will automatically reload when you make changes.

## Building for Production

Build the extension:
```bash
pnpm build
```

The built extension will be in the `dist` folder.

## Project Structure

```
├── src/
│   ├── background/     # Background scripts
│   ├── content/        # Content scripts
│   ├── popup/         # Popup UI
│   └── types/         # TypeScript type definitions
├── public/            # Static assets
├── manifest.json      # Extension manifest
├── vite.config.ts     # Vite configuration
└── tsconfig.json      # TypeScript configuration
```

## Development Notes

- Background scripts run persistently in the extension context
- Content scripts are injected into web pages
- Popup scripts handle the extension's UI
- Use the `.cursorrules` file for AI-assisted development

## Security

This extension follows security best practices:
- Content Security Policy (CSP) implementation
- Minimal required permissions
- Secure communication between extension components

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
