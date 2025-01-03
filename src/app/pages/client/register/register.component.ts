import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { UserRequest } from '../../../dto/request/user-request.model';
import { ApiResponse } from '../../../dto/response/api-response.model';
import { UserResponse } from '../../../dto/response/user-response.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  private userService = inject(UserService);

  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, this.nameValidator]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, this.phoneValidator]],
      password: ['', [Validators.required, this.passwordValidator]],
      dob: [null, [Validators.required, this.dateOfBirthValidator]]
    });
  }

  // Custom validator for name
  nameValidator(control: AbstractControl): ValidationErrors | null {
    const namePattern = /^[A-Za-z ]+$/;
    const hasInvalidCharacters = !namePattern.test(control.value);
    const hasConsecutiveSpaces = /\s{2,}/.test(control.value);
    if (hasInvalidCharacters || hasConsecutiveSpaces) {
      return { invalidName: true };
    }
    return null;
  }

  // Custom validator for phone
  phoneValidator(control: AbstractControl): ValidationErrors | null {
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(control.value)) {
      return { invalidPhone: true };
    }
    return null;
  }

  // Custom validator for password
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{7,}$/;
    if (!passwordPattern.test(control.value)) {
      return { invalidPassword: true };
    }
    return null;
  }

  // Custom validator for date of birth
  dateOfBirthValidator(control: AbstractControl): ValidationErrors | null {
    const date = new Date(control.value);
    const today = new Date();
    const ageLimitDate = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate());
    if (date >= today || date > ageLimitDate) {
      return { invalidDOB: true };
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const userRequest: UserRequest = {
        fullname: this.registerForm.value.name,
        email: this.registerForm.value.email,
        phone_number: this.registerForm.value.phone,
        password: this.registerForm.value.password,
        date_of_birth: this.registerForm.value.dob,
      };

      this.userService.register(userRequest).subscribe({
        next: (response: ApiResponse<UserResponse>) => {
          if (response.code === 1000) {
            console.log(response.message);
          }
        },
        error: (err) => {
          console.log(err);
        }
      })
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}

