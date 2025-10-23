import { Directive, HostListener } from "@angular/core";

@Directive ({
    selector: '[lowerCase]'
})
export class LowerCaseDirective {
    @HostListener('input', ['$event']) onInput(event: Event) {
        const input = event.target as HTMLInputElement;
        input.value = input.value.toLowerCase();
    }
}