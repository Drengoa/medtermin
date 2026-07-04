import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusTranslate',
  standalone: false
})
export class StatusTranslate implements PipeTransform {

  transform(value: string): string {
    const translations: { [key: string]: string } = {
      pending: 'Na čekanju',
      confirmed: 'Potvrđen',
      cancelled: 'Otkazan',
      completed: 'Završen'
    };

    return translations[value] || value;
  }

}