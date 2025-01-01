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
import { ProductComponent } from './pages/client/product/product.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, data: { breadcrumb: 'Home' } },
    { path: 'login', component: LoginComponent, data: { breadcrumb: 'Login' } },
    { path: 'auth', children: [
        { path: 'google/callback', component: AuthCallbackComponent },
        { path: 'facebook/callback', component: AuthCallbackComponent }
    ]},
    { path: 'product', children: [
        { path: ':id', component: ProductDetailComponent, data: { breadcrumb: 'Product Detail' } },
    ]},
    { path: 'order', component: OrderComponent, data: { breadcrumb: 'Order' } },
    { path: 'account', canActivate: [AuthGuard], children: [
        { path: 'cart', component: CartComponent, data: { breadcrumb: 'Cart' } },
        { path: 'profile', component: UserProfileComponent, data: { breadcrumb: 'Profile' } }
    ]},
    { path: 'policy', children: [
        { path: 'privacy', component: PrivacyPolicyComponent, data: { breadcrumb: 'Privacy Policy' } }
    ]},
    { path: 'payment', children: [
        { path: 'success', component: PaymentSuccessComponent },
        { path: 'cancel', component: PaymentCancelComponent }
    ]}
  ];
  