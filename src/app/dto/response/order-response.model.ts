export interface OrderResponse {
    id: number;
    note: string;
    order_date: Date;
    shipping_date: Date;
    shipping_address: string;
    shipping_method: string;
    payment_method: string;
    status: string;
    tracking_number: string;
}