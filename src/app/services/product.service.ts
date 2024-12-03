import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "../dto/response/api-response.model";
import { ProductListResponse } from "../dto/response/products-response.model";

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private PRODUCT_API = `${environment.apiUrl}/products`;

    constructor(private http: HttpClient) {}

    getHotProducts(page: number = 0, size: number = 12): Observable<ApiResponse<ProductListResponse>> {
        const params = new HttpParams()
        .set('page', page.toString())
        .set('limit', size.toString());

        return this.http.get<ApiResponse<ProductListResponse>>(`${this.PRODUCT_API}`, {params});
    }
}