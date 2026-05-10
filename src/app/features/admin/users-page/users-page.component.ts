import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { PagedResponse } from '../../../core/api/paged-response.model';
import { AdminService } from '../services/admin.service';
import { AdminUser, AdminUserFilters } from '../models/admin-user.model';
import { RegistrationSettingsComponent } from '../registration-settings/registration-settings.component';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RegistrationSettingsComponent, TranslocoPipe],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss',
})
export class UsersPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly transloco = inject(TranslocoService);

  readonly users = signal<AdminUser[]>([]);
  readonly totalCount = signal(0);
  readonly totalPages = signal(0);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  readonly appliedFilters = signal<AdminUserFilters>({
    email: '',
    status: null,
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'email',
    sortDirection: 'asc',
  });

  readonly draftFilters = signal<AdminUserFilters>({
    email: '',
    status: null,
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'email',
    sortDirection: 'asc',
  });

  readonly hasFilterChanges = computed(() => {
    const draft = this.draftFilters();
    const applied = this.appliedFilters();

    return (
      draft.email !== applied.email ||
      draft.status !== applied.status ||
      draft.sortBy !== applied.sortBy ||
      draft.sortDirection !== applied.sortDirection
    );
  });

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.adminService.getUsers(this.appliedFilters()).subscribe({
      next: (response: PagedResponse<AdminUser>) => {
        this.users.set(response.items);
        this.totalCount.set(response.totalCount);
        this.totalPages.set(response.totalPages);
      },
      error: () => {
        this.error.set(this.transloco.translate('admin.users.loadError'));
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

    this.loadUsers();
  }

  clearFilters(): void {
    const defaultFilters: AdminUserFilters = {
      email: '',
      status: null,
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'email',
      sortDirection: 'asc',
    };

    this.appliedFilters.set(defaultFilters);
    this.draftFilters.set(defaultFilters);

    this.loadUsers();
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

    this.loadUsers();
  }

  updateEmail(value: string): void {
    this.draftFilters.update((current) => ({
      ...current,
      email: value,
    }));
  }

  updateStatus(value: string): void {
    this.draftFilters.update((current) => ({
      ...current,
      status: value ? (value as 'Pending' | 'Active') : null,
    }));
  }

  updateSortBy(value: 'email' | 'status'): void {
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

  approveUser(id: string): void {
    this.adminService.approveUser(id).subscribe({
      next: () => this.loadUsers(),
      error: () => {
        this.error.set(this.transloco.translate('admin.users.approveError'));
      },
    });
  }

  deleteUser(id: string): void {
    const confirmed = confirm(this.transloco.translate('admin.users.deleteConfirm'));

    if (!confirmed) {
      return;
    }

    this.adminService.deleteUser(id).subscribe({
      next: () => this.loadUsers(),
      error: (err) => {
        const firstError = this.getFirstError(err.error?.errors);

        this.error.set(
          firstError
            ? this.transloco.translate(firstError.toLowerCase())
            : this.transloco.translate('admin.users.deleteError')
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
