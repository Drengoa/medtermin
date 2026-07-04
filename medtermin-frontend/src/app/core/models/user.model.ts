export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}