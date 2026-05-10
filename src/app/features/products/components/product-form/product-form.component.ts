import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { ValidationProblemDetails } from '../../../../core/api/validation-error.model';
import { TranslocoPipe } from '@jsverse/transloco';
import { ApiErrorPipe } from '../../../../shared/pipes/api-error.pipe';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslocoPipe, ApiErrorPipe],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly productsService = inject(ProductsService);

  @Output() productCreated = new EventEmitter<void>();

  readonly isSubmitting = signal(false);
  readonly apiErrors = signal<Record<string, string[]>>({});

  readonly form = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.maxLength(10)]],
    name: ['', [Validators.required, Validators.maxLength(100)]],
    price: [0, [Validators.required, Validators.min(0.01)]],
    imageUrl: [''],
    descriptionPl: [''],
    descriptionEn: [''],
    descriptionDe: [''],
    descriptionCs: [''],
  });

  submit(): void {
    this.apiErrors.set({});

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const request = {
      code: value.code,
      name: value.name,
      price: value.price,
      imageUrl: value.imageUrl || null,
      descriptions: {
        pl: value.descriptionPl,
        en: value.descriptionEn,
        de: value.descriptionDe,
        cs: value.descriptionCs,
      },
    };

    this.isSubmitting.set(true);

    this.productsService.createProduct(request).subscribe({
      next: () => {
        this.form.reset({
          code: '',
          name: '',
          price: 0,
          imageUrl: '',
          descriptionPl: '',
          descriptionEn: '',
          descriptionDe: '',
          descriptionCs: '',
        });

        this.productCreated.emit();
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

  hasError(controlName: 'code' | 'name' | 'price'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }
}
