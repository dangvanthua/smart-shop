import { Component } from '@angular/core';
import { RegisterComponent } from './pages/client/register/register.component';
import { ProductDetailComponent } from './pages/client/product-detail/product-detail.component';
import { ProductComponent } from './pages/client/product/product.component';
import { OrderComponent } from './pages/client/order/order.component';
import { HomeComponent } from './pages/client/home/home.component';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'smart-shop';
}
