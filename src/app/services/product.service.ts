import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "../dto/response/api-response.model";
import { ProductListResponse } from "../dto/response/products-response.model";
import { ProductDetailResponse } from "../dto/response/product-detail.model";
import { ProductResponse } from "../dto/response/product-response.model";

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private PRODUCT_API = `${environment.apiUrl}/products`;

    constructor(private http: HttpClient) {}

    getProductByCategory(categoryId: number, page: number = 0, size: number = 12): Observable<ApiResponse<ProductListResponse>> {
        const params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString());

        return this.http.get<ApiResponse<ProductListResponse>>(`${this.PRODUCT_API}/${categoryId}/category`, {params});
    }

    getFeatureProducts(page: number = 0, size: number = 12): Observable<ApiResponse<ProductListResponse>> {
        const params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString());

        return this.http.get<ApiResponse<ProductListResponse>>(`${this.PRODUCT_API}`, {params});
    }

    getDetailProduct(productId: number): Observable<ApiResponse<ProductDetailResponse>> {
        return this.http.get<ApiResponse<ProductDetailResponse>>(`${this.PRODUCT_API}/${productId}/detail`);
    }

    getProductRecommend(productId: number): Observable<ApiResponse<ProductResponse[]>> {
        return this.http.get<ApiResponse<ProductResponse[]>>(`${this.PRODUCT_API}/${productId}/recommends`);
    }
}