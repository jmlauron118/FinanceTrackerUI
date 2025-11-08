import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MaterialModule } from 'app/shared/material.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsermanagerService } from '@services/usermanager/usermanager.service';
import { SnackbarService } from '@services/snackbar.service';
import { ChangePasswordDto } from '@interfaces/login/change-password-dto';
import { ConfirmDialogService } from '@services/confirm-dialog.service';

@Component({
  selector: 'app-change-password-dialog',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChangePasswordDialogComponent {
  changePassForm!: FormGroup
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  
  constructor(
    private usermanagerService: UsermanagerService,
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private confirm: ConfirmDialogService,
    @Inject(MAT_DIALOG_DATA) public data: ChangePasswordDto
  ) {
    this.changePassForm = this.fb.group({
        currentPassword: [data?.currentPassword || '', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
        newPassword: [data?.newPassword || '', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
        confirmPassword: [data?.confirmPassword || '', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]]
      }, { validators: this.passwordsMatchValidator() }
    );
  }

  changePassword(passwords: ChangePasswordDto): void {
    this.usermanagerService.changePassword(passwords).subscribe({
      next: response => {
        this.snackbar.success(response.message);
        this.dialogRef.close();
      },
      error: err => {
        this.snackbar.warning(err, 4000)
      }
    });
  }

  onSubmit() {
    if(this.changePassForm.invalid) {
      this.changePassForm.markAllAsTouched();

      return;
    }

    this.confirm.openConfirm({
      title: 'Change Password',
      message: 'Are you sure you want to change your password?',
      confirmText: 'Yes',
      cancelText: 'No',
      icon: 'question'
    }).subscribe(result => {
      if(result) {
        this.changePassword(this.changePassForm.value);
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  get changePasswordControls () {
    return this.changePassForm.controls;
  } 

  passwordsMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const newPass = group.get('newPassword');
      const confirmPass = group.get('confirmPassword');

      if (!newPass || !confirmPass) return null;

      // clear mismatch when matching
      if (confirmPass.errors && confirmPass.errors['mismatchPassword']) {
        confirmPass.setErrors(null);
      }

      // only apply mismatch when both are valid in length and not empty
      if (
        newPass.valid &&
        confirmPass.valid &&
        newPass.value &&
        confirmPass.value &&
        newPass.value !== confirmPass.value
      ) {
        confirmPass.setErrors({ mismatchPassword: true });
      }

      return null;
    };
  }
}
