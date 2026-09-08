# Phase 1: Project Foundation, Documentation & Folder Architecture

## Status
IN PROGRESS

## Objective
The objective of Phase 1 is to establish a clean, scalable, industry-standard technical foundation for the website.

## Scope
- Project initialization (Next.js)
- Technology stack setup
- Dependency installation
- Folder architecture creation
- Naming conventions enforcement
- Basic configuration (TypeScript, Tailwind)
- Documentation creation

### What is NOT Included
- Building the Navbar
- Building the Hero
- Adding hero videos or video slider functionality
- Adding animations
- Adding real package content
- Adding API routes
- Connecting production database
- Configuring production Cloudinary
- Building authentication, admin panel, live chat, or lead form
- Adding unnecessary UI libraries

## Requirements
- Use App Router, TypeScript, Tailwind CSS.
- Ensure lean dependency tree.
- Setup strict folder architecture based on separation of concerns.

## Technology Decisions
- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Animation: Framer Motion
- Icons: Lucide React
- Forms: React Hook Form + Zod (@hookform/resolvers)
- Database/ORM: PostgreSQL + Prisma (@prisma/client)
- Media: next-cloudinary

## Dependencies
- `next`, `react`, `react-dom`, `typescript`
- `tailwindcss`, `postcss`, `eslint`
- `framer-motion`, `lucide-react`
- `react-hook-form`, `zod`, `@hookform/resolvers`
- `prisma`, `@prisma/client`
- `next-cloudinary`

## Intended Changes
- Create `docs/` with standard documentation files.
- Run Next.js initialization command.
- Install the required dependencies.
- Remove default Next.js boilerplate folders if not aligned with required structure.
- Scaffold the `src/` directories as defined in the requirements.
- Create `prisma/schema.prisma`.

## Files Created / Modified
(To be updated after execution)

## Acceptance Criteria
- Clean folder structure exists with meaningful names and separation of concerns.
- Next.js is correctly initialized.
- TypeScript and Tailwind CSS are configured.
- Approved dependencies are installed (no unnecessary ones).
- Required documentation exists.

## Verification Checklist
- [ ] TypeScript: PENDING
- [ ] Build: PENDING
- [ ] Lint: PENDING
- [ ] Dependencies: PENDING
- [ ] Folder structure: PENDING

## Known Issues
(None)

## Next Phase
Phase 2 — Mobile-First Navbar
