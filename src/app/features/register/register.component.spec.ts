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
