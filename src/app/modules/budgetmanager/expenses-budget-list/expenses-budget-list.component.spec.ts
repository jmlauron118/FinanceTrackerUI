import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesBudgetListComponent } from './expenses-budget-list.component';

describe('ExpensesBudgetListComponent', () => {
  let component: ExpensesBudgetListComponent;
  let fixture: ComponentFixture<ExpensesBudgetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpensesBudgetListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpensesBudgetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
