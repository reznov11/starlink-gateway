import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import {AuthService, UserProfile} from '@app/services/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateUserComponent } from '../modals/create-user/create-user.component';
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  public user: UserProfile = {} as UserProfile;
  private dialogSettings: MatDialogConfig = {
    height: 'auto',
    width: '700px',
    disableClose: true
  }

  constructor(
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.user = this.authService.currentUserProfile!;
  }

  public openEditProfileDialog() {
    const dialogRef = this.dialog.open(
      CreateUserComponent,
      {
        ...this.dialogSettings,
        data: {
          user: this.user
        }
      }
    );

    dialogRef.afterClosed().subscribe(async (result: UserProfile) => {
      if (result) {
        this.user = result;
        // TODO: update user in backend
        this.authService.fetchUserProfile().subscribe({
          next: (user: UserProfile) => {
            this.user = user;
            this.authService.userProfileSubject.next(user);
          },
          error: (err: any) => {
            console.log('Error', err)
          }
        });
      }
    });
  }
}
