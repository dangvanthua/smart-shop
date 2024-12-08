import { Component, NgModule } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapCartPlus } from '@ng-icons/bootstrap-icons';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ApiResponse } from '../../dto/response/api-response.model';
import { ProductDetailResponse } from '../../dto/response/product-detail.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductResponse } from '../../dto/response/product-response.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    NgIconComponent,
    CommonModule,
    FormsModule
  ],
  providers: [CurrencyPipe],
  viewProviders: [provideIcons({ bootstrapCartPlus })],
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
    private currencyPipe: CurrencyPipe
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productId = +params.get('id')!;
      this.fetchProductDetail(this.productId);
      this.fetchProductRecommend(this.productId);
    })
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
  }

  formatCurrency(price: number): string {
    return this.currencyPipe.transform(price ?? 0, 'VND', 'symbol', '1.0-0')!;
  }


  fetchProductRecommend(productId: number) {
    this.productService.getProductRecommend(productId).subscribe({
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
}
