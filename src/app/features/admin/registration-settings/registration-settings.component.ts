import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-registration-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registration-settings.component.html',
  styleUrl: './registration-settings.component.scss',
})
export class RegistrationSettingsComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  readonly enabled = signal(false);
  readonly isLoading = signal(false);
  readonly isSaving = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.adminService.getRegistrationSettings().subscribe({
      next: (settings) => {
        this.enabled.set(settings.enabled);
      },
      error: () => {
        this.error.set('Nie udało się pobrać ustawień rejestracji.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }

  toggleRegistration(): void {
    const nextValue = !this.enabled();

    this.isSaving.set(true);
    this.error.set(null);

    this.adminService.setRegistrationEnabled(nextValue).subscribe({
      next: () => {
        this.enabled.set(nextValue);
      },
      error: () => {
        this.error.set('Nie udało się zapisać ustawień rejestracji.');
        this.isSaving.set(false);
      },
      complete: () => {
        this.isSaving.set(false);
      },
    });
  }
}
