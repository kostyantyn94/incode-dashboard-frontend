# Incode Dashboard - Frontend

A modern, responsive task management application built with React 19 and TypeScript. Features a Kanban-style board with drag-and-drop functionality for organizing tasks across three columns: To Do, In Progress, and Done.

## Features

- **Kanban Board Interface**: Intuitive drag-and-drop task management
- **Task Management**: Create, edit, delete, and reorder tasks
- **Task Properties**:
  - Title and description
  - Priority levels (Low, Medium, High)
  - Due dates with overdue indicators
  - Status tracking (To Do, In Progress, Done)
- **Dashboard Management**: Create multiple dashboards with shareable hashed URLs
- **Recent Dashboards**: Quick access to recently visited boards
- **Real-time Updates**: Automatic UI updates with RTK Query caching
- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Accessibility**: ARIA labels and keyboard navigation support

## Tech Stack

### Core
- **React** 19.1.1 - UI library
- **TypeScript** 5.9.3 - Type safety
- **Vite** 7.1.7 - Build tool and dev server

### State Management
- **Redux Toolkit** 2.10.0 - State management
- **RTK Query** - Server state management with automatic caching

### Styling
- **Tailwind CSS** 4.1.16 - Utility-first CSS framework
- **PostCSS** - CSS processing

### Routing
- **React Router** 7.9.5 - Client-side routing

### UI Features
- **@dnd-kit** - Drag and drop functionality
- **React Hot Toast** - Toast notifications

### Testing
- **Vitest** 4.0.8 - Unit testing framework
- **Testing Library** - React component testing
- **jsdom** - DOM environment for testing

### Code Quality
- **ESLint** 9.39.1 - Code linting
- **Prettier** 3.6.2 - Code formatting
- **TypeScript ESLint** - TypeScript-specific linting

## Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 10.0.0

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

   For production:
   ```env
   VITE_API_URL=https://your-api-domain.com
   ```

## Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Development Features
- Hot Module Replacement (HMR)
- Fast refresh for React components
- TypeScript type checking
- ESLint error overlay

## Building for Production

Build the application for production:

```bash
npm run build
```

This command:
1. Runs TypeScript compiler in build mode (`tsc -b`)
2. Builds optimized production bundle with Vite
3. Outputs to `dist/` directory

Preview the production build locally:

```bash
npm run preview
```

## Testing

Run all tests:

```bash
npm run test
```

Run tests with UI:

```bash
npm run test:ui
```

Run tests with coverage report:

```bash
npm run test:coverage
```

### Test Coverage

- **121 tests** across 10 test suites
- Components: Button, Card, Input, IconButton
- Features: TaskCard, TaskModal, Column
- Pages: HomePage, BoardPage
- Utils: recentDashboards

## Code Quality

### Linting

Run ESLint:

```bash
npm run lint
```

### Type Checking

Check TypeScript types:

```bash
npm run build
```

TypeScript compiler will report any type errors.

## Project Structure

```
frontend/
├── src/
│   ├── components/         # Reusable UI components
│   │   └── ui/            # Base UI components (Button, Card, Input, Modal)
│   ├── features/          # Feature-based modules
│   │   ├── api/          # RTK Query base configuration
│   │   ├── boards/       # Dashboard management
│   │   │   ├── boards.api.ts       # API endpoints
│   │   │   ├── boards.types.ts     # TypeScript types
│   │   │   └── components/         # Board-specific components
│   │   └── tasks/        # Task management
│   │       ├── tasks.api.ts        # API endpoints
│   │       ├── tasks.types.ts      # TypeScript types
│   │       └── components/         # Task components
│   ├── layouts/          # Layout components
│   │   └── RootLayout.tsx         # Main app layout
│   ├── pages/            # Page components
│   │   ├── home/        # Landing page
│   │   ├── board/       # Kanban board view
│   │   └── not-found/   # 404 page
│   ├── router/          # Routing configuration
│   │   └── router.tsx
│   ├── store/           # Redux store setup
│   │   └── store.ts
│   ├── utils/           # Utility functions
│   │   └── recentDashboards.ts
│   ├── test/            # Test configuration
│   │   ├── setup.ts
│   │   └── test-utils.tsx
│   └── main.tsx         # Application entry point
├── public/              # Static assets
├── dist/                # Production build output
├── index.html           # HTML entry point
├── vite.config.ts       # Vite configuration
├── tailwind.config.ts   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
├── eslint.config.js     # ESLint configuration
└── package.json         # Dependencies and scripts
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |
| `npm run test:ui` | Run tests with UI |
| `npm run test:coverage` | Generate coverage report |

## Key Features Implementation

### Drag and Drop
Uses `@dnd-kit` library for accessible drag-and-drop:
- Drag tasks between columns to change status
- Reorder tasks within columns
- Drag overlay for visual feedback
- Optimistic UI updates

### State Management
RTK Query for server state:
- Automatic caching (60 seconds default)
- Automatic refetching on window focus
- Optimistic updates for better UX
- Tag-based cache invalidation

### Routing
React Router with path helpers:
- `/` - Home page with recent dashboards
- `/board/:boardId` - Board view with hashed ID
- Dynamic route with shareable URLs

### Recent Dashboards
LocalStorage-based tracking:
- Stores last 5 visited dashboards
- Automatic updates on board access
- Persists across sessions

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3000` |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Code splitting with React Router
- Lazy loading of routes
- Optimized bundle size
- RTK Query caching reduces API calls

## Accessibility

- Semantic HTML
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management

## Docker Support

Build Docker image:

```bash
docker build -t incode-frontend --build-arg VITE_API_URL=https://api.example.com .
```

Run container:

```bash
docker run -p 80:80 incode-frontend
```

The Dockerfile uses:
- Multi-stage build for optimized image size
- Nginx for serving static files
- Production-ready configuration

## Troubleshooting

### Port already in use
If port 5173 is taken, Vite will automatically use the next available port.

### Build fails
1. Clear node_modules: `rm -rf node_modules package-lock.json`
2. Reinstall: `npm install`
3. Rebuild: `npm run build`

### Tests fail
1. Check Node.js version: `node --version` (should be >= 18)
2. Clear Vitest cache: `npx vitest --clearCache`
3. Run tests: `npm run test`

## Contributing

1. Follow the existing code style
2. Run linter before committing: `npm run lint`
3. Write tests for new features
4. Update TypeScript types as needed

## License

ISC
