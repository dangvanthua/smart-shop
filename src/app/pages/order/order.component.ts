import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocationService } from '../../services/location.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapPlus, bootstrapXCircleFill } from '@ng-icons/bootstrap-icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIconComponent,
    CommonModule,
    FormsModule
  ],
  viewProviders: [provideIcons({bootstrapPlus, bootstrapXCircleFill})],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {
  form: FormGroup;
  cities: any[] = [];
  districts: any[] = [];
  wards: any[] = [];
  availableVouchers = [
    { id: 1, name: 'Giảm 10%', value: 18000 },
    { id: 2, name: 'Giảm 20%', value: 36000 },
    { id: 3, name: 'Giảm 30%', value: 54000 },
  ];
  
  selectedVouchers: any[] = [];
  totalDiscount = 0;
  totalPrice = 195000; 

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService) {
    this.form = this.fb.group({
      city: ['', Validators.required],
      district: ['', Validators.required],
      ward: ['', Validators.required],
      addressDetail: ['', Validators.required]
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

  updateVouchers() {
    this.calculateTotal();
  }

  // Xóa voucher
  removeVoucher(voucher: any) {
    this.selectedVouchers = this.selectedVouchers.filter(v => v.id !== voucher.id);
    this.calculateTotal();
  }

  // Tính tổng giảm giá và tổng cộng
  calculateTotal() {
    this.totalDiscount = this.selectedVouchers.reduce((sum, voucher) => sum + voucher.value, 0);
    const orderPrice = 180000; // Giá sản phẩm cố định
    const shippingFee = 15000; // Phí giao hàng cố định
    this.totalPrice = orderPrice + shippingFee - this.totalDiscount;
  }
}
