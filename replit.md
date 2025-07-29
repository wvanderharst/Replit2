# Math Learning Application

## Overview

This is a modern web application designed for interactive math learning, specifically focused on solving equations with step-by-step guidance. The application provides a visual workspace where students can practice solving linear equations with real-time feedback, hints, and validation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with custom design tokens and dark mode support

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Centralized error middleware with structured error responses
- **Development**: Hot module replacement and automatic restarts

### Data Storage Strategy
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless driver
- **Schema**: Shared schema definitions between client and server
- **Validation**: Zod schemas for runtime type validation
- **Migrations**: Drizzle Kit for database schema management

## Key Components

### Math Engine (`client/src/lib/math-engine.ts`)
Core mathematical operations and validation logic:
- Equation parsing and transformation
- Step-by-step solution generation
- Operation validation (add, subtract, multiply, divide, distribute, combine)
- Fraction handling and LCD calculations
- Real-time preview of mathematical operations

### Interactive Workspace Components
- **Equation Workspace**: Main area for equation manipulation with preview mode
- **Step Tracker**: Progress visualization with completion status
- **Visual Balance**: Equation balance visualizer showing left/right side equality
- **Hint Panel**: Context-aware hints based on current step and equation state
- **Operation Buttons**: Available mathematical operations with operand input

### Mobile-First Design
- **Responsive Layout**: Mobile-optimized with bottom navigation bar
- **Touch-Friendly**: Large buttons and intuitive gesture support
- **Adaptive Views**: Different layouts for mobile vs desktop experiences

## Data Flow

### Session Management
1. **Problem Selection**: Fetch math problems by type (linear equations, quadratic, etc.)
2. **Session Creation**: Initialize new math session with problem metadata
3. **Step Tracking**: Real-time updates of student progress and completed steps
4. **Validation**: Server-side validation of mathematical operations
5. **Persistence**: Session state saved for resume capability

### User Interaction Flow
1. Student selects equation type and difficulty
2. System generates step-by-step solution with hints
3. Student performs operations with real-time preview
4. System validates each step and provides feedback
5. Progress tracking with visual indicators
6. Completion detection and success feedback

## External Dependencies

### UI and Styling
- **Radix UI**: Accessible component primitives (dialogs, dropdowns, etc.)
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Modern icon library
- **Class Variance Authority**: Type-safe CSS class management

### Data Management
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management with validation
- **Zod**: Runtime type validation and schema definition
- **Date-fns**: Date manipulation utilities

### Development Tools
- **Vite**: Build tool with plugin ecosystem
- **TypeScript**: Static type checking
- **ESBuild**: Fast JavaScript bundler for production
- **PostCSS**: CSS processing with Autoprefixer

## Deployment Strategy

### Build Process
- **Client Build**: Vite builds React application to `dist/public`
- **Server Build**: ESBuild bundles Node.js server to `dist/index.js`
- **Static Assets**: Served from built client directory
- **Environment**: Production/development environment detection

### Database Setup
- **Schema Management**: Drizzle Kit handles migrations and schema updates
- **Connection**: PostgreSQL via Neon serverless for scalability
- **Environment Variables**: Database URL configured via environment

### Development Workflow
- **Hot Reload**: Vite middleware integrated with Express for seamless development
- **Type Safety**: Shared TypeScript types between client and server
- **Error Boundaries**: Development error overlays for debugging
- **Logging**: Structured request/response logging for API endpoints

The application prioritizes educational effectiveness through interactive learning, real-time feedback, and progressive difficulty. The architecture supports scalability while maintaining simplicity for educational content delivery.