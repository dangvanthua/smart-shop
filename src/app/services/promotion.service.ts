import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "../dto/response/api-response.model";
import { PromotionCodeResponse } from "../dto/response/promotion-response.mode";

@Injectable({
    providedIn: 'root'
})
export class PromotionService {

    private PROMOTION_API = `${environment.apiUrl}/promotions`;

    constructor(private http: HttpClient) {}

    getPromotionCodesByProductId(productIds: number[]): Observable<ApiResponse<PromotionCodeResponse[]>> {
        const stringProductIds = productIds.join(",");
        return this.http.get<ApiResponse<PromotionCodeResponse[]>>(`${this.PROMOTION_API}/${stringProductIds}`);
    }
}