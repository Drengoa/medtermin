import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageDoctors } from './manage-doctors/manage-doctors';
import { AddDoctor } from './add-doctor/add-doctor';
import { ManageSpecializations } from './manage-specializations/manage-specializations';

const routes: Routes = [
  { path: '', redirectTo: 'doctors', pathMatch: 'full' },
  { path: 'doctors', component: ManageDoctors },
  { path: 'doctors/add', component: AddDoctor },
  { path: 'doctors/edit/:id', component: AddDoctor },
  { path: 'specializations', component: ManageSpecializations }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}