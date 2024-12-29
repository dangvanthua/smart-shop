import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { OrderRequest } from "../dto/request/order-request.model";
import { Observable } from "rxjs";
import { ApiResponse } from "../dto/response/api-response.model";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    private ORDER_API = `${environment.apiUrl}/orders`;

    constructor(private http: HttpClient) {}

    createOrder(orderRequest: OrderRequest): Observable<ApiResponse<string>> {
        return this.http.post<ApiResponse<string>>(`${this.ORDER_API}`, orderRequest);
    }
}