import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly transloco = inject(TranslocoService);

  constructor() {
    const savedLanguage = localStorage.getItem('media_store_language') ?? 'pl';
    this.transloco.setActiveLang(savedLanguage);
  }
}
