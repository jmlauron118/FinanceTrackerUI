import { Component, ViewEncapsulation, Inject, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaterialModule } from 'app/shared/material.module';
import { BudgetEntryResponseDto } from '@interfaces/budgetmanager/budget-entry/budget-entry-response-dto';
import { CategoryService } from '@services/category/category.service';
import { SnackbarService } from '@services/snackbar.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BudgetCategoryResponseDto } from '@interfaces/category/budget-category-dto/budget-category-response-dto';
import { ExpenseCategoryResponseDto } from '@interfaces/category/expense-category/expense-category-response-dto';
import { DecimalDirective } from 'app/directive/decimal.directive';
import { BudgetmanagerService } from '@services/budgetmanager/budgetmanager.service';
import { BudgetEntryRequestDto } from '@interfaces/budgetmanager/budget-entry/budget-entry-request-dto';
import { BudgetEntryModifyDto } from '@interfaces/budgetmanager/budget-entry/budget-entry-modify-dto';
import { ConfirmDialogService } from '@services/confirm-dialog.service';
import { LoadingService } from '@services/loading.service';

@Component({
  selector: 'app-budget-entry-dialog',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, DecimalDirective],
  templateUrl: './budget-entry-dialog.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})
export class BudgetEntryDialogComponent {
  budgetEntryForm!: FormGroup;

  budgetCategoryData: BudgetCategoryResponseDto[] = [];
  expenseCategoryData: ExpenseCategoryResponseDto[] = [];
  isEditMode = false;
  expenseCategoryEnabled = true;

  @Output() entrySaved = new EventEmitter<void>();

  constructor(
    private categoryService: CategoryService,
    private budgetManagerService: BudgetmanagerService,
    private snackbar: SnackbarService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private confirm: ConfirmDialogService,
    private loading: LoadingService,
    private dialogRef: MatDialogRef<BudgetEntryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BudgetEntryResponseDto
  ) {
    this.isEditMode = !!data;

    this.budgetEntryForm = this.fb.group({
      budgetEntryId: [data?.budgetEntryId || null],
      budgetCategoryId: [data?.budgetCategoryId || null, Validators.required],
      expenseCategoryId: [{value: '', disabled: true}, !this.expenseCategoryEnabled ? []: [Validators.required]],
      description: [data?.description || '', Validators.required],
      amount: [data?.amount || '', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      dateUsed: [data?.dateUsed ? this.formatDate(data?.dateUsed) : '', Validators.required]
    });
  }

  ngOnInit(): void {
    setTimeout(() =>{
      this.loadBudgetCategory();
      this.loadExpenseCategory();
    });
  }

  addBudgetEntry(entry: BudgetEntryRequestDto): void {
    this.loading.show();
    this.budgetManagerService.addBudgetEntry(entry).subscribe({
      next: response => {
        this.snackbar.success(response.message, 5000);
        this.entrySaved.emit(); 
        this.resetForm();
      },
      error: err => {
        this.snackbar.danger(err, 5000);
        this.loading.hide();
      }
    });
  }

  modifyBudgetEntry(entry: BudgetEntryModifyDto): void {
    this.loading.show();
    this.budgetManagerService.modifyBudgetEntry(entry).subscribe({
      next: response => {
        this.snackbar.success(response.message, 5000);
        this.dialogRef.close(response.data);
        this.resetForm();
      },
      error: err => {
        this.snackbar.danger(err, 5000);
        this.loading.hide();
      }
    });
  }

  onSubmit() {
    if (this.budgetEntryForm.invalid) {
      this.budgetEntryForm.markAllAsTouched();
      return;
    }

    const formData = this.budgetEntryForm.value;
    const data = {
      ...formData,
      dateUsed: this.formatDate(formData.dateUsed)
    }

    this.confirm.openConfirm({
      title: `${this.isEditMode ? 'Update' : 'Save'} Budget Entry`,
      message: `Are you sure you want to ${this.isEditMode ? 'update' : 'save'} this budget entry?`,
      confirmText: this.isEditMode ? 'Update' : 'Save',
      cancelText: 'Cancel',
      icon: 'question'
    }).subscribe(result => {
      if (result) {
        if(this.isEditMode) {
          this.modifyBudgetEntry(data);
        }
        else {
          const { budgetCategoryId, expenseCategoryId, description, amount, dateUsed } = data;
          const newEntry: BudgetEntryRequestDto = { budgetCategoryId, expenseCategoryId, description, amount, dateUsed };
          this.addBudgetEntry(newEntry);
        }
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  resetForm(): void {
    this.budgetEntryForm.reset();
    this.budgetEntryForm.get('expenseCategoryId')?.disable();
  }

  onBudgetCategoryChange(value: number): void {
    const selected = this.budgetCategoryData.find(
      bc => bc.budgetCategoryId === value
    );

    if (selected?.budgetCategoryName === 'Other Expenses') {
      this.expenseCategoryEnabled = false;
      this.budgetEntryForm.get('expenseCategoryId')?.enable();
    }
    else{
      this.expenseCategoryEnabled = true;
      this.budgetEntryForm.get('expenseCategoryId')?.disable();
      this.budgetEntryForm.get('expenseCategoryId')?.setValue('');
    }
  }

  loadBudgetCategory(): void {
    this.categoryService.getAllBudgetCategories(1).subscribe({
      next: response => (this.budgetCategoryData = response.data),
      error: err => (this.snackbar.danger(err, 5000))
    });
  }

  loadExpenseCategory(): void {
    this.categoryService.getAllExpenseCategories(1).subscribe({
      next: response => (this.expenseCategoryData = response.data),
      error: err => (this.snackbar.danger(err, 5000))
    });
  }

  get budgetEntryControls() {
    return this.budgetEntryForm.controls;
  }

  formatDate(date: any): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }
}
