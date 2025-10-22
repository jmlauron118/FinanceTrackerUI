import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[autoTitleCase]'
})
export class AutoTitleCaseDirective {
  @HostListener('input', ['$event']) onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = this.toTitleCase(input.value);
  }
  private toTitleCase(value: string): string {
    return value.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
  }
}
