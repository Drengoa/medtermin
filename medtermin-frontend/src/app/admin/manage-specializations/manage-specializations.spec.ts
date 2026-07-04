import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSpecializations } from './manage-specializations';

describe('ManageSpecializations', () => {
  let component: ManageSpecializations;
  let fixture: ComponentFixture<ManageSpecializations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageSpecializations],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageSpecializations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
