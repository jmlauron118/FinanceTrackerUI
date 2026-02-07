import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionTypeDialogComponent } from './transaction-type-dialog.component';

describe('TransactionTypeDialogComponent', () => {
  let component: TransactionTypeDialogComponent;
  let fixture: ComponentFixture<TransactionTypeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionTypeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
