import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiError, ErrorCode } from '../../models/api-error.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  protected registerForm: FormGroup = inject(FormBuilder).group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  protected showPassword: boolean = false;
  protected errorMessage: string = '';
  private readonly authService: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);

  onSubmit() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Vänligen fyll i alla fält.';
      return;
    }

    this.errorMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log('Registrering lyckades:', response);
        this.router.navigate(['books']);
      },
      error: (error: ApiError) => {
        console.error('Registrering misslyckades:', error);
        switch (error.code) {
          case ErrorCode.USERNAME_EMPTY:
            this.registerForm.get('username')?.setErrors({ required: true });
            break;
          case ErrorCode.EMAIL_EMPTY:
            this.registerForm.get('email')?.setErrors({ required: true });
            break;
          case ErrorCode.USERNAME_TAKEN:
            this.registerForm.get('username')?.setErrors({ taken: true });
            break;
          case ErrorCode.EMAIL_TAKEN:
            this.registerForm.get('email')?.setErrors({ taken: true });
            break;
          case ErrorCode.PASSWORD_TOO_SHORT:
            this.registerForm.get('password')?.setErrors({ minlength: true });
            break;
          case ErrorCode.INTERNAL_SERVER_ERROR:
            this.errorMessage = 'Ett fel uppstod vid registrering. Försök igen senare.';
            break;
          default:
            this.errorMessage = 'Ett fel uppstod vid registrering. Försök igen senare.';
        }
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
