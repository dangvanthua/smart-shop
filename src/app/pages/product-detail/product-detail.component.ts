import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapCartPlus } from '@ng-icons/bootstrap-icons';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ApiResponse } from '../../dto/response/api-response.model';
import { ProductDetailResponse } from '../../dto/response/product-detail.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    NgIconComponent,
    CommonModule
  ],
  viewProviders: [provideIcons({ bootstrapCartPlus })],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {

  productId?: number;
  productDetail?: ProductDetailResponse;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productId = +params.get('id')!;
      this.fetchProductDetail(this.productId);
    })
  }

  fetchProductDetail(productId: number) {
    this.productService.getDetailProduct(productId).subscribe({
      next: (response: ApiResponse<ProductDetailResponse>) => {
        if(response.code === 1000 && response.result) {
          console.log(response.result);
          this.productDetail = response.result;
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
