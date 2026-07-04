import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  currentUrl: string = '';

  constructor(private authService: AuthService, private router: Router) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    // Pratimo promenu rute da znamo da li smo na login/register stranici
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.currentUrl = (event as NavigationEnd).urlAfterRedirects;
    });
  }

  get shouldShowNavbar(): boolean {
    const isAuthPage = this.currentUrl.includes('/login') || this.currentUrl.includes('/register');
    return this.isLoggedIn && !!this.currentUser && !isAuthPage;
  }

  get currentUser(): User | null {
    return this.authService.getCurrentUser();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  goHome(): void {
    const user = this.currentUser;
    if (!user) return;

    if (user.role === 'admin') {
      this.router.navigate(['/admin/doctors']);
    } else if (user.role === 'doctor') {
      this.router.navigate(['/doctor/appointments']);
    } else {
      this.router.navigate(['/patient/doctors']);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}