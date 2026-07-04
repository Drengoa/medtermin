import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Preusmeravanje na osnovu uloge korisnika
        if (response.user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (response.user.role === 'doctor') {
          this.router.navigate(['/doctor']);
        } else {
          this.router.navigate(['/patient']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Greška prilikom prijavljivanja';
      }
    });
  }
}