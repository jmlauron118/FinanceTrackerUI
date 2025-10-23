import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[withDecimal]'
})
export class DecimalDirective {
  @HostListener('input', ['$event']) onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    value = value.replace(/[^0-9.]/g, '');

    const parts = value.split('.');

    if(parts.length > 2) {
      value = `${parts[0]}.${parts.slice(1).join('')}`;
    }
    
    input.value = value;
  }
}
