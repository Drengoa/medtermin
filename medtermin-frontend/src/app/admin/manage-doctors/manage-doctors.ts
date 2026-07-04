import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../core/services/admin.service';
import { Doctor } from '../../core/models/doctor.model';

@Component({
  selector: 'app-manage-doctors',
  standalone: false,
  templateUrl: './manage-doctors.html',
  styleUrl: './manage-doctors.css'
})
export class ManageDoctors implements OnInit {
  doctors: Doctor[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  deletingId: number | null = null;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.isLoading = true;
    this.adminService.getAllDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Greška pri učitavanju lekara';
        this.isLoading = false;
      }
    });
  }

  deleteDoctor(id: number): void {
    if (!confirm('Da li ste sigurni da želite da obrišete ovog lekara?')) {
      return;
    }

    this.deletingId = id;
    this.adminService.deleteDoctor(id).subscribe({
      next: () => {
        this.deletingId = null;
        this.loadDoctors();
      },
      error: () => {
        this.deletingId = null;
        this.errorMessage = 'Greška pri brisanju lekara';
      }
    });
  }
}