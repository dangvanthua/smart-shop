import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ProductService } from '../../services/product.service';
import { ProductListResponse } from '../../dto/response/products-response.model';
import { ApiResponse } from '../../dto/response/api-response.model';
import { ProductResponse } from '../../dto/response/product-response.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent
  ],
  providers: [CurrencyPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  products: ProductResponse[] = [];
  page: number = 0;
  size: number = 12;
  totalPages: number = 0;


  constructor(
    private productService: ProductService,
    private currencyPipe: CurrencyPipe) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  formatCurrency(price: number): string {
    return this.currencyPipe.transform(price, 'VND', 'symbol', '1.0-0')!;
  }

  loadProducts(): void {
    this.productService.getHotProducts(this.page, this.size).subscribe({
      next: (response: ApiResponse<ProductListResponse>) => {
        if(response.code === 1000 && response.result) {
          this.products = [...this.products, ...response.result.product_responses];
          this.totalPages = response.result.total_pages;
        }
      },
      error: (err) => {
        console.error('Error loading products', err);
      }
    });
  }

  loadMore(): void {
    if(this.page < this.totalPages - 1) {
      this.page++;
      this.loadProducts();
    }
  }
}
