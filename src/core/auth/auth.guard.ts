import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { catchError, map, of } from "rxjs";

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Если токен и пользователь существуют, то пропускаем
    if (authService.isAuthenticated()) {
        return true;
    }

    // Пытаемся получить пользователя, если токен существует, но пользователь не существует
    if (authService.token() && !authService.currentUser()) {
        return authService.getMe().pipe(
            map(() => true),
            catchError(() => of(router.createUrlTree(['/login'])))
        );
    }
    
    // Если токен не существует, то перенаправляем на страницу авторизации
    return of(router.createUrlTree(['/login']));
}

export const guestGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.token() && !authService.currentUser()) {
        return authService.getMe().pipe(
            map(() => router.createUrlTree(['/home']),
            catchError(() => of(true)))
        );
    }
    
    return of(true);
}