import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiError, ErrorCode } from '../../models/api-error.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  protected readonly loginForm: FormGroup = inject(FormBuilder).group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  protected showPassword: boolean = false;
  protected errorMessage: string = '';
  private readonly authService: AuthService = inject(AuthService);

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Vänligen fyll i alla fält.';
      return;
    }

    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Inloggning lyckades:', response);
        // TODO: Navigate to books page
      },
      error: (error: ApiError) => {
        console.error('Inloggning misslyckades:', error);
        switch (error.code) {
          case ErrorCode.INVALID_CREDENTIALS:
            this.errorMessage = 'Felaktigt användarnamn eller lösenord.';
            break;
          case ErrorCode.INTERNAL_SERVER_ERROR:
            this.errorMessage = 'Ett fel uppstod vid inloggning. Försök igen senare.';
            break;
          default:
            this.errorMessage = 'Inloggning misslyckades. Kontrollera dina uppgifter och försök igen.';
        }
      }
    });
  }
}
