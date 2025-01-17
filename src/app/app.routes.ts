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
import { RegisterComponent } from './pages/client/register/register.component';
import { OrderInfoComponent } from './pages/client/order-info/order-info.component';
import { BlogComponent } from './pages/client/blog/blog.component';
import { ProductComponent } from './pages/client/product/product.component';

export const routes: Routes = [
    { 
        path: '', 
        redirectTo: 'home', 
        pathMatch: 'full' 
    },
    { 
        path: 'home', 
        component: HomeComponent, 
        data: { breadcrumb: 'Home' } 
    },
    { 
        path: 'login', 
        component: LoginComponent, 
        data: { breadcrumb: 'Login' } 
    },
    { 
        path: 'register', 
        component: RegisterComponent, 
        data: { breadcrumb: 'Register' } 
    },
    {
        path: 'auth', children: [
            { path: 'google/callback', component: AuthCallbackComponent },
            { path: 'facebook/callback', component: AuthCallbackComponent }
        ]
    },
    { 
        path: 'product/category', 
        component: ProductComponent, 
        data: { breadcrumb: 'Products' } 
    },
    {
        path: 'product/:id', 
        component: ProductDetailComponent,
        data: { breadcrumb: 'Product Detail' } 
    },
    { 
        path: 'order', 
        component: OrderComponent, 
        canActivate: [AuthGuard], 
        data: { breadcrumb: 'Order' } 
    },
    { 
        path: 'order-info', 
        canActivate: [AuthGuard], 
        component: OrderInfoComponent, 
        data: { breadcrumb: 'Order Info' } 
    },
    {
        path: 'account', canActivate: [AuthGuard], children: [
            { 
                path: 'cart', 
                component: CartComponent, 
                data: { breadcrumb: 'Cart' } 
            },
            { 
                path: 'profile', 
                component: UserProfileComponent, 
                data: { breadcrumb: 'Profile' } 
            }
        ]
    },
    {
        path: 'policy', children: [
            { 
                path: 'privacy', 
                component: PrivacyPolicyComponent, 
                data: { breadcrumb: 'Privacy Policy' } 
            }
        ]
    },
    {
        path: 'payment', children: [
            { path: 'success/:id', component: PaymentSuccessComponent },
            { path: 'cancel', component: PaymentCancelComponent }
        ]
    },
    {
        path: 'blog', 
        component: BlogComponent, 
        canActivate: [AuthGuard], 
        data: {breadcrumb: 'Blog'}
    },
    { 
        path: '**', 
        redirectTo: 'home', 
        pathMatch: 'full' 
    }
];