import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncUnbudgetedExpensesDialogComponent } from './sync-unbudgeted-expenses-dialog.component';

describe('SyncUnbudgetedExpensesDialogComponent', () => {
  let component: SyncUnbudgetedExpensesDialogComponent;
  let fixture: ComponentFixture<SyncUnbudgetedExpensesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyncUnbudgetedExpensesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SyncUnbudgetedExpensesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
