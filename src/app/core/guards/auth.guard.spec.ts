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
