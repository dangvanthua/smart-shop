export interface CartItemRequest {
    product_id: number;
    quantity: number;
    promotion_code: string[];
}