import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { ApiResponse } from "../dto/response/api-response.model";
import { AuthResponse } from "../dto/response/auth-response.model";
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

    refreshToken(): Observable<AuthResponse> {
        debugger;
        const refreshToken = this.tokenService.getToken();
    
        return this.http.post<ApiResponse<AuthResponse>>(`${this.AUTH_API}/refresh`, { token: refreshToken }).pipe(
            map((response: ApiResponse<AuthResponse>) => {
                if (!response.result) {
                    throw new Error('Token refresh failed: Result is null');
                }
                return response.result;
            })
        );
    }

    logout() {
        this.tokenService.removeToken();
    }

    isAuthenticated(): boolean {
        const token = this.tokenService.getToken();
        return !!token;
    }
}