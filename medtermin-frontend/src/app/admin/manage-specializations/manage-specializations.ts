import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../core/services/doctor.service';
import { AdminService } from '../../core/services/admin.service';
import { Specialization } from '../../core/models/specialization.model';

@Component({
  selector: 'app-manage-specializations',
  standalone: false,
  templateUrl: './manage-specializations.html',
  styleUrl: './manage-specializations.css'
})
export class ManageSpecializations implements OnInit {
  specializations: Specialization[] = [];
  isLoading: boolean = true;

  newSpecializationName: string = '';
  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private doctorService: DoctorService, private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadSpecializations();
  }

  loadSpecializations(): void {
    this.isLoading = true;
    this.doctorService.getAllSpecializations().subscribe({
      next: (data) => {
        this.specializations = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.newSpecializationName.trim()) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.adminService.createSpecialization(this.newSpecializationName).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Specijalizacija uspešno dodata';
        this.newSpecializationName = '';
        this.loadSpecializations();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.error || 'Greška prilikom dodavanja';
      }
    });
  }
}