import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'app/shared/material.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserRequestDTO } from '@interfaces/usermanager/users-dto/user-request-dto';
import { UsermanagerService } from '@services/usermanager/usermanager.service';

@Component({
  selector: 'app-user-dialog',
  imports: [CommonModule, FormsModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent {
  user: UserRequestDTO = {} as UserRequestDTO;
  userForm!: FormGroup;
  hidePassword = true;
  action: string = 'add';

  constructor(
    private fb: FormBuilder,
    private usermanagerService: UsermanagerService,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserRequestDTO | null
  ) {
    this.userForm = this.fb.group({
      firstname: [data?.firstname || '', Validators.required],
      lastname: [data?.lastname || '', Validators.required],
      gender: [data?.gender || '', Validators.required],
      username: [data?.username || '', Validators.required],
      password: [data?.password || '', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      isActive: [data?.isActive ?? 1, Validators.required]
    });
  }

  addUser(userRequest: UserRequestDTO): void{
    this.usermanagerService.addUser(userRequest).subscribe({
      next: data => (this.dialogRef.close(data)),
      error: error => (console.error('Error adding user:', error))
    });
  }

  onSave() {
    if(this.userForm.invalid){
      this.userForm.markAllAsTouched();
      return;
    }

    this.user = this.userForm.value;
    this.addUser(this.user);
  }

  onCancel() {
    this.dialogRef.close();
  }

  get f() {
    return this.userForm.controls;
  }
}
