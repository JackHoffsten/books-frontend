import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
      error: (error) => {
        console.error('Inloggning misslyckades:', error);
        this.errorMessage = 'Inloggning misslyckades. Kontrollera dina uppgifter och försök igen.';
      }
    });
  }
}
