import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { switchMap, take, tap } from 'rxjs';
import { ApiResponse } from '../../dto/response/api-response.model';
import { AuthResponse } from '../../dto/response/auth-response.model';
import { TokenService } from '../../services/token.service';
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../dto/response/user-response.model';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [],
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.scss'
})
export class AuthCallbackComponent {

  constructor(
    private router: Router,
    private activeRouted: ActivatedRoute,
    private authService: AuthService,
    private tokenService: TokenService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const url = this.router.url;
    let loginType: 'google' | 'facebook';

    if (url.includes('/auth/google/callback')) {
      loginType = 'google';
    } else if (url.includes('/auth/facebook/callback')) {
      loginType = 'facebook';
    } else {
      console.error('Loại đăng nhập không hợp lệ.');
      this.router.navigate(['/error']);
      return;
    }

    this.activeRouted.queryParams.pipe(take(1)).subscribe(params => {
      const code = params['code'];
      console.log(code, loginType);
      if (code) {
        this.authService.exchangeCodeForToken(code, loginType).pipe(
          tap((response: ApiResponse<AuthResponse>) => {
            if (response.code === 1000 && response.result) {
              const token = response.result.token;
              this.tokenService.saveToken(token);
            }
          }),
          switchMap(() => this.userService.getUserDetail())
        ).subscribe({
          next: (apiResponse: ApiResponse<UserResponse>) => {
            if (apiResponse.code === 1000 && apiResponse.result) {
              const result = apiResponse.result;
              const roles = result.role_responses || []; 

              const adminRole = roles.find(role => role.name === 'ADMIN');
              const userRole = roles.find(role => role.name === 'USER');
          
              if (adminRole) {
                this.router.navigate(['/admin']); 
              } else if (userRole) {
                this.router.navigate(['/']); 
              } else {
                console.error('Vai trò không hợp lệ.');
                this.router.navigate(['/login']);
              }
            } else {
              console.error('Xác thực không thành công.');
              this.router.navigate(['/login']);
            }
          },
          error: (err) => {
            console.error('Lỗi xác thực:', err);
            this.router.navigate(['/error']);
          },
        });
      } else {
        console.error('Không tìm thấy mã xác thực trong URL.');
        this.router.navigate(['/error']);
      }
    });
  }
}
