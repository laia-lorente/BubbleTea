# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # dev server at http://localhost:4200 (auto-reloads)
npm run build      # production build → dist/
npm run watch      # dev build with watch mode
npm test           # unit tests with Vitest
```

For Angular CLI scaffolding: `npx ng generate component <name>` (creates standalone components by default in v20+).

## Architecture

Angular 21 standalone application. Entry point is `src/main.ts` → bootstraps `App` from `src/app/app.ts`.

- `src/app/app.config.ts` — application providers (`provideRouter`, etc.)
- `src/app/app.routes.ts` — root route definitions
- `src/app/app.ts` — root component (uses `RouterOutlet`)
- `src/styles.css` — global styles (`@import 'tailwindcss'`)

**Styling:** Tailwind CSS v4 via PostCSS (configured in `.postcssrc.json`). No `tailwind.config.js` — Tailwind v4 is config-file-free.

**Testing:** Vitest (not Karma/Jest). Test files use `.spec.ts` suffix alongside the files they test.

**Formatting:** Prettier with `singleQuote: true`, `printWidth: 100`, Angular parser for HTML templates.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection
