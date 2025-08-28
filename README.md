# vothienduy_assignment

A modern React 19 application built with TypeScript and Tailwind CSS.

## Tech Stack

- **React 19** - Latest version of React with new features
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server

## Getting Started

### Prerequisites

- Node.js (version 20.19.0 or higher, or 22.12.0+)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Building for Production

Build the project for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── assets/          # Static assets
├── components/      # Reusable components
├── App.tsx         # Main application component
├── main.tsx        # Application entry point
└── index.css       # Global styles with Tailwind directives
```

## Features

- ⚡ Fast development with Vite
- 🎨 Beautiful UI with Tailwind CSS
- 📝 Type safety with TypeScript
- 🔥 Hot Module Replacement (HMR)
- 📱 Responsive design
- 🧹 Code linting with ESLint

## Learn More

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vite.dev/)
  {
  files: ['**/*.{ts,tsx}'],
  extends: [
  // Other configs...
  // Enable lint rules for React
  reactX.configs['recommended-typescript'],
  // Enable lint rules for React DOM
  reactDom.configs.recommended,
  ],
  languageOptions: {
  parserOptions: {
  project: ['./tsconfig.node.json', './tsconfig.app.json'],
  tsconfigRootDir: import.meta.dirname,
  },
  // other options...
  },
  },
  ])

```

```
