import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { ApiResponse } from "../dto/response/api-response.model";
import { OrderDetailResponse } from "../dto/response/order-detail-response.model";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class OrderDetailService {

    private API_ORDER_DETAIL = `${environment.apiUrl}/order-details`;

    constructor(private http: HttpClient) {}

    getOrderDetails(orderId: number): Observable<ApiResponse<OrderDetailResponse[]>>  {
        return this.http.get<ApiResponse<OrderDetailResponse[]>>(`${this.API_ORDER_DETAIL}/${orderId}`);
    }
}