import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:3000/api/appointments';

  constructor(private http: HttpClient) { }

  createAppointment(data: { doctor_id: number, appointment_date: string, appointment_time: string, reason?: string }): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getMyAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/my`);
  }

  cancelAppointment(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/cancel`, {});
  }

  getDoctorAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/doctor`);
  }

  confirmAppointment(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/confirm`, {});
  }

  completeAppointment(id: number, doctorNotes: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/complete`, { doctor_notes: doctorNotes });
  }
}