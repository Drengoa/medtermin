import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../core/services/appointment.service';
import { Appointment } from '../../core/models/appointment.model';

@Component({
  selector: 'app-doctor-appointments',
  standalone: false,
  templateUrl: './doctor-appointments.html',
  styleUrl: './doctor-appointments.css'
})
export class DoctorAppointments implements OnInit {
  appointments: Appointment[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  processingId: number | null = null;

  notesInput: { [key: number]: string } = {};

  constructor(private appointmentService: AppointmentService) { }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.isLoading = true;
    this.appointmentService.getDoctorAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Greška pri učitavanju termina';
        this.isLoading = false;
      }
    });
  }

  confirmAppointment(id: number): void {
    this.processingId = id;
    this.appointmentService.confirmAppointment(id).subscribe({
      next: () => {
        this.processingId = null;
        this.loadAppointments();
      },
      error: () => {
        this.processingId = null;
        this.errorMessage = 'Greška pri potvrđivanju termina';
      }
    });
  }

  completeAppointment(id: number): void {
    const notes = this.notesInput[id] || '';
    this.processingId = id;
    this.appointmentService.completeAppointment(id, notes).subscribe({
      next: () => {
        this.processingId = null;
        this.loadAppointments();
      },
      error: () => {
        this.processingId = null;
        this.errorMessage = 'Greška pri završavanju pregleda';
      }
    });
  }
}