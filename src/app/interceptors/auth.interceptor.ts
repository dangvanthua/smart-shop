import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../dto/response/api-response.model';
import { AuthResponse } from '../dto/response/auth-response.model';

@Injectable({providedIn: 'root'})
export class JwtInterceptor implements HttpInterceptor {

  private readonly PUBLIC_ENDPOINTS_POST = [
    '/users',
    '/auth/token',
    '/auth/introspect',
    '/auth/logout',
    '/auth/refresh'
  ];

  private readonly PUBLIC_ENDPOINTS_GET = [
    '/categories',
    '/products'
  ];

  private isRefreshing = false; 
  private refreshTokenSubject: string | null = null;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Nếu là public endpoint, không cần thêm Authorization header
    debugger;
    if (this.isPublicEndpoint(req)) {
      return next.handle(req);
    }

    // Nếu không phải public endpoint và có token, thêm Authorization header
    const token = this.tokenService.getToken();
    if (token) {
      req = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isRefreshing) {
          return this.handle401Error(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addAuthorizationHeader(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token)
    });
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject = null;
  
      return this.authService.refreshToken().pipe(
        switchMap((response: ApiResponse<AuthResponse>) => {
          if (response.code === 1000 && response.result) {
            const newToken = response.result.token; // Lấy token mới từ phản hồi
            this.refreshTokenSubject = newToken;
  
            // Gửi lại request ban đầu với token mới
            return next.handle(this.addAuthorizationHeader(req, newToken));
          } else {
            this.authService.logout(); // Đăng xuất nếu làm mới token thất bại
            return throwError(() => new Error('Token refresh failed'));
          }
        }),
        catchError((refreshError) => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => refreshError);
        }),
        finalize(() => {
          this.isRefreshing = false;
        })
      );
    } else {
      // Đợi token mới sẵn sàng và gửi lại request ban đầu
      return new Observable<HttpEvent<any>>((observer) => {
        const interval = setInterval(() => {
          if (this.refreshTokenSubject) {
            clearInterval(interval);
            next
              .handle(this.addAuthorizationHeader(req, this.refreshTokenSubject))
              .subscribe({
                next: (event) => observer.next(event),
                error: (err) => observer.error(err),
                complete: () => observer.complete(),
              });
          }
        }, 100);
      });
    }
  }
  

  private isPublicEndpoint(req: HttpRequest<any>): boolean {
    debugger;
    const isPublicPost = req.method === 'POST' && this.PUBLIC_ENDPOINTS_POST.some(endpoint =>
      this.matchEndpoint(req.url, endpoint)
    );
    const isPublicGet = req.method === 'GET' && this.PUBLIC_ENDPOINTS_GET.some(endpoint =>
      this.matchEndpoint(req.url, endpoint)
    );
    return isPublicPost || isPublicGet;
  }

  private matchEndpoint(url: string, endpoint: string): boolean {
    return url.includes(endpoint);
  }  
}
