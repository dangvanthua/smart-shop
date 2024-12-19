import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);

  if (req.url.includes('/products') 
    || req.url.includes('/users/login')
    || req.url.includes('/users/refresh')) {
    return next(req); 
  }

  // Lấy token từ TokenService
  const token = tokenService.getToken();

  // Nếu không có token (người dùng chưa đăng nhập), tiếp tục gửi request mà không có Authorization header
  if (!token) {
    return next(req);
  }

  // Nếu token hết hạn, thực hiện refresh token
  if (tokenService.isTokenExpired()) {
    return authService.refreshToken().pipe(
      switchMap((authResponse) => {
        if (!authResponse || !authResponse.token) {
          throw new Error('Token refresh failed: No new token received');
        }

        // Lưu token mới vào TokenService
        tokenService.saveToken(authResponse.token);

        // Clone lại request với token mới
        const newReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${authResponse.token}`,
          },
        });

        // Tiếp tục với request đã được thêm token mới
        return next(newReq);
      }),
      catchError((refreshErr) => {
        // Log lỗi và xóa token
        console.error('Refresh token error:', refreshErr);
        tokenService.removeToken();
        return throwError(() => new Error('Unable to refresh token: ' + refreshErr.message));
      })
    );
  }

  // Nếu token không hết hạn, tiếp tục với request hiện tại
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq).pipe(
    catchError((err) => {
      // Xử lý lỗi nếu server trả về 401 (Unauthorized)
      if (err.status === 401) {
        return authService.refreshToken().pipe(
          switchMap((authResponse) => {
            if (!authResponse || !authResponse.token) {
              throw new Error('Token refresh failed: No new token received');
            }

            // Lưu token mới vào TokenService
            tokenService.saveToken(authResponse.token);

            // Clone lại request với token mới
            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${authResponse.token}`,
              },
            });

            // Tiếp tục với request đã được thêm token mới
            return next(newReq);
          }),
          catchError((refreshErr) => {
            // Nếu không thể làm mới token, xóa token và điều hướng đến trang đăng nhập
            console.error('Unable to refresh token:', refreshErr);
            tokenService.removeToken();
            return throwError(() => new Error('Unable to refresh token: ' + refreshErr.message));
          })
        );
      }

      // Nếu lỗi không phải 401, trả về lỗi ban đầu
      return throwError(() => err);
    })
  );
};
