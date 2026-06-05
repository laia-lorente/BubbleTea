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
import { UserService, CreateUserPayload } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  private userService = inject(UserService);

  readonly currentUser = toSignal(authState(this.auth), { initialValue: null });

  async signIn(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
    await this.router.navigate(['/home']);
  }

  async signUp(email: string, password: string, profile: Omit<CreateUserPayload, 'email'>): Promise<void> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    const token = await credential.user.getIdToken();
    await this.userService.createUser({ email, ...profile }, token);
    await this.router.navigate(['/home']);
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(this.auth);
    await this.router.navigate(['/login']);
  }
}
