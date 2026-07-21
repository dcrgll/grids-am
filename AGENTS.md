<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing Next.js code, and heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Developer conventions

This project uses **Ultracite** (Oxlint + Oxfmt) for code quality. Run `pnpm lint` to apply fixes, `pnpm lint:check` to check for issues, and `pnpm typecheck` to run TypeScript without emitting files. Linting does not replace type-checking.

Before adding a dependency or choosing an implementation, read [`docs/PREFERRED_LIBRARIES.md`](./docs/PREFERRED_LIBRARIES.md). Existing project dependencies take precedence; do not add another library for a job already covered by the stack.

## Core principles

Write accessible, performant, type-safe, maintainable code. Prefer clarity and explicit intent.

- Prefer `unknown` to `any`, type narrowing to assertions, `const` by default, and early returns over nesting.
- Use `async`/`await`, handle errors meaningfully, and throw descriptive `Error` objects.
- Keep functions focused; extract complex conditions into named booleans and avoid nested ternaries.
- Do not leave `console.log`, `debugger`, or `alert` in production code.
- Use optional chaining and nullish coalescing where appropriate; prefer `for...of` to `.forEach()` for iteration with control flow.

## React and Next.js

- Use function components, call hooks only at the top level, and keep hook dependencies correct.
- Use unique IDs as list keys, semantic HTML, meaningful image alt text, labels for form controls, and keyboard equivalents for mouse interactions.
- Do not define components inside other components.
- Use the App Router metadata API for document metadata and Server Components for async data fetching where practical.
- Use Next.js `<Image>` for images unless its constraints make it unsuitable.
- React 19 supports passing `ref` as a prop; avoid `React.forwardRef` in new components.

## Security and performance

- Add `rel="noopener"` to links using `target="_blank"`.
- Avoid `dangerouslySetInnerHTML`, `eval`, and direct `document.cookie` assignment.
- Validate untrusted input at system boundaries.
- Avoid spread syntax in loop accumulators, repeatedly-created regexes, namespace imports, and barrel re-export files.

## Git workflow

Work on a conventional, kebab-case branch and open a PR rather than committing directly to `main`:

- `feat/add-user-auth`
- `fix/resolve-login-error`
- `chore/update-dependencies`
- `docs/update-readme`

Before pushing, run `pnpm lint:check` and `pnpm typecheck`.
