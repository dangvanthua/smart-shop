import { Component } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { ProductListResponse } from '../../../dto/response/products-response.model';
import { ApiResponse } from '../../../dto/response/api-response.model';
import { ProductResponse } from '../../../dto/response/product-response.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CategoryResponse } from '../../../dto/response/category-response.model';
import { CategoryService } from '../../../services/category.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapCart } from '@ng-icons/bootstrap-icons';
import { Router } from '@angular/router';
import { HeaderComponent } from "../../../components/header/header.component";
import { FooterComponent } from "../../../components/footer/footer.component";
import { CartService } from '../../../services/cart.service';
import { CartRequest } from '../../../dto/request/cart-request.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgIconComponent,
    CommonModule,
    HeaderComponent,
    FooterComponent
],
  viewProviders: [provideIcons({
    bootstrapCart,
  })],
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
    private cartService: CartService,
    private router: Router,
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
    let isNewChange = false;
    if(this.category && (this.category.id !== category.id)) isNewChange = true;
    this.category = category;
    this.productService.getProductByCategory(category.id, this.pageCategory, this.size).subscribe({
      next: (response: ApiResponse<ProductListResponse>) => {
        if(response.code === 1000 && response.result) {
          if(isNewChange) {
            this.productCategories = response.result.product_responses;
          }else {
            this.productCategories = [...this.productCategories, ...response.result.product_responses];
          }

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
    if(this.pageCategory < this.totalProductCategoryPages - 1) {
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

  goToProductDetail(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  addCart(productId: number) {
    const cartRequest: CartRequest = {
      product_id: productId,
      quantity: 1
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
}
