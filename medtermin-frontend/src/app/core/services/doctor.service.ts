import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../models/doctor.model';
import { Specialization } from '../models/specialization.model';
import { Office } from '../models/office.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://localhost:3000/api/doctors';

  constructor(private http: HttpClient) { }

  getAllDoctors(specializationId?: number): Observable<Doctor[]> {
    let url = this.apiUrl;
    if (specializationId) {
      url += `?specialization_id=${specializationId}`;
    }
    return this.http.get<Doctor[]>(url);
  }

  getDoctorById(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/${id}`);
  }

  getDoctorAvailability(id: number, date: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${id}/availability?date=${date}`);
  }

  getAllSpecializations(): Observable<Specialization[]> {
    return this.http.get<Specialization[]>(`${this.apiUrl}/specializations`);
  }

  getAllOffices(): Observable<Office[]> {
    return this.http.get<Office[]>(`${this.apiUrl}/offices`);
  }
}