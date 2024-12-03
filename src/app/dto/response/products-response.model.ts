import { ProductResponse } from "./product-response.model";

export interface ProductListResponse {
    product_responses: ProductResponse[];
    total_pages: number;
    total_items: number;
}