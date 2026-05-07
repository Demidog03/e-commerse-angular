import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { GetMeResponse, LoginBody, LoginResponse, RegisterBody, RegisterResponse, User } from "./auth.types";
import { environment } from "../../environment/environment";
import { catchError, of, tap } from "rxjs";

const TOKEN_KEY = 'token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenSignal = signal<string | null>(this.getTokenFromLocalStorage());
  private readonly currentUserSignal = signal<User | null>(null);

  readonly token = this.tokenSignal.asReadonly();
  readonly currentUser = this.currentUserSignal.asReadonly();

  readonly isAuthenticated = computed(() => {
    return Boolean(this.token()) && Boolean(this.currentUser())
  });

  register(body: RegisterBody) {
    return this.http.post<RegisterResponse>(`${environment.apiUrl}/auth/register`, this.normalizeRegisterBody(body)).pipe(
      tap((response) => {
        this.setSession(response.token, response.user);
      })
    );
  }

  login(body: LoginBody) {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, this.normalizeLoginBody(body)).pipe(
      tap((response) => {
        this.setSession(response.token, response.user);
      })
    );
  }

  getMe() {
    return this.http.get<GetMeResponse>(`${environment.apiUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${this.token()}`
      }
    }).pipe(
      tap((response) => {
        this.currentUserSignal.set(response.user);
      })
    );
  }

  logout() {
    return this.http.post<void>(`${environment.apiUrl}/auth/logout`, {}).pipe(
      catchError(() => {
        // even if backend is unavailable, we still want to clear the local session
        return of(void 0);
      }),
      tap(() => {
        this.clearSession();
      })
    );
  }

  logoutLocal() {
    this.clearSession();
  }

  private getTokenFromLocalStorage() {
    return localStorage.getItem(TOKEN_KEY) ?? null;
  }

  private normalizeLoginBody(body: LoginBody) {
    return {
      email: body.email.trim().toLowerCase(),
      password: body.password.trim(),
    };
  }

  private normalizeRegisterBody(body: RegisterBody) {
    return {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      password: body.password.trim(),
    };
  }

  private setSession(token: string, user: User) {
    this.tokenSignal.set(token);
    localStorage.setItem(TOKEN_KEY, token);
    this.currentUserSignal.set(user);
  }

  private clearSession() {
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);
    localStorage.removeItem(TOKEN_KEY);
  }
}