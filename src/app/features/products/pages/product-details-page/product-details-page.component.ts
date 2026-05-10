import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { AuthService } from '../../../../core/auth/auth.service';
import { ProductDetails } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-product-details-page',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslocoPipe, CurrencyPipe],
  templateUrl: './product-details-page.component.html',
  styleUrl: './product-details-page.component.scss',
})
export class ProductDetailsPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productsService = inject(ProductsService);
  private readonly transloco = inject(TranslocoService);

  readonly authService = inject(AuthService);

  readonly product = signal<ProductDetails | null>(null);
  readonly isLoading = signal(false);
  readonly isDeleting = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set(this.transloco.translate('products.details.loadError'));
      return;
    }

    this.loadProduct(id);
  }

  deleteProduct(): void {
    const currentProduct = this.product();

    if (!currentProduct) {
      return;
    }

    const confirmed = confirm(this.transloco.translate('products.details.deleteConfirm'));

    if (!confirmed) {
      return;
    }

    this.isDeleting.set(true);
    this.error.set(null);

    this.productsService.deleteProduct(currentProduct.id).subscribe({
      next: () => {
        this.router.navigateByUrl('/products');
      },
      error: (err) => {
        const firstError = this.getFirstError(err.error?.errors);

        this.error.set(
          firstError
            ? this.transloco.translate(firstError.toLowerCase())
            : this.transloco.translate('products.details.deleteError')
        );

        this.isDeleting.set(false);
      },
      complete: () => {
        this.isDeleting.set(false);
      },
    });
  }

  private loadProduct(id: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    const language = this.transloco.getActiveLang();

    this.productsService.getProductDetails(id, language).subscribe({
      next: (product) => {
        this.product.set(product);
      },
      error: () => {
        this.error.set(this.transloco.translate('products.details.loadError'));
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }

  private getFirstError(errors?: Record<string, string[]>): string | null {
    if (!errors) {
      return null;
    }

    const firstKey = Object.keys(errors)[0];

    return errors[firstKey]?.[0] ?? null;
  }
}
