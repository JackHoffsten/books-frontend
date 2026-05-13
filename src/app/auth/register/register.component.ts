import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
    password: ['', Validators.required],
  });
  protected showPassword: boolean = false;
  protected errorMessage: string = '';
  private readonly authService: AuthService = inject(AuthService);

  onSubmit() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Vänligen fyll i alla fält.';
      return;
    }

    this.errorMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log('Registrering lyckades:', response);
        // TODO: Navigate to books page
      },
      error: (error) => {
        console.error('Registrering misslyckades:', error);
        this.errorMessage = 'Registrering misslyckades. Försök igen senare.';
      }
    });
  }

}
