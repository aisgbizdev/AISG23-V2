# AiSG - Audit Intelligence System Growth

## Overview

AiSG (Audit Intelligence System Growth) is a corporate enterprise performance auditing platform designed to evaluate employee performance and leadership against a standardized 18 Pilar framework. It processes quarterly performance metrics and behavioral assessments to generate comprehensive audit reports with ProDem (Promotion-Demotion) recommendations. Key features include a 5-step multi-form data input, 12-section professional audit reports, a 3-Source AI Chat System (ChatGPT → Gemini → Internal Knowledge Base), PDF export, and a "Magic Section" for personalized motivational content. The system is production-ready, featuring a modern Gen-Z UI/UX, a quarterly-based audit system with a Reality Score Calculator, and robust enterprise-grade authentication with role-based access control (RBAC).

## User Preferences

**Communication Style**: Simple, everyday language (Bahasa Indonesia)

**Design Preferences**:
- Modern Gen-Z aesthetic with professional corporate foundation
- Dark mode as primary theme with glassmorphism effects
- Zone-based color coding (Success 🟩, Warning 🟨, Critical 🟥)
- Gradient text and icon backgrounds for modern appeal
- Radio buttons preferred over sliders for familiarity
- Clear, prominent UI elements with smooth animations
- Sticky navigation elements (header, tabs) for better UX

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript and Vite.
**UI Component System**: shadcn/ui components (Radix UI primitives) with "new-york" style, adapted Material Design principles, and dark mode as the primary theme. Custom color system for zone-based status indicators. Modern Gen-Z design with gradients and glassmorphism, Inter font, and enhanced iconography using Lucide React.
**State Management**: TanStack Query for server state, React Hook Form with Zod validation for forms.
**Routing**: Wouter for client-side routing.
**Key Design Decisions**: Modern Gen-Z aesthetic with gradients and animations, sticky navigation elements, full mobile responsiveness (PWA optimized), zone color-coding for visual feedback, and detailed gap insights in 18 Pilar analysis.

### Backend Architecture

**Runtime**: Node.js with Express.js.
**API Design**: RESTful JSON API for audit management and AI chat.
**Business Logic Layer**: Centralized, handling Reality Score Calculation, Performance/Behavioral/Final Zone Analysis, Employee Profile Generation, SWOT Analysis, ProDem Recommendation, Action Plan 30-60-90, EWS, and the Magic Section.
**AI Chat Architecture**: A 3-source fallback system: Primary (OpenAI ChatGPT), Secondary (Google Gemini), Tertiary (Internal Knowledge Base for guaranteed responses).
**Knowledge Base**: Covers 15+ business topics including leadership, teamwork, sales, recruitment, planning, and SWOT analysis.
**Validation**: Zod schemas shared between client and server.
**Key Architectural Patterns**: Storage interface abstraction, separation of business logic, schema-driven development, graceful degradation with AI fallback chain, and comprehensive error handling.

### Data Storage

**Database**: PostgreSQL 16 (Neon serverless) using Drizzle ORM.
**Schema Design**: Includes `users`, `branches`, `audits` (core table with employee, performance, team structure, assessment, and report data), and `chatMessages` tables. Uses JSONB for flexible data, UUID primary keys, and denormalized audit results.
**Migration Strategy**: Drizzle Kit for schema migrations.

### Authentication & Authorization

**Architecture**: Enterprise-grade authentication with session management and RBAC.
- **Session Management**: express-session with secure HttpOnly cookies, 24-hour expiry.
- **Password Security**: bcrypt hashing (SALT_ROUNDS=10).
- **Middleware**: requireAuth, requireRole for protected routes and API endpoints.
- **Role Hierarchy**: 4 levels (Full Admin, Admin, Auditor, Regular User) with specific permissions.
- **Ownership Model**: Users access their own audits, Admins access all audits.
- **Security Features**: CSRF protection, secure cookies, password/username constraints.

## External Dependencies

**AI Services**:
- **OpenAI ChatGPT (gpt-4o-mini)**: Primary AI for chat assistant.
- **Google Gemini (gemini-2.0-flash-exp)**: Secondary AI fallback.
- **Internal Knowledge Base**: Tertiary fallback for guaranteed responses on business topics.

**Database Services**:
- **Neon Serverless PostgreSQL**: Cloud-native PostgreSQL with connection pooling.

**UI Component Libraries**:
- **Radix UI**: Unstyled accessible component primitives.
- **shadcn/ui**: Pre-styled component system built on Radix UI.
- **Lucide React**: Icon library.

**Form & Validation**:
- **React Hook Form**: Form state management.
- **Zod**: Runtime type validation and schema definition.

**Utility Libraries**:
- **date-fns**: Date manipulation.
- **clsx & tailwind-merge**: Conditional CSS class management.
- **class-variance-authority**: Type-safe component variants.
- **PDFKit**: PDF generation.

**Development Tools**:
- **Vite**: Fast build tool.
- **TypeScript**: Type safety.
- **Tailwind CSS**: Utility-first CSS framework.
- **PostCSS with Autoprefixer**: CSS processing.
- **Drizzle Kit**: Database migrations.