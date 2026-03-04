import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkRemoveDialogComponent } from './bulk-remove-dialog.component';

describe('BulkRemoveDialogComponent', () => {
  let component: BulkRemoveDialogComponent;
  let fixture: ComponentFixture<BulkRemoveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkRemoveDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkRemoveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
