import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    localStorage?: Storage;
    private readonly TOKEN_KEY = 'accessToken';
    private jwtHelperService = new JwtHelperService();

    constructor(@Inject(DOCUMENT) private document: Document) {
        this.localStorage = document.defaultView?.localStorage;
    }

    saveToken(token: string) {
        this.localStorage?.setItem(this.TOKEN_KEY, token);
    }

    getToken(): string {
        return this.localStorage?.getItem(this.TOKEN_KEY) ?? '';
    }

    removeToken(): void {
        this.localStorage?.removeItem(this.TOKEN_KEY);
    }

    isLoggedIn() {
        return !!this.getToken();
    }

    isTokenExpired(): boolean {
        if (this.getToken() == null) {
            return false;
        }

        return this.jwtHelperService.isTokenExpired(this.getToken()!);
    }

    getUserIdFromToken(): number | null {
        const token = this.getToken();
        if(!token) return null;

        try {
            const decodeToken = this.jwtHelperService.decodeToken(token);
            return decodeToken?.userId ?? null;
        }catch (error) {
            console.log('Error decoding token: ', error);
            return null;
        }
    }
}