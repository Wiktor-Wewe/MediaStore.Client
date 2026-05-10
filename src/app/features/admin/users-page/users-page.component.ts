import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PagedResponse } from '../../../core/api/paged-response.model';
import { RegistrationSettingsComponent } from '../registration-settings/registration-settings.component';
import { AdminUser, AdminUserFilters } from '../models/admin-user.model';
import { AdminService } from '../services/admin.service';
import { translateError } from '../../../shared/utils/error-code-map';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RegistrationSettingsComponent],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss',
})
export class UsersPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  readonly users = signal<AdminUser[]>([]);
  readonly totalCount = signal(0);
  readonly totalPages = signal(0);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  readonly filters = signal<AdminUserFilters>({
    email: '',
    status: null,
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'email',
    sortDirection: 'asc',
  });

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.adminService.getUsers(this.filters()).subscribe({
      next: (response: PagedResponse<AdminUser>) => {
        this.users.set(response.items);
        this.totalCount.set(response.totalCount);
        this.totalPages.set(response.totalPages);
      },
      error: () => {
        this.error.set('Nie udało się pobrać listy administratorów.');
        this.isLoading.set(false);
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

    this.loadUsers();
  }

  clearFilters(): void {
    this.filters.set({
      email: '',
      status: null,
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'email',
      sortDirection: 'asc',
    });

    this.loadUsers();
  }

  changePage(pageNumber: number): void {
    if (pageNumber < 1 || pageNumber > this.totalPages()) {
      return;
    }

    this.filters.update((current) => ({
      ...current,
      pageNumber,
    }));

    this.loadUsers();
  }

  updateEmail(value: string): void {
    this.filters.update((current) => ({
      ...current,
      email: value,
    }));
  }

  updateStatus(value: string): void {
    this.filters.update((current) => ({
      ...current,
      status: value ? (value as 'Pending' | 'Active') : null,
    }));
  }

  updateSortBy(value: 'email' | 'status'): void {
    this.filters.update((current) => ({
      ...current,
      sortBy: value,
    }));

    this.applyFilters();
  }

  updateSortDirection(value: 'asc' | 'desc'): void {
    this.filters.update((current) => ({
      ...current,
      sortDirection: value,
    }));

    this.applyFilters();
  }

  approveUser(id: string): void {
    this.adminService.approveUser(id).subscribe({
      next: () => this.loadUsers(),
      error: () => {
        this.error.set('Nie udało się zatwierdzić administratora.');
      },
    });
  }

  deleteUser(id: string): void {
    const confirmed = confirm('Czy na pewno chcesz usunąć tego administratora?');

    if (!confirmed) {
      return;
    }

    this.adminService.deleteUser(id).subscribe({
      next: () => this.loadUsers(),
      error: (err) => {
        const firstError = this.getFirstError(err.error?.errors);

        this.error.set(
          firstError ? translateError(firstError) : 'Nie udało się usunąć administratora.'
        );
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
