import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DoctorRoutingModule } from './doctor-routing-module';
import { DoctorAppointments } from './doctor-appointments/doctor-appointments';
import { StatusTranslate } from './pipes/status-translate-pipe';

@NgModule({
  declarations: [DoctorAppointments, StatusTranslate],
  imports: [CommonModule, DoctorRoutingModule, FormsModule],
})
export class DoctorModule {}