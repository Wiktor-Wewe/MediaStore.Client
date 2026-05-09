import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_BASE_URL } from '../../../core/api/api.config';
import { PagedResponse } from '../../../core/api/paged-response.model';
import { AdminUser, AdminUserFilters, RegistrationSettings } from '../models/admin-user.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private readonly http: HttpClient) {}

  getUsers(filters: AdminUserFilters) {
    let params = new HttpParams()
      .set('pageNumber', filters.pageNumber)
      .set('pageSize', filters.pageSize)
      .set('sortBy', filters.sortBy)
      .set('sortDirection', filters.sortDirection);

    if (filters.email) params = params.set('email', filters.email);
    if (filters.status) params = params.set('status', filters.status);

    return this.http.get<PagedResponse<AdminUser>>(`${API_BASE_URL}/admin/users`, { params });
  }

  approveUser(id: string) {
    return this.http.post<void>(`${API_BASE_URL}/admin/users/${id}/approve`, {});
  }

  deleteUser(id: string) {
    return this.http.delete<void>(`${API_BASE_URL}/admin/users/${id}`);
  }

  getRegistrationSettings() {
    return this.http.get<RegistrationSettings>(`${API_BASE_URL}/admin/settings/registration`);
  }

  setRegistrationEnabled(enabled: boolean) {
    return this.http.post<void>(`${API_BASE_URL}/admin/settings/registration`, { enabled });
  }
}
