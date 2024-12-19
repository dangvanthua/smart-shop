import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { bootstrapTrash } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { CartService } from '../../services/cart.service';
import { ApiResponse } from '../../dto/response/api-response.model';
import { CartResponse } from '../../dto/response/cart-response.mode';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgIconComponent,
    HeaderComponent,
    FooterComponent
],
  viewProviders: [provideIcons({bootstrapTrash})],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {

  cartItems: CartResponse[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.cartService.getAllCartItem().subscribe({
      next: (response: ApiResponse<CartResponse[]>) => {
        if(response.code === 1000 && response.result) {
          console.log(response.result);
          this.cartItems = response.result;
        }
      },
      error: (err) => {
        console.error('Không thể tải giỏ hàng', err);
      }
    })
  }

  selectAll(event: any): void {
    const isChecked = event.target.checked;
    this.cartItems.forEach(item => item.selected = isChecked);
  }

  onItemSelect(): void {
    // Logic khi một item được chọn hoặc bỏ chọn
  }

  changeQuantity(item: CartResponse, action: string): void {
    if (action === 'increase') {
      item.quantity++;
    } else if (action === 'decrease' && item.quantity > 1) {
      item.quantity--;
    }
  }

  removeItem(item: CartResponse): void {
    this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
  }

  getTotalPrice(): number {
    return this.cartItems
      .filter(item => item.selected)
      .reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  checkout(): void {
    const selectedItems = this.cartItems.filter(item => item.selected);
    console.log('Thanh toán cho các sản phẩm:', selectedItems);
    // Thực hiện logic thanh toán tại đây
  }
}
