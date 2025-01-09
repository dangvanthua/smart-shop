import { OrderResponse } from "./order-response.model";

export interface OrderHistoryResponse {
    order_responses: OrderResponse[];
    total_pages: number;
    total_elements: number;
}