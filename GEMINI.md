# GEMINI.md - Library Application (خير جليس)

## Project Overview
"خير جليس" is a comprehensive Library Management System built with **Next.js 15 (App Router)** and **React 19**. It features a modern, RTL-supported (Arabic) user interface designed for both readers and administrators.

### Core Technologies
- **Framework:** Next.js 15.5.3 (App Router)
- **Styling:** Tailwind CSS, Material UI (MUI), Framer Motion
- **AI Integration:** Vercel AI SDK (@ai-sdk/openai) with GPT-4/5 models
- **Data Visualization:** Recharts
- **API Client:** Axios (configured in `lib/api.js`)
- **State Management:** React Context API (`AuthContext`)
- **Notifications:** Sonner

### Architecture
- **Frontend:** Next.js App Router for server-side rendering and static generation.
- **Backend Integration:** Connects to an external API (configured via `NEXT_PUBLIC_API_URL`).
- **Authentication:** Token-based authentication with state managed in `AuthProvider`. Supports User and Admin roles.
- **Localization:** Full RTL support with `Noto Sans Arabic` font.

---

## Building and Running

### Prerequisites
- Node.js (Latest LTS recommended)
- Environment variables: `NEXT_PUBLIC_API_URL` (for backend) and `OPENAI_API_KEY` (for AI features).

### Commands
| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server with Turbopack. |
| `npm run build` | Builds the application for production. |
| `npm run start` | Starts the production server. |
| `npm run lint` | Runs ESLint to check for code quality issues. |

---

## Development Conventions

### Directory Structure
- `src/app/`: Contains all routes, layouts, and page components.
    - `(auth)/`: Authentication routes (login, register).
    - `(protected)/`: Routes requiring authentication (books, profile, favorites).
    - `admin/`: Admin-specific management dashboard and tools.
    - `api/`: Next.js Route Handlers (e.g., AI chat streaming).
- `src/components/`: Reusable UI components.
- `lib/`: Business logic, API wrappers, and data structures.
    - `lib/api.js`: Axios instance with request/response interceptors.
    - `lib/data.js`: Mock data for development and testing.
    - `lib/admin/`, `lib/user/`, etc.: Specialized API functions.
- `public/`: Static assets including book covers and logos.

### Best Practices
- **RTL Consistency:** Ensure all new components respect the `rtl` direction and use `font-sans arabic-font`.
- **API Calls:** Use the centralized `api` instance from `lib/api.js` for consistent error handling and authentication headers.
- **Type Safety:** Use `zod` for schema validation where appropriate (already included in dependencies).
- **AI Ethics:** The AI assistant is strictly scoped to literature and books (enforced in `src/app/api/chat/route.js`).

---

## Key Files
- `src/app/layout.jsx`: Root layout with `AuthProvider` and global styles.
- `lib/api.js`: Centralized API configuration and error handling logic.
- `src/app/api/chat/route.js`: AI streaming endpoint for the literary assistant.
- `src/app/components/AuthContext.jsx`: Authentication state management.
- `lib/data.js`: Core data models and mock data for books and users.
