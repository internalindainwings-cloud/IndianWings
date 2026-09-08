# Architecture

## Framework
**Next.js (App Router)** with **React**. This provides a robust foundation for Server-Side Rendering (SSR) and Static Site Generation (SSG), crucial for SEO and performance.

## Rendering Strategy Direction
- Primarily leverage Server Components to reduce client-side JavaScript bundles and improve initial load times.
- Use Client Components only where interactivity is required (e.g., forms, heavy animations).

## Component Architecture
- **Atomic Design principles**: Separation into common elements, specific features, and layout components.
- Standardized directory structure for reusable logic and UI parts.

## Folder Responsibilities
- `app/`: Next.js App Router specific routing and global layouts.
- `components/`: UI components organized by feature or common use (e.g., `navigation`, `hero`, `forms`).
- `config/`: Application configuration files.
- `constants/`: Static application data and constants.
- `data/`: Mock data or static content for initial development.
- `lib/`: Utility functions and third-party service configurations (e.g., Cloudinary, Prisma).
- `hooks/`: Custom React hooks.
- `types/`: TypeScript type definitions.
- `styles/`: Global styles and CSS design tokens.

## Data Layer Direction
- **Prisma ORM** for database interaction, providing type safety and a clean developer experience.
- PostgreSQL as the underlying relational database.

## Media Architecture
- **Cloudinary** for image and video hosting, manipulation, and optimization. 
- Use the official Cloudinary Next.js integration to serve optimized media seamlessly.

## Scalability Principles
- **Strict typing**: TypeScript enforced everywhere.
- **Modularity**: Code should be broken down into small, single-responsibility modules.
- **Lean Dependencies**: Avoid unnecessary third-party libraries. Use native HTML/CSS or lightweight libraries like Lucide React and Framer Motion.
