import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorList } from './doctor-list/doctor-list';
import { DoctorDetail } from './doctor-detail/doctor-detail';
import { MyAppointments } from './my-appointments/my-appointments';

const routes: Routes = [
  { path: '', redirectTo: 'doctors', pathMatch: 'full' },
  { path: 'doctors', component: DoctorList },
  { path: 'doctors/:id', component: DoctorDetail },
  { path: 'appointments', component: MyAppointments }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientRoutingModule {}