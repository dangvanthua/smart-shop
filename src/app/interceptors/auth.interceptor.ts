import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, switchMap, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";
import { ApiResponse } from "../dto/response/api-response.model";
import { AuthResponse } from "../dto/response/auth-response.model";
import { TokenService } from "../services/token.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private tokenService: TokenService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authReq = req;
        const token = this.tokenService.getToken();

        if (token) {
            authReq = req.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
            });
        }

        return next.handle(authReq).pipe(
            catchError(error => {
                if (error.status === 401) {
                    return this.authService.refreshAccessToken().pipe(
                        map((response: ApiResponse<AuthResponse>) => {
                            if (response.result && response.result.access_token) {
                                const newAccessToken = response.result.access_token;
                                this.tokenService.saveToken(newAccessToken);
                                return newAccessToken;
                            }
                            throw new Error('Failed to refresh access token');
                        }),
                        switchMap(newToken => {
                            const retryReq = req.clone({
                                setHeaders: { Authorization: `Bearer ${newToken}` }
                            });
                            return next.handle(retryReq);
                        })
                    );
                }
                return throwError(() => error);
            })
        );
    }
}
