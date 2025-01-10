import { Component, ViewChild, ElementRef } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapMenuButton } from '@ng-icons/bootstrap-icons';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { CategoryService } from '../../../services/category.service';
import { CategoryResponse } from '../../../dto/response/category-response.model';
import { ActivatedRoute } from '@angular/router';
import { ApiResponse } from '../../../dto/response/api-response.model';
import { ProductService } from '../../../services/product.service';
import { ProductListResponse } from '../../../dto/response/products-response.model';
import { ProductResponse } from '../../../dto/response/product-response.model';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    NgIconComponent,
    CommonModule,
    HeaderComponent,
    FooterComponent,
],
  viewProviders: [provideIcons({ bootstrapMenuButton })],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  @ViewChild('menuToggle') menuToggle!: ElementRef;
  @ViewChild('sidebar') sidebar!: ElementRef;

  isSidebarVisible = false;
  category?: CategoryResponse;
  page: number = 0;
  size: number = 12;
  productResponse?: ProductResponse[];

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const selectedCategoryId = +params['id'];
      this.loadCategory(selectedCategoryId);
    });
  }

  loadCategory(categoryId: number): void {
    this.categoryService.getCategory(categoryId).subscribe({
      next: (reponse: ApiResponse<CategoryResponse>) => {
        if(reponse.code === 1000 && reponse.result) {
          this.category = reponse.result;
          this.loadProductByCategoryId(categoryId);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  loadProductByCategoryId(categoryId: number) {
    this.productService.getProductByCategory(categoryId, this.page, this.size).subscribe({
      next: (response: ApiResponse<ProductListResponse>) => {
        if(response.code === 1000 && response.result) {
          this.productResponse = response.result.product_responses;
          console.log(this.productResponse);
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
