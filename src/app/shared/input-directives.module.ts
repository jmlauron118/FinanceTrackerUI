import { AutoTitleCaseDirective } from "app/directive/auto-title-case.directive";
import { AutoLowerCaseDirective } from "app/directive/auto-lowercase.directive";
import { NgModule } from "@angular/core";

@NgModule({
    imports: [
        AutoTitleCaseDirective,
        AutoLowerCaseDirective  
    ],
    exports: [
        AutoTitleCaseDirective,
        AutoLowerCaseDirective
    ]
})
export class InputDirectivesModule {}