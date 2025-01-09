import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocationService } from '../../../services/location.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapPlus, bootstrapXCircleFill } from '@ng-icons/bootstrap-icons';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartResponse } from '../../../dto/response/cart-response.mode';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { ApiResponse } from '../../../dto/response/api-response.model';
import { AddressResponse } from '../../../dto/response/address-response.model';
import { AddressService } from '../../../services/address.service';
import { AddressRequest } from '../../../dto/request/address-request.model';
import { PromotionCodeResponse } from '../../../dto/response/promotion-response.mode';
import { PromotionService } from '../../../services/promotion.service';
import { CartItemRequest } from '../../../dto/request/cart-item-request.model';
import { OrderService } from '../../../services/order.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    NgIconComponent,
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
],
  providers: [CurrencyPipe],
  viewProviders: [provideIcons({bootstrapPlus, bootstrapXCircleFill})],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {
  form: FormGroup;
  noteForm: FormGroup;
  cities: any[] = [];
  districts: any[] = [];
  wards: any[] = [];
  productIds: number[] = [];
  cartItems: CartResponse[] = [];
  addressResponses: AddressResponse[] = [];
  availableVouchers: PromotionCodeResponse[] = [];
  selectedVouchers: PromotionCodeResponse[] = [];
  selectedPaymentMethod: string = '';
  selectedShippingMethod: string = '';
  shippingFee: number = 10000;
  totalDiscount = 0;
  totalPrice: number = 0; 
  totalPriceProduct: number = 0;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private currencyPipe: CurrencyPipe,
    private router: Router,
    private locationService: LocationService,
    private addressService: AddressService,
    private cartService: CartService,
    private promotionService: PromotionService,
    private orderService: OrderService) {

    this.noteForm = this.fb.group({
      note: ['', Validators.maxLength(100)],
    });

    this.form = this.fb.group({
      city: ['', Validators.required],
      district: [{value: '', disabled: true}, Validators.required],
      ward: [{value: '', disabled: true}, Validators.required],
      addressDetail: ['', Validators.required]
    });

    this.form.get('city')?.valueChanges.subscribe(city => {
      if (city) {
        this.form.get('district')?.enable();
      } else {
        this.form.get('district')?.disable();
        this.form.get('ward')?.disable(); 
      }
    });
    
    this.form.get('district')?.valueChanges.subscribe(district => {
      if (district) {
        this.form.get('ward')?.enable();
      } else {
        this.form.get('ward')?.disable();
      }
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const productIdsParam = params['productIds'];

      if(productIdsParam) {
        this.productIds = productIdsParam.split(',').map((id: string) => parseInt(id, 10));
        this.cartService.getCartItemsByProductIds(this.productIds).subscribe({
          next: (response: ApiResponse<CartResponse[]>) => {
            if(response.code === 1000 && response.result) {
              this.cartItems = response.result;
              // calculate total price of product in cart
              this.cartItems.forEach(item => {
                this.totalPriceProduct += item.product.price;
              })

              this.totalPrice = this.totalPriceProduct + this.shippingFee;
              // get promotion code by product ids
              this.getPromotionCodes(this.productIds);
            }
          },
          error: (err) => {
            console.log(err);
          }
        });
      }
    });
    this.selectedPaymentMethod = 'cod'; 
    this.selectedShippingMethod = 'standard'; 
    this.getUserAddress();
  }

  getPromotionCodes(productIds: number[]) {
    this.promotionService.getPromotionCodesByProductId(productIds).subscribe({
      next: (response: ApiResponse<PromotionCodeResponse[]>) => {
        if(response.code === 1000 && response.result) {
          this.availableVouchers = response.result;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  formatCurrency(price: number): string {
    return this.currencyPipe.transform(price, 'VND', 'symbol', '1.0-0')!;
  }

  getUserAddress() {
    this.addressService.getAllAddress().subscribe({
      next: (response: ApiResponse<AddressResponse[]>) => {
        if(response.code === 1000 && response.result) {
          this.addressResponses = response.result;
        }
      }
    })
  }

  openAddressModal() {
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

  saveAddress() {
    if (this.form.valid) {
      const selectedCity = this.cities.find(city => city.id === this.form.get('city')?.value)?.name || '';
      const selectedDistrict = this.districts.find(district => district.id === this.form.get('district')?.value)?.name || '';
      const selectedWard = this.wards.find(ward => ward.id === this.form.get('ward')?.value)?.name || '';
  
      const addressData: AddressRequest = {
        address_line: this.form.get('addressDetail')?.value,
        ward: selectedWard,
        district: selectedDistrict,
        city: selectedCity,
        country: "Việt Nam",
      };
  
      this.addressService.createAddress(addressData).subscribe({
        next: (response: ApiResponse<void>) => {
          if (response.code === 1000) {
            console.log('Create address success');
          }
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else {
      console.log('Form is not valid');
    }
  }  

  onPaymentMethodChange(method: string) {
    this.selectedPaymentMethod = method;
    this.updateShippingFee();
  }
  
  onShippingMethodChange(method: string) {
    this.selectedShippingMethod = method;
    this.updateShippingFee();
  }

  updateShippingFee() {
    if (this.selectedShippingMethod === 'standard') {
      this.shippingFee = 10000; 
    } else if (this.selectedShippingMethod === 'express') {
      this.shippingFee = 30000;
    }
  
    this.calculateTotal();
  }
  
  updateVouchers() {
    this.calculateTotal();
  }

  removeVoucher(voucher: PromotionCodeResponse) {
    this.selectedVouchers = this.selectedVouchers.filter(v => v.promotion_code !== voucher.promotion_code);
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalDiscount = 0; // Reset total discount
    
    this.selectedVouchers.forEach(voucher => {
      if (voucher.discount_type.toLowerCase() === "percentage") {
        const orderPrice = this.cartItems.reduce((sum, item) => sum + item.product.price, 0); // Dynamic order price
        this.totalDiscount += (orderPrice * voucher.promotion_discount_value) / 100;
      } else if (voucher.discount_type.toLowerCase() === "fixed_amount") {
        this.totalDiscount += voucher.promotion_discount_value;
      }
    });
  
    const orderPrice = this.cartItems.reduce((sum, item) => sum + item.product.price, 0);
    this.totalPrice = orderPrice - this.totalDiscount;
  }

  addVoucher(voucher: PromotionCodeResponse) {
    if (!this.selectedVouchers.find(v => v.promotion_code === voucher.promotion_code)) {
      this.selectedVouchers.push(voucher);
      this.calculateTotal();
    } else {
      console.log('Voucher already applied');
    }
  }

  createOrder() {
    if (!this.selectedPaymentMethod || !this.selectedShippingMethod) {
      console.log('Please select payment and shipping methods');
      return;
    }
  
    const cartItemRequest: CartItemRequest[] = this.cartItems.map(item => {
      // Lấy danh sách mã giảm giá áp dụng cho sản phẩm
      const appliedVouchers = this.selectedVouchers
        .filter(voucher => item.product.id === voucher.product_id) 
        .map(voucher => voucher.promotion_code.toString()); // Chuyển mã giảm giá thành chuỗi
  
      return {
        product_id: item.product.id,
        quantity: item.quantity,
        promotion_code: appliedVouchers, 
      };
    });
    
    const defaultAddress = this.addressResponses.find(address => address.is_default);
    const orderRequest = {
      note: this.noteForm.get('note')?.value,
      shipping_address: `${defaultAddress?.address_line}, ${defaultAddress?.ward}, ${defaultAddress?.district}, ${defaultAddress?.city}`,
      payment_method: this.selectedPaymentMethod,
      shipping_method: this.selectedShippingMethod,
      cart_items: cartItemRequest,
    };
  
    // Gửi order request đến server (thêm logic gọi API tại đây nếu cần)
    this.orderService.createOrder(orderRequest).subscribe({
      next: (response: ApiResponse<string>) => {
        if(response.code === 1000 && response.result != null) {
          const resultUrl = response.result.trim();
          window.location.href = resultUrl;
        }else if(response.result == null) {
          this.router.navigate(['/']);
        }
      }
    })
  }  
}
