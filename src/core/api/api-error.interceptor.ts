import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { AuthService } from "../auth/auth.service";
import { inject, NgZone } from "@angular/core";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { APP_TOAST_KEY } from "../toast-key";

export const apiInterceptor: HttpInterceptorFn = (request, next) => {
    const ngZone = inject(NgZone);
    const authService = inject(AuthService);
    const messageService = inject(MessageService);
    const router = inject(Router);

    return next(request).pipe(
        catchError((error: unknown) => {
            if (error instanceof HttpErrorResponse) {
                ngZone.run(() => {
                    handleHttpError(error, request.url, authService, messageService, router);
                });
            }

            return throwError(() => error);
        })

    )

}



function handleHttpError(
    error: HttpErrorResponse,
    requestUrl: string,
    authService: AuthService,
    messageService: MessageService,
    router: Router
) {
    const isAuthEndpoint = requestUrl.includes('login') || requestUrl.includes('register');

    if (error.status === 401 && !isAuthEndpoint) {
        // authService.logout();
        messageService.add({
            key: APP_TOAST_KEY,
            severity: 'warn',
            summary: 'Сессия истекла',
            detail: 'Пожалуйста, авторизуйтесь звново',

        });

        router.navigate(['/login']);
    }
    else {
        messageService.add({
            key: APP_TOAST_KEY,
            severity: 'error',
            summary: 'Ошибка',
            detail: error?.error?.message || 'Произошла неизвестная ошибка',
        });
    }
}

