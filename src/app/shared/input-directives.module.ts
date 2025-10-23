import { TitleCaseDirective } from "app/directive/title-case.directive";
import { LowerCaseDirective } from "app/directive/lowercase.directive";
import { NumbersOnlyDirective } from "app/directive/numbers-only.directive";
import { DecimalDirective } from "app/directive/decimal.directive";
import { UpperCaseDirective } from "app/directive/uppercase.directive";
import { NgModule } from "@angular/core";

@NgModule({
    imports: [
        TitleCaseDirective,
        LowerCaseDirective,
        UpperCaseDirective,
        NumbersOnlyDirective,
        DecimalDirective
    ],
    exports: [
        TitleCaseDirective,
        LowerCaseDirective,
        UpperCaseDirective,
        NumbersOnlyDirective,
        DecimalDirective
    ]
})
export class InputDirectivesModule {}