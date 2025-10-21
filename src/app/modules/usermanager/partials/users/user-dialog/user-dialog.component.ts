import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'app/shared/material.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserRequestDTO } from '@interfaces/usermanager/users-dto/user-request-dto';
import { UsermanagerService } from '@services/usermanager/usermanager.service';
import { SnackbarService } from '@services/snackbar.service';
import { UserResponseDTO } from '@interfaces/usermanager/users-dto/user-response-dto';
import { UserModifyDTO } from '@interfaces/usermanager/users-dto/user-modify-dto';
import { error } from 'console';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent {
  // user: UserRequestDTO = {} as UserRequestDTO;
  userForm!: FormGroup;
  hidePassword = true;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private usermanagerService: UsermanagerService,
    private snackbar: SnackbarService,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user?: UserModifyDTO }
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

  addUser(userRequest: UserRequestDTO): void{
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

  modifyUser(userRequest: UserModifyDTO): void {
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
      const newUser: UserRequestDTO = { firstname, lastname, gender, username, password, isActive };

      this.addUser(newUser);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  get f() {
    return this.userForm.controls;
  }
}
