import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { OrderComponent } from './pages/order/order.component';
import { CartComponent } from './pages/cart/cart.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthCallbackComponent } from './pages/auth-callback/auth-callback.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';

export const routes: Routes = [
    { path: '', component: HomeComponent }, 
    { path: 'login', component: LoginComponent},
    { path: 'auth/google/callback', component: AuthCallbackComponent},
    { path: 'auth/facebook/callback', component: AuthCallbackComponent},
    { path: 'product-detail/:id', component: ProductDetailComponent }, 
    { path: 'order', component: OrderComponent, canActivate: [AuthGuard] },
    { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
    { path: 'privacy', component: PrivacyPolicyComponent}
];
