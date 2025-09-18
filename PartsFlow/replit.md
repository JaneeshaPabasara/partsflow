# Replit.md

## Overview

HV Parts Manager is a comprehensive spare parts inventory management system built as a full-stack web application. The system provides complete inventory tracking capabilities including parts management, supplier relationships, stock movements, and reporting functionality. It's designed for businesses that need to maintain and track spare parts inventory with features like low stock alerts, detailed reporting, and supplier management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) v5 for server state management and caching
- **UI Framework**: Radix UI components with shadcn/ui design system for consistent, accessible interfaces
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **Form Handling**: React Hook Form with Zod validation for robust form management
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript throughout the stack for type consistency
- **Database ORM**: Drizzle ORM for type-safe database operations and schema management
- **API Design**: RESTful endpoints following conventional patterns (/api/parts, /api/suppliers, etc.)
- **Error Handling**: Centralized error middleware with structured error responses
- **Development**: Hot module replacement with Vite integration for seamless development experience

### Database Design
- **Database**: PostgreSQL with Neon serverless hosting
- **Schema Management**: Drizzle Kit for migrations and schema evolution
- **Core Tables**:
  - Parts: Main inventory items with quantities, pricing, and stock levels
  - Categories: Hierarchical organization of parts
  - Suppliers: Vendor management and contact information
  - Movements: Stock transaction history (in/out movements)
- **Relationships**: Foreign key constraints between parts-categories, parts-suppliers, and movements-parts
- **Data Integrity**: Unique constraints on part numbers and category names

### Key Features Architecture
- **Inventory Management**: CRUD operations for parts with automatic stock status calculation
- **Stock Tracking**: Movement-based inventory system with audit trails
- **Search & Filtering**: Real-time search across part names, numbers, and descriptions
- **Low Stock Alerts**: Automatic detection based on minimum stock thresholds
- **Reporting System**: PDF and CSV export capabilities using jsPDF and custom CSV generators
- **Responsive Design**: Mobile-first approach with adaptive layouts

### Development Patterns
- **Type Safety**: Shared TypeScript schemas between frontend and backend using Drizzle-Zod
- **Component Architecture**: Modular React components with clear separation of concerns
- **Data Fetching**: Optimistic updates and background refetching with React Query
- **Form Validation**: Schema-based validation with user-friendly error messages
- **Code Organization**: Feature-based folder structure with shared utilities

## External Dependencies

### Database & ORM
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database operations with schema introspection
- **Drizzle Kit**: Migration management and database schema tools

### UI & Design System
- **Radix UI**: Accessible, unstyled UI primitives for complex components
- **shadcn/ui**: Pre-built component library based on Radix UI
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Consistent icon library for UI elements

### Form & Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: TypeScript-first schema validation for forms and API data
- **@hookform/resolvers**: Integration layer between React Hook Form and Zod

### Development & Build Tools
- **Vite**: Fast build tool with HMR and optimized production builds
- **TypeScript**: Static type checking across the entire application
- **ESBuild**: Fast JavaScript bundler for server-side code
- **PostCSS**: CSS processing with Tailwind CSS integration

### Data Management
- **TanStack Query**: Server state management with caching and synchronization
- **Date-fns**: Date manipulation and formatting utilities

### Document Generation
- **jsPDF**: Client-side PDF generation for reports
- **jsPDF-AutoTable**: Table generation plugin for structured PDF reports

### Development Environment
- **Replit**: Cloud-based development environment with live reloading
- **TSX**: TypeScript execution for development server
- **Connect-PG-Simple**: PostgreSQL session store for potential authentication