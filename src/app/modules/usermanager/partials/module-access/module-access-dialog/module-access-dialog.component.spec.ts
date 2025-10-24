import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleAccessDialogComponent } from './module-access-dialog.component';

describe('ModuleAccessDialogComponent', () => {
  let component: ModuleAccessDialogComponent;
  let fixture: ComponentFixture<ModuleAccessDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleAccessDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleAccessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
