import { RegisterComponent } from './pages/register/register.component';
import { Component } from '@angular/core';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { ProductComponent } from './pages/product/product.component';
import { OrderComponent } from './pages/order/order.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    OrderComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'smart-shop';
}
