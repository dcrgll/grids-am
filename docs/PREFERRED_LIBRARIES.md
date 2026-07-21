# Preferred libraries

Default choices for new React and TypeScript work. Project conventions and existing dependencies take precedence; ask before adding a dependency.

This project already uses Tailwind CSS, Radix UI primitives, Lucide, React Hook Form, Zod, TanStack Query, and tRPC. Reuse those packages where they cover the need.

## Styling — Tailwind CSS

- Use Tailwind utility classes and compose conditional classes with `cn()` from `@/lib/utils`.
- Put reusable colours, spacing, and typography in the Tailwind theme or CSS variables.
- Avoid CSS Modules, styled-components, and Emotion unless the project adopts them deliberately.

## Schemas and forms — Zod + React Hook Form

- Use Zod to validate untrusted input and infer types with `z.infer`.
- Use React Hook Form for forms and pair it with `@hookform/resolvers/zod` when validation is needed.
- Prefer uncontrolled inputs with `register` or `Controller`; do not duplicate form state in `useState` without a reason.
- Keep environment validation in `src/env.ts`; do not read `process.env` ad hoc.

## Server and client data — tRPC + TanStack Query

- Use tRPC for application APIs and TanStack Query for cached server state, mutations, loading, and error UI.
- Use native `fetch` for external HTTP requests; do not add axios or ky without a concrete need.
- Keep shared client-only UI state local where possible; if a store is needed, prefer a small focused Zustand store rather than a global store.

## UI — Radix UI + Tailwind

- Extend or compose the existing UI components in `src/components/ui` before introducing new primitives.
- Use the installed Radix UI packages for accessible primitives, and avoid introducing a second component-library stack.

## Other defaults

- Use Motion (`motion/react`) for purposeful UI animation.
- Use Better Auth for new authentication work unless the project establishes another auth provider.
- Use nuqs for URL state that is read and written as application state.
- Use Lucide for icons; do not mix icon sets without a reason.
- Use Day.js for shared date parsing and formatting.
- Use shadcn charts with Recharts, Faker for realistic fixtures, and `next-themes` for theme switching when those needs arise.
- Use Cloudflare Turnstile for captcha or bot-protection flows; store keys in environment variables and verify tokens server-side.
