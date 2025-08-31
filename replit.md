# Overview

LUCIFERTIPP is a premium sports betting tips platform that provides expert analysis, betting recommendations, and performance tracking for various sports. The application features a subscription-based model with multiple tiers (free, basic, pro, VIP) and includes comprehensive user authentication, tip management, and analytics capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built with React and TypeScript using a modern component-based architecture:

- **UI Framework**: React with TypeScript for type safety and better developer experience
- **Styling**: Tailwind CSS with a custom design system using CSS variables for theming
- **Component Library**: Shadcn/ui components built on Radix UI primitives for accessibility and consistency
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

The application follows a page-based routing structure with shared layout components and implements conditional rendering based on authentication status.

## Backend Architecture

The backend uses Node.js with Express in a RESTful API pattern:

- **Runtime**: Node.js with ESM modules for modern JavaScript features
- **Framework**: Express.js for HTTP server and middleware handling
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: OpenID Connect with Replit's authentication service
- **Session Management**: Express sessions with PostgreSQL storage
- **API Structure**: RESTful endpoints organized by resource type (auth, tips, user stats)

The server implements middleware for request logging, authentication verification, and error handling.

## Data Storage Solutions

**Primary Database**: PostgreSQL with connection pooling via Neon serverless
- User profiles and subscription management
- Sports betting tips with metadata (sport, league, odds, analysis)
- User tip history and following relationships
- Session storage for authentication

**Database Schema Design**:
- Users table with subscription tiers and admin privileges
- Tips table with enumerated sports, status tracking, and plan restrictions
- User tip history for tracking followed tips and performance
- Sessions table for secure authentication state

## Authentication and Authorization

**Authentication Provider**: Replit OpenID Connect integration
- OAuth2 flow with automatic user provisioning
- Session-based authentication with secure cookies
- Profile synchronization with Replit user data

**Authorization Levels**:
- Public access for landing pages and basic tip viewing
- Authenticated users for full platform features
- Subscription-based content restrictions (free, basic, pro, VIP)
- Admin privileges for tip management and platform administration

## External Dependencies

**Database Services**:
- Neon PostgreSQL for serverless database hosting
- Connection pooling for efficient database access

**Authentication Services**:
- Replit OpenID Connect for user authentication
- Automatic user profile synchronization

**Development and Build Tools**:
- Vite for frontend build tooling and development server
- ESBuild for server-side bundling
- TypeScript compiler for type checking
- Drizzle Kit for database migrations and schema management

**UI and Styling**:
- Radix UI primitives for accessible component foundations
- Tailwind CSS for utility-first styling
- Google Fonts integration for typography
- Lucide React for consistent iconography

**Runtime Dependencies**:
- WebSocket support for real-time features (via ws package)
- Date manipulation utilities (date-fns)
- Form validation and parsing (Zod)
- HTTP client utilities for API communication