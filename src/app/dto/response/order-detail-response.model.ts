import { ProductResponse } from "./product-response.model";

export interface OrderDetailResponse {
    product_response: ProductResponse;
    total_money: number;
    number_of_products: number;
}