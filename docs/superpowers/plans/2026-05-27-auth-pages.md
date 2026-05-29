# BubbleTea Auth Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir Login, Register y Home (protegida) al frontend Angular 21 de BubbleTea, con auth Firebase vía AngularFire y UI con Angular Material (paleta azul/lila).

**Architecture:** Standalone components lazy-loaded por ruta. `AuthService` centraliza AngularFire auth y expone `currentUser` como signal. Un `authGuard` funcional protege `/home`. La paleta se obtiene con el prebuilt theme `azure-blue` de Material + overrides CSS.

**Tech Stack:** Angular 21, AngularFire, Angular Material + CDK, Angular Reactive Forms, Vitest

---

## File map

| Acción | Archivo |
|--------|---------|
| Create | `src/environments/environment.ts` |
| Create | `src/app/shared/models/bubble-tea.model.ts` |
| Create | `src/app/core/services/auth.service.ts` |
| Create | `src/app/core/guards/auth.guard.ts` |
| Create | `src/app/core/guards/auth.guard.spec.ts` |
| Create | `src/app/features/login/login.component.ts` |
| Create | `src/app/features/login/login.component.html` |
| Create | `src/app/features/login/login.component.css` |
| Create | `src/app/features/register/register.component.ts` |
| Create | `src/app/features/register/register.component.html` |
| Create | `src/app/features/register/register.component.css` |
| Create | `src/app/features/register/register.component.spec.ts` |
| Create | `src/app/features/home/home.component.ts` |
| Create | `src/app/features/home/home.component.html` |
| Create | `src/app/features/home/home.component.css` |
| Create | `src/app/features/home/product-card/product-card.component.ts` |
| Modify | `src/app/app.config.ts` |
| Modify | `src/app/app.routes.ts` |
| Modify | `src/app/app.ts` |
| Modify | `src/index.html` |
| Modify | `src/styles.css` |
| Modify | `angular.json` |
| Modify | `.gitignore` |

---

## Task 1: Instalar dependencias

**Files:**
- Modify: `angular.json`
- Modify: `src/index.html`

- [ ] **Step 1: Instalar AngularFire**

```bash
npm install @angular/fire --legacy-peer-deps
```

Expected: paquete instalado sin errores (puede haber warnings de peer deps, es normal).

- [ ] **Step 2: Instalar Angular Material y CDK**

```bash
npm install @angular/material @angular/cdk --legacy-peer-deps
```

- [ ] **Step 3: Añadir el prebuilt theme a angular.json**

En `angular.json`, localiza el array `"styles"` dentro de `projects > BubbleTea > architect > build > options`. Reemplázalo por:

```json
"styles": [
  "node_modules/@angular/material/prebuilt-themes/azure-blue.css",
  "src/styles.css"
]
```

- [ ] **Step 4: Añadir fuente Roboto e iconos Material a index.html**

Añade dentro del `<head>` de `src/index.html`, justo antes de `</head>`:

```html
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
    rel="stylesheet"
  />
```

- [ ] **Step 5: Actualizar styles.css con estilos globales y overrides de paleta**

Reemplaza el contenido de `src/styles.css` con:

```css
@import 'tailwindcss';

body {
  margin: 0;
  font-family: Roboto, 'Helvetica Neue', sans-serif;
  background-color: #f0eeff;
}

* {
  box-sizing: border-box;
}
```

- [ ] **Step 6: Commit**

```bash
git add angular.json src/index.html src/styles.css package.json package-lock.json
git commit -m "chore: install AngularFire and Angular Material"
```

---

## Task 2: Environment file y .gitignore

**Files:**
- Create: `src/environments/environment.ts`
- Modify: `.gitignore`

- [ ] **Step 1: Crear directorio environments**

```bash
mkdir src/environments
```

- [ ] **Step 2: Crear src/environments/environment.ts**

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_AUTH_DOMAIN',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_STORAGE_BUCKET',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID',
  },
};
```

**Importante:** el usuario debe reemplazar los valores con los de su `.env.local`.

- [ ] **Step 3: Añadir environment.ts al .gitignore**

Añade al final del `.gitignore`:

```
# Firebase credentials — copy values from .env.local
src/environments/environment.ts
```

- [ ] **Step 4: Commit**

```bash
git add src/environments/environment.ts .gitignore
git commit -m "chore: add Firebase environment config (gitignored)"
```

---

## Task 3: Modelo BubbleTeaItem

**Files:**
- Create: `src/app/shared/models/bubble-tea.model.ts`

- [ ] **Step 1: Crear el modelo**

```typescript
// src/app/shared/models/bubble-tea.model.ts
export interface BubbleTeaItem {
  name: string;
  temperature: string;
  precio: number;
  active: boolean;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/shared/models/bubble-tea.model.ts
git commit -m "feat: add BubbleTeaItem model"
```

---

## Task 4: AuthService

**Files:**
- Create: `src/app/core/services/auth.service.ts`

- [ ] **Step 1: Crear AuthService**

```typescript
// src/app/core/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  authState,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);

  readonly currentUser = toSignal(authState(this.auth), { initialValue: null });

  async signIn(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
    await this.router.navigate(['/home']);
  }

  async signUp(email: string, password: string): Promise<void> {
    await createUserWithEmailAndPassword(this.auth, email, password);
    await this.router.navigate(['/home']);
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(this.auth);
    await this.router.navigate(['/login']);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/core/services/auth.service.ts
git commit -m "feat: add AuthService with Firebase email/password auth"
```

---

## Task 5: authGuard + tests

**Files:**
- Create: `src/app/core/guards/auth.guard.ts`
- Create: `src/app/core/guards/auth.guard.spec.ts`

- [ ] **Step 1: Escribir el test (TDD — failing first)**

```typescript
// src/app/core/guards/auth.guard.spec.ts
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

const mockRoute = {} as ActivatedRouteSnapshot;
const mockState = {} as RouterStateSnapshot;

describe('authGuard', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('returns true when user is authenticated', () => {
    const mockService = {
      currentUser: signal({ uid: 'test-uid', email: 'test@test.com' }),
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockService },
        provideRouter([]),
      ],
    });

    const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    expect(result).toBe(true);
  });

  it('redirects to /login when not authenticated', () => {
    const mockService = { currentUser: signal(null) };
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockService },
        provideRouter([]),
      ],
    });

    const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe('/login');
  });
});
```

- [ ] **Step 2: Ejecutar tests — deben fallar (módulo no existe aún)**

```bash
npm test -- --reporter=verbose 2>&1 | head -30
```

Expected: error `Cannot find module './auth.guard'`

- [ ] **Step 3: Crear el guard**

```typescript
// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentUser()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};
```

- [ ] **Step 4: Ejecutar tests — deben pasar**

```bash
npm test -- --reporter=verbose 2>&1 | head -30
```

Expected:
```
✓ src/app/core/guards/auth.guard.spec.ts (2)
  ✓ authGuard > returns true when user is authenticated
  ✓ authGuard > redirects to /login when not authenticated
```

- [ ] **Step 5: Commit**

```bash
git add src/app/core/guards/auth.guard.ts src/app/core/guards/auth.guard.spec.ts
git commit -m "feat: add authGuard with redirect to /login"
```

---

## Task 6: Actualizar app.config.ts

**Files:**
- Modify: `src/app/app.config.ts`

- [ ] **Step 1: Reemplazar app.config.ts**

```typescript
// src/app/app.config.ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
  ],
};
```

- [ ] **Step 2: Commit**

```bash
git add src/app/app.config.ts
git commit -m "feat: wire Firebase and Material animations in app config"
```

---

## Task 7: Actualizar app.routes.ts y app.ts

**Files:**
- Modify: `src/app/app.routes.ts`
- Modify: `src/app/app.ts`

- [ ] **Step 1: Reemplazar app.routes.ts**

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
];
```

- [ ] **Step 2: Simplificar app.ts a inline template**

```typescript
// src/app/app.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class App {}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/app.routes.ts src/app/app.ts
git commit -m "feat: configure lazy routes with authGuard on /home"
```

---

## Task 8: LoginComponent

**Files:**
- Create: `src/app/features/login/login.component.ts`
- Create: `src/app/features/login/login.component.html`
- Create: `src/app/features/login/login.component.css`

- [ ] **Step 1: Crear login.component.ts**

```typescript
// src/app/features/login/login.component.ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  protected loading = signal(false);
  protected error = signal('');

  protected form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected async submit(): Promise<void> {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');
    try {
      const { email, password } = this.form.value;
      await this.authService.signIn(email!, password!);
    } catch (err: unknown) {
      this.error.set(this.parseError(err));
      this.loading.set(false);
    }
  }

  private parseError(err: unknown): string {
    if (err && typeof err === 'object' && 'code' in err) {
      const code = (err as { code: string }).code;
      if (
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-credential'
      ) {
        return 'Email o contraseña incorrectos';
      }
      if (code === 'auth/too-many-requests') {
        return 'Demasiados intentos. Inténtalo más tarde';
      }
    }
    return 'Error al iniciar sesión. Inténtalo de nuevo';
  }
}
```

- [ ] **Step 2: Crear login.component.html**

```html
<!-- src/app/features/login/login.component.html -->
<div class="auth-container">
  <mat-card class="auth-card">
    <mat-card-header>
      <mat-card-title class="logo">🧋 BubbleTea</mat-card-title>
      <mat-card-subtitle>Inicia sesión en tu cuenta</mat-card-subtitle>
    </mat-card-header>

    <mat-card-content>
      @if (error()) {
        <p class="error-msg" role="alert">{{ error() }}</p>
      }

      <form [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="outline" class="field">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" autocomplete="email" />
          @if (form.get('email')?.hasError('required') && form.get('email')?.touched) {
            <mat-error>El email es obligatorio</mat-error>
          }
          @if (form.get('email')?.hasError('email') && form.get('email')?.touched) {
            <mat-error>Introduce un email válido</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="field">
          <mat-label>Contraseña</mat-label>
          <input
            matInput
            type="password"
            formControlName="password"
            autocomplete="current-password"
          />
          @if (form.get('password')?.hasError('required') && form.get('password')?.touched) {
            <mat-error>La contraseña es obligatoria</mat-error>
          }
          @if (form.get('password')?.hasError('minlength') && form.get('password')?.touched) {
            <mat-error>Mínimo 6 caracteres</mat-error>
          }
        </mat-form-field>

        <button
          mat-flat-button
          type="submit"
          class="submit-btn"
          [disabled]="form.invalid || loading()"
          aria-label="Iniciar sesión"
        >
          {{ loading() ? 'Cargando…' : 'Iniciar sesión' }}
        </button>
      </form>
    </mat-card-content>

    <mat-card-actions align="center">
      <p class="auth-link">¿No tienes cuenta? <a routerLink="/register">Regístrate</a></p>
    </mat-card-actions>
  </mat-card>
</div>
```

- [ ] **Step 3: Crear login.component.css**

```css
/* src/app/features/login/login.component.css */
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eef2ff 0%, #f5f0ff 100%);
  padding: 1rem;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  padding: 1rem;
}

.logo {
  font-size: 1.5rem !important;
  font-weight: 700 !important;
  color: #3b5bdb;
  margin-bottom: 0.25rem;
}

.field {
  display: block;
  width: 100%;
  margin-bottom: 0.25rem;
}

.submit-btn {
  display: block;
  width: 100%;
  height: 48px;
  margin-top: 0.5rem;
}

.error-msg {
  color: #c62828;
  font-size: 0.875rem;
  margin: 0 0 1rem;
  padding: 0.5rem 0.75rem;
  background: #ffebee;
  border-radius: 4px;
}

.auth-link {
  font-size: 0.875rem;
  color: #555;
  margin: 0;
  text-align: center;
}

.auth-link a {
  color: #3b5bdb;
  font-weight: 500;
  text-decoration: none;
}

.auth-link a:hover {
  text-decoration: underline;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/features/login/
git commit -m "feat: add LoginComponent with reactive form and Firebase auth"
```

---

## Task 9: RegisterComponent + test del validador

**Files:**
- Create: `src/app/features/register/register.component.ts`
- Create: `src/app/features/register/register.component.html`
- Create: `src/app/features/register/register.component.css`
- Create: `src/app/features/register/register.component.spec.ts`

- [ ] **Step 1: Escribir el test del validador cross-field (TDD)**

```typescript
// src/app/features/register/register.component.spec.ts
import { FormControl, FormGroup } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { passwordMatchValidator } from './register.component';

describe('passwordMatchValidator', () => {
  it('returns null when passwords match', () => {
    const group = new FormGroup({
      password: new FormControl('secret123'),
      confirmPassword: new FormControl('secret123'),
    });
    expect(passwordMatchValidator(group)).toBeNull();
  });

  it('returns { passwordMismatch: true } when passwords differ', () => {
    const group = new FormGroup({
      password: new FormControl('secret123'),
      confirmPassword: new FormControl('different'),
    });
    expect(passwordMatchValidator(group)).toEqual({ passwordMismatch: true });
  });

  it('returns { passwordMismatch: true } when confirmPassword is empty', () => {
    const group = new FormGroup({
      password: new FormControl('secret123'),
      confirmPassword: new FormControl(''),
    });
    expect(passwordMatchValidator(group)).toEqual({ passwordMismatch: true });
  });
});
```

- [ ] **Step 2: Ejecutar tests — deben fallar**

```bash
npm test -- --reporter=verbose 2>&1 | grep -A5 "register"
```

Expected: error `Cannot find module './register.component'`

- [ ] **Step 3: Crear register.component.ts (exporta el validador para que sea testable)**

```typescript
// src/app/features/register/register.component.ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/services/auth.service';

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value as string;
  const confirm = control.get('confirmPassword')?.value as string;
  return password === confirm ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  protected loading = signal(false);
  protected error = signal('');

  protected form = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator },
  );

  protected async submit(): Promise<void> {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');
    try {
      const { email, password } = this.form.value;
      await this.authService.signUp(email!, password!);
    } catch (err: unknown) {
      this.error.set(this.parseError(err));
      this.loading.set(false);
    }
  }

  private parseError(err: unknown): string {
    if (err && typeof err === 'object' && 'code' in err) {
      const code = (err as { code: string }).code;
      if (code === 'auth/email-already-in-use') return 'Este email ya está registrado';
      if (code === 'auth/weak-password') return 'La contraseña es demasiado débil';
    }
    return 'Error al crear la cuenta. Inténtalo de nuevo';
  }
}
```

- [ ] **Step 4: Ejecutar tests — deben pasar**

```bash
npm test -- --reporter=verbose 2>&1 | grep -A8 "passwordMatchValidator"
```

Expected:
```
✓ passwordMatchValidator > returns null when passwords match
✓ passwordMatchValidator > returns { passwordMismatch: true } when passwords differ
✓ passwordMatchValidator > returns { passwordMismatch: true } when confirmPassword is empty
```

- [ ] **Step 5: Crear register.component.html**

```html
<!-- src/app/features/register/register.component.html -->
<div class="auth-container">
  <mat-card class="auth-card">
    <mat-card-header>
      <mat-card-title class="logo">🧋 BubbleTea</mat-card-title>
      <mat-card-subtitle>Crea tu cuenta</mat-card-subtitle>
    </mat-card-header>

    <mat-card-content>
      @if (error()) {
        <p class="error-msg" role="alert">{{ error() }}</p>
      }

      <form [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="outline" class="field">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" autocomplete="email" />
          @if (form.get('email')?.hasError('required') && form.get('email')?.touched) {
            <mat-error>El email es obligatorio</mat-error>
          }
          @if (form.get('email')?.hasError('email') && form.get('email')?.touched) {
            <mat-error>Introduce un email válido</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="field">
          <mat-label>Contraseña</mat-label>
          <input
            matInput
            type="password"
            formControlName="password"
            autocomplete="new-password"
          />
          @if (form.get('password')?.hasError('required') && form.get('password')?.touched) {
            <mat-error>La contraseña es obligatoria</mat-error>
          }
          @if (form.get('password')?.hasError('minlength') && form.get('password')?.touched) {
            <mat-error>Mínimo 6 caracteres</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="field">
          <mat-label>Confirmar contraseña</mat-label>
          <input
            matInput
            type="password"
            formControlName="confirmPassword"
            autocomplete="new-password"
          />
          @if (form.hasError('passwordMismatch') && form.get('confirmPassword')?.touched) {
            <mat-error>Las contraseñas no coinciden</mat-error>
          }
        </mat-form-field>

        <button
          mat-flat-button
          type="submit"
          class="submit-btn"
          [disabled]="form.invalid || loading()"
          aria-label="Crear cuenta"
        >
          {{ loading() ? 'Cargando…' : 'Crear cuenta' }}
        </button>
      </form>
    </mat-card-content>

    <mat-card-actions align="center">
      <p class="auth-link">¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión</a></p>
    </mat-card-actions>
  </mat-card>
</div>
```

- [ ] **Step 6: Crear register.component.css (idéntico al de login)**

```css
/* src/app/features/register/register.component.css */
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eef2ff 0%, #f5f0ff 100%);
  padding: 1rem;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  padding: 1rem;
}

.logo {
  font-size: 1.5rem !important;
  font-weight: 700 !important;
  color: #3b5bdb;
  margin-bottom: 0.25rem;
}

.field {
  display: block;
  width: 100%;
  margin-bottom: 0.25rem;
}

.submit-btn {
  display: block;
  width: 100%;
  height: 48px;
  margin-top: 0.5rem;
}

.error-msg {
  color: #c62828;
  font-size: 0.875rem;
  margin: 0 0 1rem;
  padding: 0.5rem 0.75rem;
  background: #ffebee;
  border-radius: 4px;
}

.auth-link {
  font-size: 0.875rem;
  color: #555;
  margin: 0;
  text-align: center;
}

.auth-link a {
  color: #3b5bdb;
  font-weight: 500;
  text-decoration: none;
}

.auth-link a:hover {
  text-decoration: underline;
}
```

- [ ] **Step 7: Commit**

```bash
git add src/app/features/register/
git commit -m "feat: add RegisterComponent with cross-field password validator"
```

---

## Task 10: ProductCardComponent

**Files:**
- Create: `src/app/features/home/product-card/product-card.component.ts`

- [ ] **Step 1: Crear product-card.component.ts (inline template, componente pequeño)**

```typescript
// src/app/features/home/product-card/product-card.component.ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { BubbleTeaItem } from '../../../shared/models/bubble-tea.model';

@Component({
  selector: 'app-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatChipsModule, CurrencyPipe],
  styles: [
    `
      .card {
        height: 100%;
        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease;
      }
      .card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(59, 91, 219, 0.15);
      }
      .price {
        font-size: 1.5rem;
        font-weight: 700;
        color: #3b5bdb;
        margin: 0.5rem 0 0;
      }
      .temp {
        font-size: 0.875rem;
      }
      .chip-available {
        --mdc-chip-elevated-container-color: #d1fae5;
        --mdc-chip-label-text-color: #065f46;
      }
      .chip-unavailable {
        --mdc-chip-elevated-container-color: #f3f4f6;
        --mdc-chip-label-text-color: #6b7280;
      }
    `,
  ],
  template: `
    <mat-card class="card">
      <mat-card-header>
        <mat-card-title>{{ item().name }}</mat-card-title>
        <mat-card-subtitle>
          <span class="temp">
            @if (item().temperature === 'hot') {
              ☕ Caliente
            } @else if (item().temperature === 'cold') {
              🧊 Frío
            } @else {
              ☀️ Caliente/Frío
            }
          </span>
        </mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <p class="price">{{ item().precio | currency: 'EUR' }}</p>
      </mat-card-content>
      <mat-card-actions>
        <mat-chip-set aria-label="Disponibilidad del producto">
          <mat-chip [class]="item().active ? 'chip-available' : 'chip-unavailable'">
            {{ item().active ? 'Disponible' : 'No disponible' }}
          </mat-chip>
        </mat-chip-set>
      </mat-card-actions>
    </mat-card>
  `,
})
export class ProductCardComponent {
  readonly item = input.required<BubbleTeaItem>();
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/features/home/product-card/product-card.component.ts
git commit -m "feat: add ProductCardComponent with BubbleTeaItem display"
```

---

## Task 11: HomeComponent

**Files:**
- Create: `src/app/features/home/home.component.ts`
- Create: `src/app/features/home/home.component.html`
- Create: `src/app/features/home/home.component.css`

- [ ] **Step 1: Crear home.component.ts**

```typescript
// src/app/features/home/home.component.ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../core/services/auth.service';
import { BubbleTeaItem } from '../../shared/models/bubble-tea.model';
import { ProductCardComponent } from './product-card/product-card.component';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbarModule, MatButtonModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private authService = inject(AuthService);

  protected user = this.authService.currentUser;

  protected products = signal<BubbleTeaItem[]>([
    { name: 'Taro Milk Tea', temperature: 'cold', precio: 4.5, active: true },
    { name: 'Matcha Latte', temperature: 'hot', precio: 5.0, active: true },
    { name: 'Mango Passion', temperature: 'cold', precio: 4.0, active: true },
    { name: 'Brown Sugar Boba', temperature: 'cold', precio: 5.5, active: true },
    { name: 'Oolong Milk Tea', temperature: 'both', precio: 4.5, active: false },
    { name: 'Strawberry Slush', temperature: 'cold', precio: 4.0, active: true },
  ]);

  protected async logout(): Promise<void> {
    await this.authService.signOut();
  }
}
```

- [ ] **Step 2: Crear home.component.html**

```html
<!-- src/app/features/home/home.component.html -->
<mat-toolbar class="navbar" role="banner">
  <span class="logo">🧋 BubbleTea</span>
  <span class="spacer"></span>
  <span class="user-email" aria-label="Email del usuario">{{ user()?.email }}</span>
  <button mat-button (click)="logout()" aria-label="Cerrar sesión">Cerrar sesión</button>
</mat-toolbar>

<section class="hero" aria-labelledby="hero-title">
  <h1 id="hero-title">Tu bubble tea perfecto,<br />a un clic</h1>
  <p>Descubre nuestra colección artesanal de bubble teas</p>
</section>

<main class="catalog" aria-label="Catálogo de productos">
  <h2>Nuestro menú</h2>
  <div class="product-grid" role="list" aria-label="Lista de productos">
    @for (product of products(); track product.name) {
      <div role="listitem">
        <app-product-card [item]="product" />
      </div>
    }
  </div>
</main>
```

- [ ] **Step 3: Crear home.component.css**

```css
/* src/app/features/home/home.component.css */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #3b5bdb;
  color: white;
}

.logo {
  font-size: 1.25rem;
  font-weight: 700;
}

.spacer {
  flex: 1;
}

.user-email {
  font-size: 0.875rem;
  opacity: 0.85;
  margin-right: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

.hero {
  background: linear-gradient(135deg, #3b5bdb 0%, #9775fa 100%);
  color: white;
  text-align: center;
  padding: 5rem 1.5rem;
}

.hero h1 {
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 1rem;
}

.hero p {
  font-size: 1.125rem;
  opacity: 0.9;
  margin: 0;
}

.catalog {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
}

.catalog h2 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #3b5bdb;
  margin: 0 0 1.5rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/features/home/
git commit -m "feat: add HomeComponent with navbar, hero section, and product catalog"
```

---

## Task 12: Poblar environment.ts con credenciales reales

**Files:**
- Modify: `src/environments/environment.ts`

- [ ] **Step 1: Copiar las credenciales de .env.local al environment.ts**

Abre `.env.local` y copia los valores al `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: '<valor de .env.local>',
    authDomain: '<valor de .env.local>',
    projectId: '<valor de .env.local>',
    storageBucket: '<valor de .env.local>',
    messagingSenderId: '<valor de .env.local>',
    appId: '<valor de .env.local>',
  },
};
```

> Este archivo está en `.gitignore`, no se comiteará.

---

## Task 13: Verificación final

- [ ] **Step 1: Correr todos los tests**

```bash
npm test -- --reporter=verbose
```

Expected: todos los tests pasan (authGuard × 2, passwordMatchValidator × 3).

- [ ] **Step 2: Arrancar la app**

```bash
npm start
```

Expected: compila sin errores en `http://localhost:4200`.

- [ ] **Step 3: Verificar flujo completo en el navegador**

1. Navega a `http://localhost:4200` → redirige a `/login`
2. Accede a `http://localhost:4200/home` sin estar logado → redirige a `/login`
3. Haz clic en "Regístrate" → navega a `/register`
4. Registra una cuenta nueva → redirige a `/home`
5. Verifica que el email aparece en el navbar y que se ven las 6 tarjetas de productos
6. Haz clic en "Cerrar sesión" → redirige a `/login`
7. Inicia sesión con las credenciales creadas → redirige a `/home`

- [ ] **Step 4: Commit final**

```bash
git add .
git commit -m "feat: complete auth flow with Login, Register, and Home pages"
```
