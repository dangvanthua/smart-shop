import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapGoogle, bootstrapFacebook } from '@ng-icons/bootstrap-icons';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthRequest } from '../../dto/request/auth-request.model';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { ApiResponse } from '../../dto/response/api-response.model';
import { AuthResponse } from '../../dto/response/auth-response.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgIconComponent,
    ReactiveFormsModule,
    CommonModule],
  viewProviders: [provideIcons({ bootstrapGoogle, bootstrapFacebook })],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authSerivce: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      phone: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const phone_number = this.loginForm.value.phone;
      const password = this.loginForm.value.password;
      const authRequest: AuthRequest = { phone_number, password };
      this.authSerivce.login(authRequest).subscribe({
        next: (response: ApiResponse<AuthResponse>) => {
          if (response.code === 1000) {
            if (response.result?.authenticated && response.result.token) {
              console.log(response.result.token);
              const accessToken = response.result.token;
              this.tokenService.saveToken(accessToken);
              this.router.navigate(['']);
            }
          }
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  loginWithGoogle() {
    this.authSerivce.authenticate("google").subscribe({
      next: (response: ApiResponse<string>) => {
        if(response.code === 1000 && response.result) {
          const url = response.result;
          window.location.href = url;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  loginWithFacebook() {
    this.authSerivce.authenticate("facebook").subscribe({
      next: (response: ApiResponse<string>) => {
        if(response.code === 1000 && response.result) {
          const url = response.result;
          window.location.href = url;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}


