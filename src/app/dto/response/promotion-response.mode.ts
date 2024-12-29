export interface PromotionCodeResponse {
    promotion_code: number;
    code_discount_value: number;
    promotion_name: string;
    discount_type: string;
    promotion_discount_value: number;
    start_date: Date;
    end_date: Date;
    is_active: boolean;
    product_id: number;
}