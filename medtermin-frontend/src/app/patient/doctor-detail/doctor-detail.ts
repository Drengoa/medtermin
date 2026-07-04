import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorService } from '../../core/services/doctor.service';
import { AppointmentService } from '../../core/services/appointment.service';
import { Doctor } from '../../core/models/doctor.model';

@Component({
  selector: 'app-doctor-detail',
  standalone: false,
  templateUrl: './doctor-detail.html',
  styleUrl: './doctor-detail.css'
})
export class DoctorDetail implements OnInit {
  doctor: Doctor | null = null;
  doctorId!: number;

  availableSlots: string[] = [];
  isLoadingSlots: boolean = false;
  slotsErrorMessage: string = '';

  bookingForm: FormGroup;
  isSubmitting: boolean = false;
  submitError: string = '';
  submitSuccess: string = '';

  minDate: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService
  ) {
    this.bookingForm = this.fb.group({
      appointment_date: ['', Validators.required],
      appointment_time: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(5)]]
    });

    // Minimalni datum koji korisnik sme da izabere je danas
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.doctorId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadDoctor();

    // Kad god se datum promeni, ponovo učitavamo dostupne termine
    this.bookingForm.get('appointment_date')?.valueChanges.subscribe(date => {
      if (date) {
        this.loadAvailability(date);
      }
    });
  }

  loadDoctor(): void {
    console.log('loadDoctor pozvan, doctorId =', this.doctorId);
    this.doctorService.getDoctorById(this.doctorId).subscribe({
      next: (data) => {
        console.log('Podaci stigli:', data);
        this.doctor = data;
      },
      error: (err) => {
        console.log('Greška:', err);
      }
    });
  }

  loadAvailability(date: string): void {
    this.isLoadingSlots = true;
    this.slotsErrorMessage = '';
    this.availableSlots = [];
    this.bookingForm.get('appointment_time')?.setValue('');

    this.doctorService.getDoctorAvailability(this.doctorId, date).subscribe({
      next: (slots) => {
        this.availableSlots = slots;
        this.isLoadingSlots = false;
        if (slots.length === 0) {
          this.slotsErrorMessage = 'Lekar nema slobodnih termina za izabrani datum.';
        }
      },
      error: (err) => {
        this.isLoadingSlots = false;
        this.slotsErrorMessage = 'Greška pri učitavanju termina.';
      }
    });
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';
    this.submitSuccess = '';

    const formValue = this.bookingForm.value;

    this.appointmentService.createAppointment({
      doctor_id: this.doctorId,
      appointment_date: formValue.appointment_date,
      appointment_time: formValue.appointment_time,
      reason: formValue.reason
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitSuccess = 'Termin uspešno zakazan!';
        setTimeout(() => {
          this.router.navigate(['/patient/appointments']);
        }, 1500);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitError = err.error?.error || 'Greška prilikom zakazivanja termina';
      }
    });
  }

  get f() {
    return this.bookingForm.controls;
  }
}