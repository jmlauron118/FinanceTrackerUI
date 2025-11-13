import { Component, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/shared/material.module';

@Component({
  selector: 'app-budget-entry',
  imports: [CommonModule, MaterialModule],
  templateUrl: './budget-entry.component.html',
  styleUrls: ['./budget-entry.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BudgetEntryComponent {
  title = "New Budget Entry";
  @Output() back = new EventEmitter<void>();
  constructor () {}

  onBack() {
    this.back.emit();
  }
}
