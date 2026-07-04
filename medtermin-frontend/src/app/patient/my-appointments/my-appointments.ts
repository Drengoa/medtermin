import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../core/services/appointment.service';
import { Appointment } from '../../core/models/appointment.model';

@Component({
  selector: 'app-my-appointments',
  standalone: false,
  templateUrl: './my-appointments.html',
  styleUrl: './my-appointments.css'
})
export class MyAppointments implements OnInit {
  appointments: Appointment[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  cancellingId: number | null = null;

  constructor(private appointmentService: AppointmentService) { }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.isLoading = true;
    this.appointmentService.getMyAppointments().subscribe({
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

  cancelAppointment(id: number): void {
    this.cancellingId = id;
    this.appointmentService.cancelAppointment(id).subscribe({
      next: () => {
        this.cancellingId = null;
        this.loadAppointments(); // ponovo učitavamo listu da prikažemo novi status
      },
      error: (err) => {
        this.cancellingId = null;
        this.errorMessage = 'Greška pri otkazivanju termina';
      }
    });
  }

  canCancel(appointment: Appointment): boolean {
    return appointment.status === 'pending' || appointment.status === 'confirmed';
  }
}