export interface AdminUser {
  id: string;
  email: string;
  role: string;
  status: 'Pending' | 'Active';
}

export interface AdminUserFilters {
  email?: string;
  status?: 'Pending' | 'Active' | null;
  pageNumber: number;
  pageSize: number;
  sortBy: 'email' | 'status';
  sortDirection: 'asc' | 'desc';
}

export interface RegistrationSettings {
  enabled: boolean;
}
