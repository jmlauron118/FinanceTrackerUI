import { Directive, HostListener } from "@angular/core";

@Directive ({
    selector: '[autoLowerCase]'
})
export class AutoLowerCaseDirective {
    @HostListener('input', ['$event']) onInput(event: Event) {
        const input = event.target as HTMLInputElement;
        input.value = input.value.toLowerCase();
    }
}