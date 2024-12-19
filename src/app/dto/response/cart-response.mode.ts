import { ProductResponse } from "./product-response.model";
import { UserResponse } from "./user-response.model";

export interface CartResponse {
    id: number;
    quantity: number;
    added_at: Date;
    product: ProductResponse;
    selected?: boolean;
}