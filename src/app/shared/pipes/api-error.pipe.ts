import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Pipe({
  name: 'apiError',
  standalone: true,
})
export class ApiErrorPipe implements PipeTransform {
  private readonly transloco = inject(TranslocoService);

  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    return this.transloco.translate(value.toLowerCase());
  }
}
