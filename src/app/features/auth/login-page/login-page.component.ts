import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { ValidationProblemDetails } from '../../../core/api/validation-error.model';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslocoPipe],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly apiErrors = signal<Record<string, string[]>>({});

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit(): void {
    this.apiErrors.set({});

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.router.navigateByUrl('/products');
      },
      error: (err) => {
        const problem = err.error as ValidationProblemDetails;

        if (problem?.errors) {
          this.apiErrors.set(problem.errors);
        }

        this.isSubmitting.set(false);
      },
      complete: () => {
        this.isSubmitting.set(false);
      },
    });
  }
}
