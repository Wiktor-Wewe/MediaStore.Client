import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { PagedResponse } from '../../../../core/api/paged-response.model';
import { ValidationProblemDetails } from '../../../../core/api/validation-error.model';
import { AuthService } from '../../../../core/auth/auth.service';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { Product, ProductFilters } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductFormComponent, TranslocoPipe],
  templateUrl: './product-list-page.component.html',
  styleUrl: './product-list-page.component.scss',
})
export class ProductListPageComponent implements OnInit {
  readonly products = signal<Product[]>([]);
  readonly totalCount = signal(0);
  readonly totalPages = signal(0);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  readonly appliedFilters = signal<ProductFilters>({
    search: '',
    minPrice: null,
    maxPrice: null,
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'name',
    sortDirection: 'asc',
  });

  readonly draftFilters = signal<ProductFilters>({
    search: '',
    minPrice: null,
    maxPrice: null,
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'name',
    sortDirection: 'asc',
  });

  readonly hasFilterChanges = computed(() => {
    const draft = this.draftFilters();
    const applied = this.appliedFilters();

    return (
      draft.search !== applied.search ||
      draft.minPrice !== applied.minPrice ||
      draft.maxPrice !== applied.maxPrice ||
      draft.sortBy !== applied.sortBy ||
      draft.sortDirection !== applied.sortDirection
    );
  });

  constructor(
    private readonly productsService: ProductsService,
    private readonly transloco: TranslocoService,
    private readonly router: Router,
    public readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.productsService.getProducts(this.appliedFilters()).subscribe({
      next: (response: PagedResponse<Product>) => {
        this.products.set(response.items);
        this.totalCount.set(response.totalCount);
        this.totalPages.set(response.totalPages);
      },
      error: (err) => {
        const firstError = this.getFirstError(err.error as ValidationProblemDetails);

        this.error.set(
          firstError
            ? this.transloco.translate(firstError.toLowerCase())
            : this.transloco.translate('products.loadError')
        );

        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }

  applyFilters(): void {
    const nextFilters = {
      ...this.draftFilters(),
      pageNumber: 1,
    };

    this.appliedFilters.set(nextFilters);
    this.draftFilters.set(nextFilters);

    this.loadProducts();
  }

  changePage(pageNumber: number): void {
    if (pageNumber < 1 || pageNumber > this.totalPages()) {
      return;
    }

    this.appliedFilters.update((current) => ({
      ...current,
      pageNumber,
    }));

    this.draftFilters.update((current) => ({
      ...current,
      pageNumber,
    }));

    this.loadProducts();
  }

  updateSearch(value: string): void {
    this.draftFilters.update((current) => ({
      ...current,
      search: value,
    }));
  }

  updateMinPrice(value: number | null): void {
    this.draftFilters.update((current) => ({
      ...current,
      minPrice: value,
    }));
  }

  updateMaxPrice(value: number | null): void {
    this.draftFilters.update((current) => ({
      ...current,
      maxPrice: value,
    }));
  }

  updateSortBy(value: 'code' | 'name' | 'price'): void {
    this.draftFilters.update((current) => ({
      ...current,
      sortBy: value,
    }));
  }

  updateSortDirection(value: 'asc' | 'desc'): void {
    this.draftFilters.update((current) => ({
      ...current,
      sortDirection: value,
    }));
  }

  goToDetails(id: string): void {
    this.router.navigate(['/products', id]);
  }

  private getFirstError(problem?: ValidationProblemDetails): string | null {
    if (!problem?.errors) {
      return null;
    }

    const firstKey = Object.keys(problem.errors)[0];

    return problem.errors[firstKey]?.[0] ?? null;
  }
}
