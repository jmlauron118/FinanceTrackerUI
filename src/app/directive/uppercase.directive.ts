import { Directive, HostListener } from "@angular/core";

@Directive({
    selector: '[upperCase]'
})
export class UpperCaseDirective {
    @HostListener('input', ['$event']) onInput(event: Event) {
        const input = event.target as HTMLInputElement;
        input.value = input.value.toUpperCase();
    }
}