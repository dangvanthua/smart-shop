import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { CartRequest } from "../dto/request/cart-request.model";
import { Observable } from "rxjs";
import { ApiResponse } from "../dto/response/api-response.model";
import { HttpClient } from "@angular/common/http";
import { CartResponse } from "../dto/response/cart-response.mode";

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private CART_API = `${environment.apiUrl}/carts`

    constructor(private http: HttpClient) {}

    addProductToCart(cartRequest: CartRequest): Observable<ApiResponse<void>> {
        return this.http.post<ApiResponse<void>>(`${this.CART_API}`, cartRequest);
    }

    getAllCartItem(): Observable<ApiResponse<CartResponse[]>> {
        return this.http.get<ApiResponse<CartResponse[]>>(`${this.CART_API}`);
    }

    updateCartItem(cartId: number, cartRequest: CartRequest): Observable<ApiResponse<void>> {
        return this.http.put<ApiResponse<void>>(`${this.CART_API}/${cartId}`, cartRequest);
    }

    deleteCartItems(selectedProductIds: number[]): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.CART_API}`, {body: selectedProductIds});
    }
}