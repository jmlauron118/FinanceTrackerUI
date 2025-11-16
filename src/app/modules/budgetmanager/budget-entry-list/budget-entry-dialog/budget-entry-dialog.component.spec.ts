import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetEntryDialogComponent } from './budget-entry-dialog.component';

describe('BudgetEntryDialogComponent', () => {
  let component: BudgetEntryDialogComponent;
  let fixture: ComponentFixture<BudgetEntryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetEntryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetEntryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
