# Reminisce AI

## Overview

Reminisce AI is a healthcare platform designed to support dementia patients and their caregivers. The application provides two distinct interfaces: a Caretaker Dashboard for managing patient care (memory uploads, routine tracking, medication scheduling, emergency logs) and a Patient Interface with high-contrast, accessible UI featuring a Memory Hub, SOS alerts, and voice assistant placeholder. The platform integrates Azure AI services for image analysis and memory-sparking question generation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for transitions and effects
- **Build Tool**: Vite with HMR support

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **Authentication**: Passport.js with local strategy, session-based auth using express-session
- **Password Security**: scrypt hashing with timing-safe comparison

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Session Store**: connect-pg-simple for PostgreSQL-backed sessions
- **Schema**: Users (caretaker/patient roles with relationship), Memories, Routines, Medications, Emergency Logs

### API Design
- **Pattern**: RESTful endpoints defined in shared/routes.ts with Zod schemas
- **Validation**: Zod for both client and server-side validation
- **Data Isolation**: Role-based access control ensuring patients only see their data and caretakers only manage their assigned patients

### Role-Based Access Control
- **Caretakers**: Can manage multiple patients, upload memories, set routines and medications, view emergency logs
- **Patients**: Access their own Memory Hub, routine checklist, can trigger SOS alerts
- **Relationship**: Patients are linked to caretakers via caretakerId foreign key

## External Dependencies

### Azure Services
- **Azure Computer Vision (F0 tier)**: Analyzes uploaded images to generate descriptions and tags for memories
- **Azure OpenAI**: Generates memory-sparking questions based on image descriptions to help patients recall memories

### Required Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret for session management
- `AZURE_VISION_ENDPOINT`: Azure Computer Vision endpoint
- `AZURE_VISION_KEY`: Azure Computer Vision API key
- `AZURE_OPENAI_ENDPOINT`: Azure OpenAI endpoint
- `AZURE_OPENAI_KEY`: Azure OpenAI API key
- `AZURE_OPENAI_DEPLOYMENT`: Azure OpenAI deployment name (e.g., gpt-35-turbo)

### Key NPM Packages
- Database: drizzle-orm, pg, connect-pg-simple
- UI: @radix-ui components, framer-motion, tailwind-merge, class-variance-authority
- Forms: react-hook-form, @hookform/resolvers, zod
- HTTP: axios (for Azure API calls)
- Dates: date-fns