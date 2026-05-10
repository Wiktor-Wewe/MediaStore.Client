import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ValidationProblemDetails } from '../../../core/api/validation-error.model';
import { AuthService } from '../../../core/auth/auth.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { ApiErrorPipe } from '../../../shared/pipes/api-error.pipe';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslocoPipe, ApiErrorPipe],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly isSubmitting = signal(false);
  readonly isRegistered = signal(false);
  readonly apiErrors = signal<Record<string, string[]>>({});

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  submit(): void {
    this.apiErrors.set({});
    this.isRegistered.set(false);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    this.authService.register(this.form.getRawValue()).subscribe({
      next: () => {
        this.form.reset({
          email: '',
          password: '',
        });

        this.isRegistered.set(true);
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
