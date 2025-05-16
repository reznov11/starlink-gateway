import { Component } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // this.authService.logout().subscribe({
    //   next: (response: HttpResponse<any>) => {
    //     if (response.status === 205) {
    //       this.handleSuccessfulLogout();
    //     } else {
    //       this.handleFailedLogout(`Unexpected status code: ${response.status}`);
    //     }
    //   },
    //   error: (err) => {
    //     if (err.status === 205) {
    //       this.handleSuccessfulLogout();
    //     } else {
    //       this.handleFailedLogout(err.message || 'Logout failed');
    //     }
    //   }
    // });
  }

  // private handleSuccessfulLogout(): void {
  //   this.authService.cleanToken();
  //   this.snackBar.open('Вы вышли из системы', 'Close', {
  //     duration: 3000,
  //     verticalPosition: 'top',
  //   });
  //   this.router.navigate(['/login']);
  // }
  //
  // private handleFailedLogout(errorMessage: string): void {
  //   console.error('Logout error:', errorMessage);
  //   this.snackBar.open('Не удалось выйти из системы', 'Close', {
  //     duration: 3000,
  //     verticalPosition: 'top',
  //     panelClass: ['error-snackbar']
  //   });
  //   this.router.navigate(['/']);
  // }
}
