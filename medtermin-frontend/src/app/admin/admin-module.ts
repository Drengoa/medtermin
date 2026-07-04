import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AdminRoutingModule } from './admin-routing-module';
import { ManageDoctors } from './manage-doctors/manage-doctors';
import { AddDoctor } from './add-doctor/add-doctor';
import { ManageSpecializations } from './manage-specializations/manage-specializations';

@NgModule({
  declarations: [ManageDoctors, AddDoctor, ManageSpecializations],
  imports: [CommonModule, AdminRoutingModule, FormsModule, ReactiveFormsModule, RouterModule],
})
export class AdminModule {}