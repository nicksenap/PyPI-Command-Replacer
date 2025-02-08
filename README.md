# PyPI Command Replacer

A Chrome extension that enhances PyPI.org package installation commands by adding support for different Python package managers.

## Features

- Replaces pip install commands with your preferred package manager:
  - pip (default)
  - uv
  - pipenv
  - poetry
- Optional development dependency toggle
- Remembers your preferences
- Dark mode support

## Development

This project is built with:
- React
- TypeScript
- Vite
- Chrome Extension APIs

### Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `build` directory

### Building

To build the extension:

```bash
npm run build
```

The built extension will be in the `build` directory.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
