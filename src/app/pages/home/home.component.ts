import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ProductService } from '../../services/product.service';
import { ProductListResponse } from '../../dto/response/products-response.model';
import { ApiResponse } from '../../dto/response/api-response.model';
import { ProductResponse } from '../../dto/response/product-response.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CategoryResponse } from '../../dto/response/category-response.model';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule
  ],
  providers: [CurrencyPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  categories: CategoryResponse[] = [];
  category!: CategoryResponse;
  productCategories: ProductResponse[] = [];
  products: ProductResponse[] = [];
  pageCategory: number = 0;
  pageFeature: number = 0;
  size: number = 12;
  totalProductCategoryPages: number = 0;
  totalProductPages: number = 0;
  selectedCategoryIndex: number = 0;


  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private currencyPipe: CurrencyPipe) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  formatCurrency(price: number): string {
    return this.currencyPipe.transform(price, 'VND', 'symbol', '1.0-0')!;
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (response: ApiResponse<CategoryResponse[]>) => {
        if(response.code === 1000 && response.result) {
          this.categories = response.result;
          this.selectCategory(this.selectedCategoryIndex, this.categories[0]);
        }
      }
    })
  }

  selectCategory(index: number, category: CategoryResponse): void {
    this.selectedCategoryIndex = index;
    this.category = category;
    const categoryId = category.id;
    this.productService.getProductByCategory(categoryId, this.pageCategory, this.size).subscribe({
      next: (response: ApiResponse<ProductListResponse>) => {
        if(response.code === 1000 && response.result) {
          console.log(response.result.product_responses);
          this.productCategories = response.result.product_responses;
          this.totalProductCategoryPages = response.result.total_pages;
        }
      }
    });
  }

  loadProducts(): void {
    this.productService.getFeatureProducts(this.pageFeature, this.size).subscribe({
      next: (response: ApiResponse<ProductListResponse>) => {
        if(response.code === 1000 && response.result) {
          this.products = [...this.products, ...response.result.product_responses];
          this.totalProductPages = response.result.total_pages;
        }
      },
      error: (err) => {
        console.error('Error loading products', err);
      }
    });
  }

  loadMoreCategoryProduct(): void {
    if(this.pageCategory < this.totalProductPages - 1) {
      this.pageCategory++;
      this.selectCategory(this.selectedCategoryIndex, this.category);
    }
  }

  loadMoreFeatureProduct(): void {
    if(this.pageFeature < this.totalProductPages - 1) {
      this.pageFeature++;
      this.loadProducts();
    }
  }
}
