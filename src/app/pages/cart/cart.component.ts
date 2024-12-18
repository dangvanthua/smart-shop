import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { bootstrapTrash } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgIconComponent
  ],
  viewProviders: [provideIcons({bootstrapTrash})],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  cartItems = [
    { id: 1, name: 'Sản phẩm A', price: 100, image: 'path/to/image.jpg', selected: false, quantity: 1 },
    { id: 2, name: 'Sản phẩm B', price: 200, image: 'path/to/image.jpg', selected: false, quantity: 1 },
    { id: 3, name: 'Sản phẩm C', price: 300, image: 'path/to/image.jpg', selected: false, quantity: 1 }
  ];

  selectAll(event: any) {
    const isChecked = event.target.checked;
    this.cartItems.forEach(item => item.selected = isChecked);
  }

  onItemSelect() {
    // Logic when an item is selected/deselected
  }

  changeQuantity(item: any, action: string) {
    if (action === 'increase') {
      item.quantity++;
    } else if (action === 'decrease' && item.quantity > 1) {
      item.quantity--;
    }
  }

  removeItem(item: any) {
    this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
  }

  getTotalPrice(): number {
    return this.cartItems
      .filter(item => item.selected)
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  checkout() {
    const selectedItems = this.cartItems.filter(item => item.selected);
    console.log('Thanh toán cho các sản phẩm:', selectedItems);
    // Implement the checkout logic here
  }
}
