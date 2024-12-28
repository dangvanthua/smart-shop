
export interface OrderRequest {
    note: string;
    shipping_address: string;
    payment_method: string;
    shipping_method: string;
    cart_items: [{
        product_id: number;
        quantity: number;
        promotion_code: string;
    }]
}