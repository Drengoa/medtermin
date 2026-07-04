import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { DoctorService } from '../../core/services/doctor.service';
import { Specialization } from '../../core/models/specialization.model';
import { Office } from '../../core/models/office.model';

@Component({
  selector: 'app-add-doctor',
  standalone: false,
  templateUrl: './add-doctor.html',
  styleUrl: './add-doctor.css'
})
export class AddDoctor implements OnInit {
  doctorForm: FormGroup;
  specializations: Specialization[] = [];
  offices: Office[] = [];

  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  isEditMode: boolean = false;
  doctorId: number | null = null;

  daysOfWeek = [
    { value: 1, label: 'Ponedeljak' },
    { value: 2, label: 'Utorak' },
    { value: 3, label: 'Sreda' },
    { value: 4, label: 'Četvrtak' },
    { value: 5, label: 'Petak' },
    { value: 6, label: 'Subota' },
    { value: 0, label: 'Nedelja' }
  ];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private doctorService: DoctorService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.doctorForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: [''],
      specialization_id: ['', Validators.required],
      office_id: [''],
      bio: [''],
      availability: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.doctorService.getAllSpecializations().subscribe({
      next: (data) => this.specializations = data
    });

    this.doctorService.getAllOffices().subscribe({
      next: (data) => this.offices = data
    });

    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      // EDIT REŽIM
      this.isEditMode = true;
      this.doctorId = Number(idParam);

      // U edit režimu, email i lozinka se ne menjaju ovde - uklanjamo validaciju
      this.doctorForm.get('email')?.clearValidators();
      this.doctorForm.get('password')?.clearValidators();
      this.doctorForm.get('email')?.updateValueAndValidity();
      this.doctorForm.get('password')?.updateValueAndValidity();

      this.loadDoctorData();
    } else {
      // ADD REŽIM - dodajemo jedan prazan red rasporeda na startu
      this.addAvailabilitySlot();
    }
  }

  loadDoctorData(): void {
    if (!this.doctorId) return;

    this.doctorService.getDoctorById(this.doctorId).subscribe({
      next: (doctor) => {
        this.doctorForm.patchValue({
          first_name: doctor.first_name,
          last_name: doctor.last_name,
          email: doctor.email || '',
          phone: doctor.phone || '',
          specialization_id: doctor.specialization_id,
          office_id: doctor.office_id || '',
          bio: doctor.bio || ''
        });
      },
      error: () => {
        this.errorMessage = 'Greška pri učitavanju podataka o lekaru';
      }
    });

    // Učitavamo postojeći raspored dostupnosti lekara
    this.adminService.getDoctorAvailability(this.doctorId).subscribe({
      next: (slots) => {
        if (slots.length > 0) {
          slots.forEach(slot => {
            const slotGroup = this.fb.group({
              day_of_week: [slot.day_of_week, Validators.required],
              start_time: [slot.start_time.slice(0, 5), Validators.required],
              end_time: [slot.end_time.slice(0, 5), Validators.required],
              slot_duration: [slot.slot_duration, Validators.required]
            });
            this.availability.push(slotGroup);
          });
        } else {
          // Ako lekar nema još raspored, dodajemo jedan prazan red
          this.addAvailabilitySlot();
        }
      },
      error: () => {
        this.addAvailabilitySlot();
      }
    });
  }

  get availability(): FormArray {
    return this.doctorForm.get('availability') as FormArray;
  }

  addAvailabilitySlot(): void {
    const slotGroup = this.fb.group({
      day_of_week: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      slot_duration: [30, Validators.required]
    });
    this.availability.push(slotGroup);
  }

  removeAvailabilitySlot(index: number): void {
    this.availability.removeAt(index);
  }

  onSubmit(): void {
    if (this.doctorForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.doctorForm.value;

    if (this.isEditMode && this.doctorId) {
      // IZMENA postojećeg lekara
      const updateData = {
        specialization_id: formValue.specialization_id,
        office_id: formValue.office_id || null,
        bio: formValue.bio,
        phone: formValue.phone
      };

      this.adminService.updateDoctor(this.doctorId, updateData).subscribe({
        next: () => {
          this.adminService.setDoctorAvailability(this.doctorId!, formValue.availability).subscribe({
            next: () => {
              this.isSubmitting = false;
              this.successMessage = 'Lekar uspešno izmenjen!';
              setTimeout(() => {
                this.router.navigate(['/admin/doctors']);
              }, 1500);
            },
            error: () => {
              this.isSubmitting = false;
              this.errorMessage = 'Lekar je izmenjen, ali došlo je do greške pri ažuriranju rasporeda';
            }
          });
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.error || 'Greška prilikom izmene lekara';
        }
      });

    } else {
      // DODAVANJE novog lekara
      const doctorData = {
        first_name: formValue.first_name,
        last_name: formValue.last_name,
        email: formValue.email,
        password: formValue.password,
        phone: formValue.phone,
        specialization_id: formValue.specialization_id,
        office_id: formValue.office_id || null,
        bio: formValue.bio
      };

      this.adminService.createDoctor(doctorData).subscribe({
        next: (response) => {
          this.adminService.setDoctorAvailability(response.doctorId, formValue.availability).subscribe({
            next: () => {
              this.isSubmitting = false;
              this.successMessage = 'Lekar uspešno dodat!';
              setTimeout(() => {
                this.router.navigate(['/admin/doctors']);
              }, 1500);
            },
            error: () => {
              this.isSubmitting = false;
              this.errorMessage = 'Lekar je dodat, ali došlo je do greške pri podešavanju rasporeda';
            }
          });
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.error || 'Greška prilikom dodavanja lekara';
        }
      });
    }
  }
}