import { Component, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss',
})
export class LanguageSwitcherComponent {
  private readonly transloco = inject(TranslocoService);

  readonly languages = [
    { code: 'pl', label: 'PL' },
    { code: 'en', label: 'EN' },
    { code: 'de', label: 'DE' },
    { code: 'cs', label: 'CS' },
  ];

  get activeLang(): string {
    return this.transloco.getActiveLang();
  }

  setLanguage(language: string): void {
    this.transloco.setActiveLang(language);
    localStorage.setItem('media_store_language', language);
  }
}
