import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "../dto/response/api-response.model";
import { AuthResponse } from "../dto/response/auth-response.model";
import { RefreshRequest } from "../dto/request/refresh-request.model";
import { TokenService } from "./token.service";
import { AuthRequest } from "../dto/request/auth-request.model";

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

    refreshAccessToken(): Observable<ApiResponse<AuthResponse>> {
        const refreshToken = this.tokenService.getToken();

        const refreshRequest: RefreshRequest = {
            token: refreshToken
        };

        return this.http.post<ApiResponse<AuthResponse>>(
            `${this.AUTH_API}/refresh`,
            refreshRequest
        );
    }
}