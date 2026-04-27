import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { LoginBody, LoginResponse } from "./auth.types";
import { environment } from "../../environment/environment";
import { tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenSignal = signal<string | null>(null);

  readonly token = this.tokenSignal.asReadonly();
   
  login(body: LoginBody) {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, this.normalizeLoginBody(body)).pipe(
      tap((response) => {
        this.tokenSignal.set(response.token);
      })
    );
  }

  private normalizeLoginBody(body: LoginBody) {
    return {
      email: body.email.trim().toLowerCase(),
      password: body.password.trim(),
    };
  }
}