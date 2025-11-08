import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseCategoryDialogComponent } from './expense-category-dialog.component';

describe('ExpenseCategoryDialogComponent', () => {
  let component: ExpenseCategoryDialogComponent;
  let fixture: ComponentFixture<ExpenseCategoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseCategoryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
