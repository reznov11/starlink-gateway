import {Component, Inject, OnInit, signal} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FlexModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { UserProfile } from '@app/services/auth.service';
import {UserService} from '@services/api/user';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-user',
  imports: [
    MatDialogModule,
    MatButtonModule,
    FlexModule,
    MatFormFieldModule,
    MatOptionModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent implements OnInit {
  public form: FormGroup;
  public isEditMode = false;
  public togglePassword = signal(true);
  public avatarImagePreview: string | ArrayBuffer | null = null;
  public user: UserProfile = {} as UserProfile;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { user: UserProfile } | null,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateUserComponent>,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    const phoneRegex = /^\+996(?:\s?\d{3}){3}$/;
    const user: UserProfile = this.data?.user || {} as UserProfile;

    this.form = this.fb.group({
      avatar: [null],
      first_name: [
        user.first_name,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30)
        ]
      ],
      last_name: [
        user.last_name,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30)
        ]
      ],
      job_title: [
        user.job_title,
        [
          Validators.minLength(3),
          Validators.maxLength(30)
        ]
      ],
      location: [user.location],
      birth_date: [user.birth_date],
      email: [
        user.email,
        [
          Validators.email
        ]
      ],
      password: [''],
      phone_number: [
        user.phone_number,
        [
          Validators.pattern(phoneRegex)
        ]
      ],
      role: [user.role || 'employee', Validators.required],
      is_active: [user.is_active || false],
      is_staff: [user.is_staff || false],
    });
  }

  ngOnInit() {
    if (this.data?.user) {
      this.isEditMode = true;
      this.user = this.data?.user!;

      if (this.user.avatar) {
        this.avatarImagePreview = this.data?.user.avatar!;
      }
    }
  }

  public async onSubmit() {

    if (this.form.invalid) return;

    const formData = new FormData();
    const formValue = this.form.value;

    Object.keys(formValue).forEach(key => {
      if (key === 'avatar') {
        if (this.isEditMode && !(formValue[key] instanceof File)) {
          return;
        }
        if (!this.isEditMode && !formValue[key]) {
          return;
        }
      }
      if (formValue[key] !== null && formValue[key] !== undefined) {
        formData.append(key, formValue[key]);
      }
    });

    if (this.isEditMode) {
      (await this.userService.updateUser(
        this.data!.user!.id, formData)
      ).subscribe({
        next: (user: UserProfile) => {
          this.data!.user = user;
          this.dialogRef.close(this.form.value);
        },
        error: (err: any) => {
          console.log('Error updating user profile', err);
          this.snackBar.open('Ошибка при обновлении профиля пользователя', 'Закрыть', {
            duration: 3000,
            verticalPosition: 'top',
          });
        }
      })
    } else {
      (
        await this.userService.createUser(this.form.value)
      ).subscribe({
        next: (user: UserProfile) => {
          this.dialogRef.close(user);
        },
        error: (err: any) => {
          console.log('Error while adding a new user', err);
          this.snackBar.open('Ошибка при добавлении нового пользователя', 'Закрыть', {
            duration: 3000,
            verticalPosition: 'top',
          });
        }
      })
    }
  }

  public clickEvent(event: MouseEvent) {
    this.togglePassword.set(!this.togglePassword());
    event.stopPropagation();
  }

  public resetActiveUser(): void {
    const getCheckValue: boolean = this.form.get('is_active')?.value;

    if (getCheckValue) {
      this.form.patchValue({
        is_staff: false
      })
    }
  }

  public onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.form.patchValue({ avatar: file });
      this.form.get('avatar')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.avatarImagePreview = reader.result;
      };
      reader.readAsDataURL(file);

      console.log(this.form.get('avatar'))
    }
  }
}
