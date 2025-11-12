import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetEntryListComponent } from './budget-entry-list.component';

describe('BudgetEntryListComponent', () => {
  let component: BudgetEntryListComponent;
  let fixture: ComponentFixture<BudgetEntryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetEntryListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetEntryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
