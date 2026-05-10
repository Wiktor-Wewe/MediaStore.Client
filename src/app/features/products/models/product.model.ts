export interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
}

export interface ProductDetails {
  id: string;
  code: string;
  name: string;
  price: number;
  imageUrl: string | null;
  description: string | null;
  descriptions: Record<string, string>;
}

export interface CreateProductRequest {
  code: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  descriptions: Record<string, string>;
}

export interface ProductFilters {
  search?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  pageNumber: number;
  pageSize: number;
  sortBy: 'code' | 'name' | 'price';
  sortDirection: 'asc' | 'desc';
}
