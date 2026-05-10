import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ProductsService } from '../../services/products.service';
import { ProductDetails } from '../../models/product.model';

@Component({
  selector: 'app-product-details-page',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslocoPipe, CurrencyPipe],
  templateUrl: './product-details-page.component.html',
  styleUrl: './product-details-page.component.scss',
})
export class ProductDetailsPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly transloco = inject(TranslocoService);

  readonly product = signal<ProductDetails | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set(this.transloco.translate('products.details.loadError'));
      return;
    }

    this.loadProduct(id);
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
}
