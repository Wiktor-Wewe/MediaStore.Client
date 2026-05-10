import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { Product, ProductFilters } from '../../models/product.model';
import { PagedResponse } from '../../../../core/api/paged-response.model';
import { AuthService } from '../../../../core/auth/auth.service';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductFormComponent],
  templateUrl: './product-list-page.component.html',
  styleUrl: './product-list-page.component.scss',
})
export class ProductListPageComponent implements OnInit {
  readonly products = signal<Product[]>([]);
  readonly totalCount = signal(0);
  readonly totalPages = signal(0);
  readonly isLoading = signal(false);

  readonly filters = signal<ProductFilters>({
    search: '',
    minPrice: null,
    maxPrice: null,
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'name',
    sortDirection: 'asc',
  });

  constructor(
    private readonly productsService: ProductsService,
    public readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);

    this.productsService.getProducts(this.filters()).subscribe({
      next: (response: PagedResponse<Product>) => {
        this.products.set(response.items);
        this.totalCount.set(response.totalCount);
        this.totalPages.set(response.totalPages);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }

  applyFilters(): void {
    this.filters.update((current) => ({
      ...current,
      pageNumber: 1,
    }));

    this.loadProducts();
  }

  changePage(pageNumber: number): void {
    if (pageNumber < 1 || pageNumber > this.totalPages()) return;

    this.filters.update((current) => ({
      ...current,
      pageNumber,
    }));

    this.loadProducts();
  }

  updateSearch(value: string): void {
    this.filters.update((current) => ({ ...current, search: value }));
  }

  updateSortBy(value: 'code' | 'name' | 'price'): void {
    this.filters.update((current) => ({ ...current, sortBy: value }));
    this.applyFilters();
  }

  updateSortDirection(value: 'asc' | 'desc'): void {
    this.filters.update((current) => ({ ...current, sortDirection: value }));
    this.applyFilters();
  }
}
