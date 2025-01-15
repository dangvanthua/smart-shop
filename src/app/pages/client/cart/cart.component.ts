import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { bootstrapTrash } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { CartService } from '../../../services/cart.service';
import { ApiResponse } from '../../../dto/response/api-response.model';
import { CartResponse } from '../../../dto/response/cart-response.mode';
import { CartRequest } from '../../../dto/request/cart-request.model';
import { debounceTime, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgIconComponent,
    HeaderComponent,
    FooterComponent,
],
  viewProviders: [provideIcons({bootstrapTrash})],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {

  cartItems: CartResponse[] = [];
  private updateQuantitySubject = new Subject<{cartId: number; cartRequest: CartRequest; item: CartResponse}>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
  ) {
    this.updateQuantitySubject.pipe(debounceTime(500)).subscribe(({cartId, cartRequest, item}) => {
      this.cartService.updateCartItem(cartId, cartRequest).subscribe({
        next: (response: ApiResponse<void>) => {
          if(response.code === 1000) {
            console.log(response.message);
          }
          item.isUpdating = false;
        },
        error: (err) => {
          console.log(err);
          item.isUpdating = false;
        }
      })
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const selectedProductId = +params['selectedProductId'];
      this.loadCartItems(selectedProductId);
    });
  }

  loadCartItems(selectedProductId?: number): void {
    this.cartService.getAllCartItem().subscribe({
      next: (response: ApiResponse<CartResponse[]>) => {
        if(response.code === 1000 && response.result) {
          this.cartItems = response.result.map(item => ({
            ...item,
            isUpdating: false,
          }));

          if(selectedProductId) {
            this.selectProduct(selectedProductId);
          }
        }
      },
      error: (err) => {
        console.error('Không thể tải giỏ hàng', err);
      }
    })
  }

  selectProduct(productId: number) {
    this.cartItems.forEach((item) => {
      item.selected = item.product.id === productId; 
    });
  }

  selectAll(event: any): void {
    const isChecked = event.target.checked;
    this.cartItems.forEach(item => item.selected = isChecked);
  }

  onItemSelect(): void {
    // Logic khi một item được chọn hoặc bỏ chọn
  }

  changeQuantity(item: CartResponse, action: string): void {

    if(item.isUpdating) return;

    const originalQuantity = item.quantity;

    if (action === 'increase' && item.quantity < 11) {
      item.quantity++;
    } else if (action === 'decrease' && item.quantity > 1) {
      item.quantity--;
    } else {
      return;
    }

    const cartRequest: CartRequest = {
      product_id: item.product.id,
      quantity: item.quantity,
    };

    item.isUpdating = true;
    this.updateQuantitySubject.next({cartId: item.id, cartRequest: cartRequest, item});

    setTimeout(() => {
      if(item.isUpdating) {
        item.quantity = originalQuantity;
        item.isUpdating = false;
      }
    }, 500);
  }

  removeItem(item: CartResponse): void {
    this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
  }

  removeSelectedItems(): void {
    const selectedProductIds = this.cartItems
      .filter(item => item.selected) 
      .map(item => item.product.id);
  
    if (selectedProductIds.length === 0) {
      console.warn('Không có sản phẩm nào được chọn để xóa');
      return;
    }
  
    this.cartItems = this.cartItems.filter(item => !item.selected);
  
    this.cartService.deleteCartItems(selectedProductIds).subscribe({
      next: (response) => {
        if (response.code === 1000) {
          console.log('Xóa các sản phẩm thành công:', response.message);
        }
      },
      error: (err) => {
        console.error('Lỗi khi xóa các sản phẩm:', err);
      }
    });
  }

  hasSelectedItems(): boolean {
    return this.cartItems.some(item => item.selected);
  }
  
  getTotalPrice(): number {
    return this.cartItems
      .filter(item => item.selected)
      .reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  checkout(): void {
    const selectedItems = this.cartItems.filter(item => item.selected);
    const productIds: string[] = [];
    selectedItems.forEach(item => {
      productIds.push(String(item.product.id));
    })
    this.router.navigate(['/order'], {queryParams: {productIds: productIds.join(',')}});
  }
}
