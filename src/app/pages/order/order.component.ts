import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {
  form: FormGroup;
  cities: any[] = [];
  districts: any[] = [];
  wards: any[] = [];

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService) {
    this.form = this.fb.group({
      city: ['', Validators.required],
      district: ['', Validators.required],
      ward: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadCities();
    this.form.get('city')?.valueChanges.subscribe((cityId) => {
      this.loadDistricts(cityId);
    });

    this.form.get('district')?.valueChanges.subscribe((districtId) => {
      this.loadWards(districtId);
    });
  }

  loadCities() {
    this.locationService.getCities().subscribe((response) => {
      if (response.error === 0) {
        this.cities = response.data;
      }
    });
  }

  loadDistricts(cityId: string) {
    this.locationService.getDistricts(cityId).subscribe((response) => {
      if (response.error === 0) {
        console.log(response.data);
        this.districts = response.data;
        this.wards = [];
      }
    });
  }

  loadWards(districtId: string) {
    this.locationService.getWards(districtId).subscribe((response) => {
      if (response.error === 0) {
        this.wards = response.data;
      }
    });
  }
}
