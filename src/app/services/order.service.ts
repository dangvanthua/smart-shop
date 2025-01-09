import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { OrderRequest } from "../dto/request/order-request.model";
import { Observable } from "rxjs";
import { ApiResponse } from "../dto/response/api-response.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { OrderHistoryResponse } from "../dto/response/order-history-response.model";

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    private ORDER_API = `${environment.apiUrl}/orders`;

    constructor(private http: HttpClient) {}

    createOrder(orderRequest: OrderRequest): Observable<ApiResponse<string>> {
        return this.http.post<ApiResponse<string>>(`${this.ORDER_API}`, orderRequest);
    }

    getOrderHistory(page: number, size: number): Observable<ApiResponse<OrderHistoryResponse>> {
        const params = new HttpParams()
            .set("page", page)
            .set("size", size);

        return this.http.get<ApiResponse<OrderHistoryResponse>>(`${this.ORDER_API}`, {params});
    }
}