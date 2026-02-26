import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsTransactionDialogComponent } from './savings-transaction-dialog.component';

describe('SavingsTransactionDialogComponent', () => {
  let component: SavingsTransactionDialogComponent;
  let fixture: ComponentFixture<SavingsTransactionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingsTransactionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavingsTransactionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
