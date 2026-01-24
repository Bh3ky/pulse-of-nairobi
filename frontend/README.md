# Pulse of Nairobi - Frontend

A Next.js application using the App Router for scrollytelling visualization of Nairobi's urban stress as a living organism.

## Project Structure

```
frontend/
├── components.json          # shadcn/ui configuration
├── eslint.config.mjs        # ESLint configuration
├── next-env.d.ts           # Next.js TypeScript declarations
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies and scripts
├── postcss.config.js       # PostCSS configuration for Tailwind
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── docs/                   # Frontend documentation
│   └── 24-HOUR-CYCLE-UI.md # UI design specifications
├── public/                 # Static assets
│   └── images/            # Image assets for the scrollytelling
├── src/                   # Source code
│   ├── app/               # Next.js App Router pages and layouts
│   │   ├── globals.css    # Global CSS styles
│   │   ├── layout.tsx     # Root layout component
│   │   ├── manifest.webmanifest # PWA manifest
│   │   ├── page.module.css # Page-specific styles
│   │   ├── page.tsx       # Home page component
│   │   └── hooks/         # Custom React hooks
│   │       ├── use-scroll-section.ts  # Scroll section management
│   │       ├── useOncePerSession.tsx  # Session-based state
│   │       └── useParallax.tsx        # Parallax effects
│   ├── components/        # Reusable React components
│   │   ├── Header.module.css # Header component styles
│   │   ├── Header.tsx     # Site header component
│   │   ├── IntroText.tsx  # Introduction text component
│   │   ├── OnboardingLoader.tsx # Loading/onboarding component
│   │   ├── ParallaxHero.tsx # Hero section with parallax
│   │   ├── ScrollyStory.module.css # ScrollyStory styles
│   │   ├── scrollystory/  # Scrollytelling-specific components
│   │   │   ├── final-narrative.tsx # End-of-story narrative
│   │   │   ├── ScrollyStory.tsx    # Main scrollytelling component
│   │   │   ├── sticky-clock.tsx    # Clock component that sticks
│   │   │   ├── time-section.tsx    # Individual time period sections
│   │   │   └── vitals-dashboard.tsx # City vitals display
│   │   └── ui/           # UI component library (shadcn/ui)
│   │       └── card.tsx  # Card component
│   ├── lib/              # Utility libraries
│   │   ├── utils.ts      # General utility functions
│   │   ├── data/         # Static data files
│   │   │   └── time-slots.ts # Time slot configurations
│   │   └── types/        # TypeScript type definitions
│   │       └── scrollystory.ts # ScrollyStory type definitions
│   ├── types/            # Additional type definitions
│   │   ├── react-scrollama.d.ts # Scrollama library types
│   │   └── vitals.ts     # City vitals type definitions
│   └── utils/            # Utility functions
│       └── time.ts       # Time-related utilities
```

## Key Components

### App Router Structure
- **`app/layout.tsx`**: Root layout with global providers and metadata
- **`app/page.tsx`**: Main page implementing the scrollytelling experience
- **`app/hooks/`**: Custom hooks for scroll management, parallax, and session state

### Scrollytelling System
- **`ScrollyStory.tsx`**: Main container using Scrollama for scroll-triggered animations
- **`time-section.tsx`**: Individual sections for each hour/time period
- **`sticky-clock.tsx`**: Animated clock that updates based on scroll position
- **`vitals-dashboard.tsx`**: Displays city vitals (traffic, air quality, etc.)
- **`final-narrative.tsx`**: Concluding narrative section

### Data Flow
- Fetches 24-hour timeline from backend API (`/api/vitals`)
- Maps urban data to physiological metaphors (traffic→arteries, air quality→lungs)
- Uses D3.js for data visualizations and Scrollama for scroll interactions

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Runs on [http://localhost:3000](http://localhost:3000)

### Build
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## Technologies

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with CSS Modules
- **Visualization**: D3.js for data visualization
- **Scroll Interactions**: Scrollama for scrollytelling
- **Animations**: Framer Motion
- **UI Components**: shadcn/ui with Radix UI
- **Icons**: Lucide React

## Architecture Notes

- Uses CSS Modules for component-scoped styling
- Custom hooks in `/app/hooks/` for reusable logic
- Type definitions centralized in `/lib/types/` and `/types/`
- Static data in `/lib/data/` for time slots and configurations
- Backend API integration assumes FastAPI server running on port 8000
