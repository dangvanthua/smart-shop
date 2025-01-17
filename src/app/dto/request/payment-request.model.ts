export interface VerifyPaymentRequest {
    payment_id: string;
    payer_id: string;
    order_id: number | undefined;
}