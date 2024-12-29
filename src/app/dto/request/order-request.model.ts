import { CartItemRequest } from "./cart-item-request.model";

export interface OrderRequest {
    note: string;
    shipping_address: string;
    payment_method: string;
    shipping_method: string;
    cart_items: CartItemRequest[];
}