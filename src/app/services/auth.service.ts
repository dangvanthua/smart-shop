import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, throwError } from "rxjs";
import { ApiResponse } from "../dto/response/api-response.model";
import { AuthResponse } from "../dto/response/auth-response.model";
import { TokenService } from "./token.service";
import { AuthRequest } from "../dto/request/auth-request.model";
import { RefreshRequest } from "../dto/request/refresh-request.model";



@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private AUTH_API = `${environment.apiUrl}/auth`;

    constructor(
        private http: HttpClient,
        private tokenService: TokenService) { }

    login(authRequest: AuthRequest): Observable<ApiResponse<AuthResponse>> {
        return this.http.post<ApiResponse<AuthResponse>>(
            `${this.AUTH_API}/token`,
            authRequest);
    }

    refreshToken(): Observable<ApiResponse<AuthResponse>> {
        const refreshToken = this.tokenService.getToken();
    
        if (!refreshToken) {
            return throwError(() => new Error('No refresh token available'));
        }

        const newRequestToken: RefreshRequest = {
            token: refreshToken
        }
    
        // Gửi token trong Authorization header (vì refresh là endpoint yêu cầu token)
        return this.http.post<ApiResponse<AuthResponse>>(`${this.AUTH_API}/refresh`, newRequestToken).pipe(
            map(response => {
                if (response.code === 1000 && response.result) {
                    const newToken = response.result.token;
                    this.tokenService.saveToken(newToken);  // Lưu token mới
                }
                return response;
            }),
            catchError(error => {
                console.error("Refresh token failed:", error);
                return throwError(() => new Error("Refresh token failed"));
            })
        );
    }

    logout() {
        this.tokenService.removeToken();
    }

    isAuthenticated(): boolean {
        const token = this.tokenService.getToken();
        const isTokenExpried = this.tokenService.isTokenExpired();
        return !!token && !isTokenExpried;
    }
}