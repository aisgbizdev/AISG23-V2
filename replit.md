# AiSG - Audit Intelligence System Growth

## Overview

AiSG (Audit Intelligence System Growth) is a corporate enterprise performance auditing platform designed to evaluate employee performance and leadership using a standardized 18 Pilar framework. The system processes quarterly performance metrics and behavioral assessments to generate comprehensive audit reports with ProDem (Promotion-Demotion) recommendations. Key capabilities include a 5-step multi-form for data input, 12-section professional audit reports, **3-Source AI Chat System** (ChatGPT → Gemini → Internal Knowledge Base), and PDF export functionality. It also features a "Magic Section" for personalized motivational content. The system is fully operational and production-ready with **modern Gen-Z UI/UX design**, supporting a quarterly-based audit system with a Reality Score Calculator.

## Recent Changes (November 4, 2025)

**🔐 AUTHENTICATION & AUTHORIZATION SYSTEM (COMPLETE):**
- ✅ **Full Enterprise Authentication**: Username/password login with bcrypt hashing (SALT_ROUNDS=10)
- ✅ **Session Management**: express-session with HttpOnly cookies, 24-hour expiry, CSRF protection (sameSite: lax), proxy trust for Replit environment
- ✅ **Mobile Browser Support**: Secure cookies enabled for HTTPS, session persistence across all browsers including mobile
- ✅ **Role-Based Access Control (RBAC)**: 4 roles with hierarchy (Full Admin → Admin → Auditor → Regular User)
- ✅ **Self-Registration System**: Public registration page where regular users can create their own accounts
- ✅ **Security Question-Based Password Reset**: 3-step password recovery flow (username → verify security question → reset password)
- ✅ **Password Visibility Toggle**: Eye icon on all password fields (Login, Register, Forgot Password) for better UX and typo prevention
- ✅ **Protected API Endpoints**: All `/api/*` routes require authentication with ownership checks
- ✅ **Protected Frontend Routes**: Auto-redirect to `/login` for unauthenticated users
- ✅ **Admin Dashboard**: Full Admin can create/delete users, manage roles, view all users
- ✅ **Ownership-Based Data Access**: Users see only their own audits, admins see all
- ✅ **Superadmin Account**: Username `superadmin`, password `vito1007`, role `full_admin`
- ✅ **Modern Gen-Z Auth Pages**: Gradient design (blue→purple→pink), glassmorphism effects, sparkles icon
- ✅ **Auth Context**: Global state management with React Context, auto session persistence
- ✅ **User Info Display**: Header shows current user name, role badge, logout button
- ✅ **Navigation**: Home + Admin links (Admin only visible to full_admin)

**UI/UX Modernization:**
- ✅ Updated branding from "AISG" to "AiSG" with gradient text styling
- ✅ Implemented sticky/fixed header with ChatGPT custom GPT integration button
- ✅ Added sticky tabs menu in AuditDetail page (18 Pilar, SWOT, ProDem, Magic sections)
- ✅ Full mobile responsiveness with proper breakpoints and no card overlapping
- ✅ Modern Gen-Z aesthetic: gradients, glassmorphism effects, rounded corners (rounded-xl), smooth animations
- ✅ Enhanced iconography using Lucide React with gradient backgrounds
- ✅ Detailed gap insights for 18 Pilar showing overestimation/underestimation analysis with specific improvement recommendations

**AI System Enhancement:**
- ✅ Implemented **3-Source AI Fallback System** ensuring users always receive quality answers
- ✅ Created comprehensive Internal Knowledge Base covering 15+ business topics (leadership, teamwork, sales, recruitment, planning, etc.)
- ✅ Robust error handling with graceful degradation across AI sources
- ✅ Enhanced AI Coach personality: warm, conversational, data-driven storytelling approach with comprehensive audit context and knowledge frameworks

**Mobile & PWA Optimization:**
- ✅ Fixed floating chat button (sticky position, doesn't scroll with content)
- ✅ Chat button hides when chat panel is open to prevent blocking input
- ✅ Optimized chat input visibility on mobile devices
- ✅ **PWA Configuration**: Web manifest with AiSG logo for "Add to Home Screen" installation
- ✅ Full PWA meta tags for iOS and Android compatibility
- ✅ Custom app icon and branding for installed web app

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
**UI Component System**: shadcn/ui components (Radix UI primitives) with "new-york" style, adapted Material Design principles, and dark mode primary theme. Custom color system for zone-based status indicators. Modern Gen-Z design with gradients and glassmorphism.
**State Management**: TanStack Query for server state, React Hook Form with Zod validation for forms.
**Routing**: Wouter for client-side routing.
**Key Design Decisions**: Modern Gen-Z aesthetic with gradients and animations, sticky navigation elements (header + tabs), full mobile responsiveness, zone color-coding for visual feedback, dark mode with glassmorphism effects, Inter font, enhanced iconography with Lucide React, detailed gap insights in 18 Pilar analysis, integrated ChatGPT custom GPT access.

### Backend Architecture

**Runtime**: Node.js with Express.js.
**API Design**: RESTful JSON API for audit management and AI chat with 3-source fallback mechanism.
**Business Logic Layer**: Centralized in `server/business-logic.ts`, handling Reality Score Calculation, Performance/Behavioral/Final Zone Analysis, Employee Profile Generation, SWOT Analysis, ProDem Recommendation, Action Plan 30-60-90, EWS, and the Magic Section.
**AI Chat Architecture**: 3-source fallback system implemented in `server/routes.ts`:
  1. **Primary**: OpenAI ChatGPT (gpt-4o-mini) - fastest, most accurate
  2. **Secondary**: Google Gemini (gemini-2.0-flash-exp) - cost-effective fallback
  3. **Tertiary**: Internal Knowledge Base (`server/knowledge-base.ts`) - guaranteed response even when APIs fail
**Knowledge Base**: Comprehensive coverage of 15+ business topics including leadership, teamwork, public speaking, sales/closing, confidence building, marketing, prospecting, staff retention, recruitment (commission-based), work planning, trading plan, SWOT analysis, performance zones, and ProDem career guidance.
**Validation**: Zod schemas shared between client and server.
**Key Architectural Patterns**: Storage interface abstraction, separation of business logic, schema-driven development, graceful degradation with AI fallback chain, and comprehensive error handling.

### Data Storage

**Database**: PostgreSQL 16 (Neon serverless) using Drizzle ORM.
**Schema Design**: Includes `users`, `branches`, `audits` (core table with employee, performance, team structure, assessment, and report data), and `chatMessages` tables. Uses JSONB for flexible data, UUID primary keys, and denormalized audit results.
**Migration Strategy**: Drizzle Kit for schema migrations.

### Authentication & Authorization

**Current State**: ✅ **FULLY IMPLEMENTED** - Enterprise-grade authentication system with session management and RBAC.

**Architecture**:
- **Session Management**: express-session with secure HttpOnly cookies, 24-hour expiry
- **Password Security**: bcrypt hashing with SALT_ROUNDS=10
- **Auth Service** (`server/auth.ts`): createUser, authenticateUser, getUserById, updateUserPassword, hashPassword, verifyPassword
- **Middleware** (`server/middleware.ts`): requireAuth, requireRole, requireFullAdmin, requireAdmin, requireAuditor, optionalAuth
- **Auth Routes** (`server/auth-routes.ts`): 
  - POST /api/auth/login - Username/password authentication
  - POST /api/auth/logout - Session destruction
  - GET /api/auth/me - Current user info
  - POST /api/auth/register - Create user (Full Admin only)
  - GET /api/users - List all users (Admin+)
  - DELETE /api/users/:id - Delete user (Full Admin only)
  - PUT /api/users/:id/password - Change password (self or Full Admin)

**Role Hierarchy** (4 levels):
1. **Full Admin**: Complete system access, user management, create/delete users, see all audits
2. **Admin**: Manage organization data, see all audits in scope
3. **Auditor**: Create and manage audits, see own audits
4. **Regular User**: Basic access, see own data only

**Ownership Model**:
- Each audit has `ownerId` (who owns it) and `createdById` (who created it)
- Full Admin: Access ALL audits
- Admin: Access ALL audits (currently, future: branch-level filtering)
- Auditor/Regular User: Access ONLY their own audits (where `ownerId` = `userId`)

**Frontend Integration**:
- **Auth Context** (`client/src/lib/auth-context.tsx`): Global auth state with useAuth() hook
- **Login Page** (`client/src/pages/Login.tsx`): Gen-Z gradient design, form validation
- **Protected Routes**: All pages (except /login) require authentication, auto-redirect
- **Admin Dashboard** (`client/src/pages/AdminDashboard.tsx`): User management UI for Full Admin
- **Header Integration**: User info badge, role display, logout button, navigation (Home + Admin)

**Default Credentials**:
- Username: `superadmin`
- Password: `vito1007`
- Role: `full_admin`

**Security Features**:
- CSRF protection (sameSite: lax)
- HttpOnly cookies (prevent XSS)
- Secure cookies in production (HTTPS only)
- Password minimum length: 6 characters
- Username minimum length: 3 characters
- Session timeout: 24 hours
- Cannot delete own account (Full Admin)
- Bcrypt salted password hashing

## External Dependencies

**AI Services** (3-Source Fallback System):
- **OpenAI ChatGPT (gpt-4o-mini)**: Primary AI source for chat assistant, providing highest quality context-aware responses with chat history persistence.
- **Google Gemini (gemini-2.0-flash-exp)**: Secondary AI source as fallback when OpenAI is unavailable or rate-limited.
- **Internal Knowledge Base**: Tertiary fallback ensuring users always receive relevant answers even when both external AI APIs fail. Covers 15+ business and performance improvement topics.

**Database Services**:
- **Neon Serverless PostgreSQL**: Cloud-native PostgreSQL with connection pooling.

**UI Component Libraries**:
- **Radix UI**: Unstyled accessible component primitives.
- **shadcn/ui**: Pre-styled component system built on Radix UI.
- **Lucide React**: Icon library.

**Form & Validation**:
- **React Hook Form**: Performant form state management.
- **Zod**: Runtime type validation and schema definition.

**Utility Libraries**:
- **date-fns**: Date manipulation.
- **clsx & tailwind-merge**: Conditional CSS class management.
- **class-variance-authority**: Type-safe component variants.
- **PDFKit**: PDF generation for audit reports.

**Development Tools**:
- **Vite**: Fast build tool.
- **TypeScript**: Type safety.
- **Tailwind CSS**: Utility-first CSS framework.
- **PostCSS with Autoprefixer**: CSS processing.
- **Drizzle Kit**: Database migrations.

**Knowledge Base Files** (in `attached_assets/`):
- 18 Pilar framework definitions
- ProDem (Promotion-Demotion) standards
- Zodiac booster templates
- Motivational quotes database
- Server specification and system blueprints
- AISG_Manual_Book.txt (comprehensive system documentation)