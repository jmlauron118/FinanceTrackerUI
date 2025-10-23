import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'app/shared/material.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserRequestDto } from '@interfaces/usermanager/users-dto/user-request-dto';
import { UsermanagerService } from '@services/usermanager/usermanager.service';
import { SnackbarService } from '@services/snackbar.service';
import { UserResponseDto } from '@interfaces/usermanager/users-dto/user-response-dto';
import { UserModifyDto } from '@interfaces/usermanager/users-dto/user-modify-dto';
import { TitleCaseDirective } from 'app/directive/title-case.directive';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, ReactiveFormsModule, TitleCaseDirective],
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent {
  userForm!: FormGroup;
  hidePassword = true;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private usermanagerService: UsermanagerService,
    private snackbar: SnackbarService,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user?: UserResponseDto }
  ) {
    this.isEditMode = !!data;

    this.userForm = this.fb.group({
      userId: [data?.user?.userId || null],
      firstname: [data?.user?.firstname || '', Validators.required],
      lastname: [data?.user?.lastname || '', Validators.required],
      gender: [data?.user?.gender || '', Validators.required],
      username: [data?.user?.username || '', Validators.required],
      password: [
        { value: '', disabled: this.isEditMode },
        this.isEditMode ? [] : [Validators.required, Validators.minLength(8), Validators.maxLength(20)]
      ],
      isActive: [data?.user?.isActive ?? 1]
    });
  }

  addUser(userRequest: UserRequestDto): void{
    this.usermanagerService.addUser(userRequest).subscribe({
      next: data => {
        this.snackbar.success('User added successfully!');
        this.dialogRef.close(data);
      },
      error: error => {
        this.snackbar.danger(error, 4000);
      }
    });
  }

  modifyUser(userRequest: UserModifyDto): void {
    this.usermanagerService.modifyUser(userRequest).subscribe({
      next: data => {
        this.snackbar.success('User modified successfully!');
        this.dialogRef.close(data);
      },
      error: error => {
        this.snackbar.danger(error, 4000);
      }
    });
  }

  onSubmit() {
    if(this.userForm.invalid){
      this.userForm.markAllAsTouched();
      return;
    }

    if(this.isEditMode){
      this.modifyUser(this.userForm.value);
    }
    else {
      const { firstname, lastname, gender, username, password, isActive } = this.userForm.value;
      const newUser: UserRequestDto = { firstname, lastname, gender, username, password, isActive };

      this.addUser(newUser);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  get userControl() {
    return this.userForm.controls;
  }
}
