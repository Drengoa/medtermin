import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorService } from '../../core/services/doctor.service';
import { Doctor } from '../../core/models/doctor.model';
import { Specialization } from '../../core/models/specialization.model';

@Component({
  selector: 'app-doctor-list',
  standalone: false,
  templateUrl: './doctor-list.html',
  styleUrl: './doctor-list.css'
})
export class DoctorList implements OnInit {
  doctors: Doctor[] = [];
  specializations: Specialization[] = [];
  selectedSpecializationId: number | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private doctorService: DoctorService, private router: Router) { }

  ngOnInit(): void {
    this.loadSpecializations();
    this.loadDoctors();
  }

  loadSpecializations(): void {
    this.doctorService.getAllSpecializations().subscribe({
      next: (data) => {
        this.specializations = data;
      },
      error: (err) => {
        console.error('Greška pri učitavanju specijalizacija', err);
      }
    });
  }

  loadDoctors(): void {
    this.isLoading = true;
    const specId = this.selectedSpecializationId ?? undefined;

    this.doctorService.getAllDoctors(specId).subscribe({
      next: (data) => {
        this.doctors = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Greška pri učitavanju lekara';
        this.isLoading = false;
      }
    });
  }

  onSpecializationChange(): void {
    this.loadDoctors();
  }

  viewDoctor(doctorId: number): void {
    this.router.navigate(['/patient/doctors', doctorId]);
  }
}