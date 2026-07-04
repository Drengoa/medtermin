import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../models/doctor.model';
import { Specialization } from '../models/specialization.model';

export interface AvailabilitySlot {
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration: number;
}

export interface NewDoctorData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  specialization_id: number;
  office_id?: number;
  bio?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:3000/api/admin';

  constructor(private http: HttpClient) { }

  getAllDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/doctors`);
  }

  createDoctor(data: NewDoctorData): Observable<any> {
    return this.http.post(`${this.apiUrl}/doctors`, data);
  }

  updateDoctor(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/doctors/${id}`, data);
  }

  deleteDoctor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/doctors/${id}`);
  }

  createSpecialization(name: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/specializations`, { name });
  }

  setDoctorAvailability(doctorId: number, availability: AvailabilitySlot[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/doctors/${doctorId}/availability`, { availability });
  }

  getDoctorAvailability(doctorId: number): Observable<AvailabilitySlot[]> {
    return this.http.get<AvailabilitySlot[]>(`${this.apiUrl}/doctors/${doctorId}/availability`);
  }
}