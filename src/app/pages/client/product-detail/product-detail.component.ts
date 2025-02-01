import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapCartPlus, bootstrapTruck } from '@ng-icons/bootstrap-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { ApiResponse } from '../../../dto/response/api-response.model';
import { ProductDetailResponse } from '../../../dto/response/product-detail.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductResponse } from '../../../dto/response/product-response.model';
import { CartService } from '../../../services/cart.service';
import { CartRequest } from '../../../dto/request/cart-request.model';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { EncoderService } from '../../../services/encoder.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    NgIconComponent,
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
],
  providers: [CurrencyPipe],
  viewProviders: [provideIcons({ bootstrapCartPlus, bootstrapTruck })],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {

  productId?: number;
  productDetail?: ProductDetailResponse;
  productRecommend?: ProductResponse[]; 
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private currencyPipe: CurrencyPipe,
    private encoderService: EncoderService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const encodedId = params.get('id');
      if (encodedId) {
        this.productId = this.encoderService.decode(encodedId);
        
        if (isNaN(this.productId)) {
          this.router.navigate(['/404']);
          return;
        }
        
        this.fetchProductDetail(this.productId);
      }
    });
  }

  fetchProductDetail(productId: number) {
    this.productService.getDetailProduct(productId).subscribe({
      next: (response: ApiResponse<ProductDetailResponse>) => {
        if(response.code === 1000 && response.result) {
          this.productDetail = response.result;
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

 
  changeQuantity(delta: number): void {
    this.quantity += delta;
  }

  formatCurrency(price: number): string {
    return this.currencyPipe.transform(price ?? 0, 'VND', 'symbol', '1.0-0')!;
  }

  formatDiscount(discountValue: number, discountType: string): string {
    let typeDiscount: string = '';

    if(discountType === "percentage") {
      typeDiscount = `%${discountValue}`;
    }else if(discountType === "fixed_amount") {
      typeDiscount = this.formatCurrency(discountValue);
    }

    return typeDiscount;
  }

  getProductRecommend(): void {
    this.productService.getProductRecommend(this.productId!).subscribe({
      next: (response: ApiResponse<ProductResponse[]>) => {
        if(response.code === 1000 && response.result) {
          this.productRecommend = response.result;
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  addCart(productId: number) {
      const cartRequest: CartRequest = {
        product_id: productId,
        quantity: this.quantity,
      }
      this.cartService.addProductToCart(cartRequest).subscribe({
        next: (response: ApiResponse<void>) => {
          console.log('Add to cart success');
        },
        error: (err) => {
          console.log(err);
        }
      })
    }

    buyNow(productId: number): void {
      const cartRequest: CartRequest = {
        product_id: productId,
        quantity: this.quantity,
      };

      this.cartService.addProductToCart(cartRequest).subscribe({
        next: (response: ApiResponse<void>) => {
          if(response.code === 1000) {
            this.router.navigate(['/account/cart'], {
              queryParams: {selectedProductId: productId},
            });
          }
        },
        error: (err) => {
          console.error(err);
        },
      })
    }
}
