import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PatientRoutingModule } from './patient-routing-module';
import { DoctorList } from './doctor-list/doctor-list';
import { DoctorDetail } from './doctor-detail/doctor-detail';
import { MyAppointments } from './my-appointments/my-appointments';
import { DoctorCard } from './doctor-card/doctor-card';
import { StatusTranslate } from '../shared/pipes/status-translate-pipe';

@NgModule({
  declarations: [DoctorList, DoctorDetail, MyAppointments, DoctorCard, StatusTranslate],
  imports: [CommonModule, PatientRoutingModule, FormsModule, ReactiveFormsModule, RouterModule],
})
export class PatientModule {}