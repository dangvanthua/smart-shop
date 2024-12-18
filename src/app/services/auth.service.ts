import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { ApiResponse } from "../dto/response/api-response.model";
import { AuthResponse } from "../dto/response/auth-response.model";
import { TokenService } from "./token.service";
import { AuthRequest } from "../dto/request/auth-request.model";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private AUTH_API = `${environment.apiUrl}/auth`;

    constructor(
        private http: HttpClient,
        private jwtHelper: JwtHelperService,
        private tokenService: TokenService) { }

    login(authRequest: AuthRequest): Observable<ApiResponse<AuthResponse>> {
        return this.http.post<ApiResponse<AuthResponse>>(
            `${this.AUTH_API}/token`,
            authRequest);
    }

    refreshToken(): Observable<AuthResponse> {
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

    hasRole(role: string) {
        const token = this.tokenService.getToken();

        if(token === null) {
            return false;
        }

        const decodedToken = this.jwtHelper.decodeToken(token);

        return decodedToken['scope'].includes(role);
    }

    getExpriesAt() {
        const token = this.tokenService.getToken();

        if(token === null) {
            return false;
        }

        const decodedToken = this.jwtHelper.decodeToken(token);

        return decodedToken['exp'];
    }

    isTokenExpried(token: string) {
        return this.jwtHelper.isTokenExpired(token, 5);
    }

    isAuthenticated(): boolean {
        const token = this.tokenService.getToken();
        return !!token;
    }
}