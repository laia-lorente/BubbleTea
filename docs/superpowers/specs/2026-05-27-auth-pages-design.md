# Auth Pages Design — BubbleTea Store

**Date:** 2026-05-27

## Summary

Add Login, Register and Home pages to the Angular 21 BubbleTea frontend. Auth handled by Firebase via AngularFire. UI via Angular Material with a blue/lilac palette. Home is protected by a functional auth guard.

---

## Architecture

### Dependencies

- `@angular/fire` — Firebase SDK wrapper (install with `--legacy-peer-deps`)
- `@angular/material` + `@angular/cdk` — UI components and theming
- Firebase credentials read from `src/environments/environment.ts` (user populates from `.env.local`)

### File Structure

```
src/
├── environments/
│   └── environment.ts
└── app/
    ├── core/
    │   ├── services/auth.service.ts
    │   └── guards/auth.guard.ts
    ├── features/
    │   ├── login/login.component.ts
    │   ├── register/register.component.ts
    │   └── home/
    │       ├── home.component.ts
    │       └── product-card/product-card.component.ts
    ├── shared/
    │   └── models/bubble-tea.model.ts
    ├── app.config.ts
    └── app.routes.ts
```

### Auth Service

`AuthService` (providedIn root):
- Injects AngularFire `Auth`
- Exposes `currentUser = toSignal(authState(auth))` — signal of `User | null`
- Methods: `signIn(email, password)`, `signUp(email, password)`, `signOut()`
- All methods return `Promise<void>` and surface errors to the caller

### Auth Guard

Functional `authGuard`:
- Uses `inject(AuthService).currentUser()`
- If `null` → redirects to `/login`
- If authenticated → allows activation

### Routes

| Path | Component | Guard |
|------|-----------|-------|
| `/` | — | Redirect to `/home` |
| `/login` | `LoginComponent` | If authenticated → redirect `/home` |
| `/register` | `RegisterComponent` | If authenticated → redirect `/home` |
| `/home` | `HomeComponent` | `authGuard` |

All feature routes lazy-loaded.

---

## Pages

### Login (`/login`)

- Centered `mat-card` (max-width 420px)
- Logo/title at top: "BubbleTea" with boba icon (emoji or SVG)
- Reactive form: `email` (required, email validator) + `password` (required, minLength 6)
- Submit button (full width, primary color) — disabled while loading
- Error messages via `mat-error` on each field
- Link to `/register` below the form
- On success → navigate to `/home`

### Register (`/register`)

- Same centered card layout as Login
- Reactive form: `email`, `password` (min 6), `confirmPassword`
- Cross-field validator: `password === confirmPassword`
- Firebase error handling (e.g. email already in use)
- Link to `/login`
- On success → navigate to `/home`

### Home (`/home`)

**Navbar:**
- Logo "BubbleTea" on left
- User email on right + "Cerrar sesión" `mat-button`

**Hero:**
- Full-width banner with gradient background (blue → lilac)
- Title: "Tu bubble tea perfecto, a un clic" + subtitle

**Catalog:**
- Section title "Nuestro menú"
- 3-column responsive grid (1 col mobile, 2 tablet, 3 desktop) using CSS grid
- Each card is a `ProductCardComponent` receiving a `BubbleTeaItem` as input

**ProductCardComponent:**
- `mat-card` with: name (title), temperature (with warm/cold icon), price formatted as `€X.XX`, `mat-chip` badge: green "Disponible" / gray "No disponible"
- Mock data: 6 hardcoded `BubbleTeaItem` items (taro, matcha, mango, etc.)

---

## Theming

Angular Material M3 custom theme (SCSS):
- Primary: indigo-blue (`#3B5BDB`)
- Tertiary/accent: lilac (`#9775FA`)
- Background: light lavender (`#F0EEFF`)
- Navbar background: primary color with white text
- Cards: white with subtle shadow and lilac accent on hover

---

## Data Model

```typescript
// shared/models/bubble-tea.model.ts
export interface BubbleTeaItem {
  name: string;
  temperature: string;   // 'hot' | 'cold' | 'both'
  precio: number;
  active: boolean;
}
```

Mock data (6 items) defined in `home.component.ts` as a signal.

---

## Firebase Config

`src/environments/environment.ts` (gitignored):
```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: '...',
    authDomain: '...',
    projectId: '...',
    storageBucket: '...',
    messagingSenderId: '...',
    appId: '...'
  }
};
```

---

## Constraints

- No `standalone: true` in decorators (Angular v20+ default)
- All components use `ChangeDetectionStrategy.OnPush`
- No `ngClass` / `ngStyle` — use `class` / `style` bindings
- Native control flow (`@if`, `@for`)
- `inject()` over constructor injection
- Reactive forms over template-driven
