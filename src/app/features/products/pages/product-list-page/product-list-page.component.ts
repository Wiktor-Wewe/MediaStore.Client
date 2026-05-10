import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { PagedResponse } from '../../../../core/api/paged-response.model';
import { AuthService } from '../../../../core/auth/auth.service';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { Product, ProductFilters } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';

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
    public readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);

    this.productsService.getProducts(this.appliedFilters()).subscribe({
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
}
