export interface Appointment {
  id: number;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  reason?: string;
  doctor_notes?: string;
  doctor_first_name?: string;
  doctor_last_name?: string;
  specialization_name?: string;
  patient_first_name?: string;
  patient_last_name?: string;
  patient_phone?: string;
}