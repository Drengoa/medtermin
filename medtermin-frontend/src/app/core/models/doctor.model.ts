export interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  bio?: string;
  specialization_id: number;
  specialization_name: string;
  office_id?: number;
  office_name?: string;
  office_address?: string;
  email?: string;
  phone?: string;
}