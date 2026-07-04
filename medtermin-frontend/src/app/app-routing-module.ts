import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';
import { RoleGuard } from './core/guards/role-guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'patient',
    loadChildren: () => import('./patient/patient-module').then(m => m.PatientModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'patient' }
  },
  {
    path: 'doctor',
    loadChildren: () => import('./doctor/doctor-module').then(m => m.DoctorModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'doctor' }
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin-module').then(m => m.AdminModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'admin' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }