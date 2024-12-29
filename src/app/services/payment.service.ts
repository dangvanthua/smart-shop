import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { VerifyPaymentRequest } from "../dto/request/payment-request.model";
import { Observable } from "rxjs";
import { ApiResponse } from "../dto/response/api-response.model";

@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    private PAYMENT_API = `${environment.apiUrl}/payments`;

    constructor(private http: HttpClient) {}

    executePayment(verifyPaymentRequest: VerifyPaymentRequest): Observable<ApiResponse<Map<string, any>>> {
        return this.http.post<ApiResponse<Map<string, any>>>(`${this.PAYMENT_API}/execute`, verifyPaymentRequest);
    }
}