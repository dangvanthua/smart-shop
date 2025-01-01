import { Routes } from '@angular/router';
import { HomeComponent } from './pages/client/home/home.component';
import { ProductDetailComponent } from './pages/client/product-detail/product-detail.component';
import { OrderComponent } from './pages/client/order/order.component';
import { CartComponent } from './pages/client/cart/cart.component';
import { LoginComponent } from './pages/client/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthCallbackComponent } from './pages/client/auth-callback/auth-callback.component';
import { PrivacyPolicyComponent } from './pages/client/privacy-policy/privacy-policy.component';
import { PaymentSuccessComponent } from './pages/client/payment-success/payment-success.component';
import { PaymentCancelComponent } from './pages/client/payment-cancel/payment-cancel.component';
import { UserProfileComponent } from './pages/client/user-profile/user-profile.component';

export const routes: Routes = [
    { path: '', component: HomeComponent }, 
    { path: 'login', component: LoginComponent},
    { path: 'auth/google/callback', component: AuthCallbackComponent},
    { path: 'auth/facebook/callback', component: AuthCallbackComponent},
    { path: 'product-detail/:id', component: ProductDetailComponent }, 
    { path: 'order', component: OrderComponent, canActivate: [AuthGuard] },
    { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
    { path: 'privacy', component: PrivacyPolicyComponent},
    { path: 'payment/success', component: PaymentSuccessComponent},
    { path: 'payment/cancel', component: PaymentCancelComponent},
    { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard]}
];
