# Vo Thien Duy - FE Test

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
- 📊 Data table with infinite scroll
- 🔍 Real-time search and sorting
- ✏️ Inline editing capabilities
- ➕ Add/delete row functionality

## 📋 Technical Decisions & Trade-offs Summary

### 🏗️ **Architecture Decisions**

#### **State Management: Zustand vs Redux/Context**

- ✅ **Chosen**: Zustand for simplicity
- ✅ **Trade-off**: Less boilerplate, easier for junior developers
- ❌ **Trade-off**: Less ecosystem/devtools than Redux

#### **Data Strategy: Client-side Pagination vs Server-side**

- ✅ **Chosen**: Fetch-once + client-side pagination
- ✅ **Trade-off**: Fast subsequent loads, offline capability
- ❌ **Trade-off**: Initial 5MB download, memory usage for large datasets

#### **Infinite Scroll vs Traditional Pagination**

- ✅ **Chosen**: Infinite scroll only (removed load-more button)
- ✅ **Trade-off**: Modern UX, seamless browsing
- ❌ **Trade-off**: Harder to reach specific pages, performance with very large lists

### 🎨 **UI/UX Decisions**

#### **Inline Editing vs Modal Forms**

- ✅ **Chosen**: Inline editing with click-to-edit
- ✅ **Trade-off**: Faster workflow, less context switching
- ❌ **Trade-off**: Limited space for complex validation messages

#### **Optimistic Updates vs Pessimistic**

- ✅ **Chosen**: Optimistic updates (immediate UI feedback)
- ✅ **Trade-off**: Feels faster, better UX
- ❌ **Trade-off**: Need rollback logic if operations fail

#### **Visual Indicators for New Rows**

- ✅ **Chosen**: Blue highlighting + "NEW" badges
- ✅ **Trade-off**: Clear visual feedback
- ❌ **Trade-off**: More complex CSS, temporary visual inconsistency

### 🔧 **Implementation Trade-offs**

#### **TypeScript Strictness**

- ✅ **Chosen**: Strict TypeScript configuration
- ✅ **Trade-off**: Catch errors early, better IDE support
- ❌ **Trade-off**: More initial development time

#### **Component Granularity**

- ✅ **Chosen**: Small, focused components (EditableCell, StatusBadge)
- ✅ **Trade-off**: Reusable, testable, maintainable
- ❌ **Trade-off**: More files to manage

#### **Search/Sort: Client-side vs Server-side**

- ✅ **Chosen**: Client-side filtering/sorting
- ✅ **Trade-off**: Instant results, works offline
- ❌ **Trade-off**: Limited to cached dataset, memory intensive

### 📊 **Performance Considerations**

#### **Bundle Size vs Feature Richness**

- ✅ **Chosen**: Radix UI + Tailwind (larger bundle)
- ✅ **Trade-off**: Professional components, consistent design
- ❌ **Trade-off**: Larger initial download

#### **Memory vs Network**

- ✅ **Chosen**: Cache full dataset in memory
- ✅ **Trade-off**: Fast subsequent operations
- ❌ **Trade-off**: Higher memory usage, not suitable for huge datasets

### 🎯 **Key Simplifications for Junior Developers**

1. **Single Store Pattern**: All data logic in one Zustand store
2. **No Complex Async**: Simple function calls instead of promises/async-await in components
3. **Clear Naming**: Functions like `addNewRecord()`, `updateRecord()`, `deleteRecord()`
4. **Minimal Props Drilling**: Zustand hooks eliminate prop passing
5. **Consistent Patterns**: Same edit pattern for all fields

### ⚖️ **Major Trade-offs Summary**

| Decision             | Pro                      | Con                                |
| -------------------- | ------------------------ | ---------------------------------- |
| Client-side data     | Fast, offline-capable    | Memory usage, initial load time    |
| Infinite scroll only | Modern UX                | Hard to navigate to specific items |
| Zustand over Redux   | Simple, less boilerplate | Smaller ecosystem                  |
| Inline editing       | Fast workflow            | Limited validation space           |
| Optimistic updates   | Feels responsive         | Need error handling                |

**Overall Philosophy**: Prioritized **developer experience** and **user experience** over maximum performance and scalability, making it ideal for medium-sized datasets with teams that include junior developers.

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
