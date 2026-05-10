import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_BASE_URL } from '../../../core/api/api.config';
import {
  CreateProductRequest,
  Product,
  ProductDetails,
  ProductFilters,
} from '../models/product.model';
import { PagedResponse } from '../../../core/api/paged-response.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  constructor(private readonly http: HttpClient) {}

  getProducts(filters: ProductFilters) {
    let params = new HttpParams()
      .set('pageNumber', filters.pageNumber)
      .set('pageSize', filters.pageSize)
      .set('sortBy', filters.sortBy)
      .set('sortDirection', filters.sortDirection);

    if (filters.search) params = params.set('search', filters.search);
    if (filters.minPrice !== null && filters.minPrice !== undefined)
      params = params.set('minPrice', filters.minPrice);
    if (filters.maxPrice !== null && filters.maxPrice !== undefined)
      params = params.set('maxPrice', filters.maxPrice);

    return this.http.get<PagedResponse<Product>>(`${API_BASE_URL}/products`, { params });
  }

  getProductDetails(id: string, language: string) {
    return this.http.get<ProductDetails>(`${API_BASE_URL}/products/${id}`, {
      params: {
        language,
      },
    });
  }

  createProduct(request: CreateProductRequest) {
    return this.http.post<Product>(`${API_BASE_URL}/products`, request);
  }

  deleteProduct(id: string) {
    return this.http.delete<void>(`${API_BASE_URL}/products/${id}`);
  }
}
