import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Doctor } from '../../core/models/doctor.model';

@Component({
  selector: 'app-doctor-card',
  standalone: false,
  templateUrl: './doctor-card.html',
  styleUrl: './doctor-card.css'
})
export class DoctorCard {
  @Input() doctor!: Doctor;
  @Output() viewDetails = new EventEmitter<number>();

  onViewDetails(): void {
    this.viewDetails.emit(this.doctor.id);
  }
}