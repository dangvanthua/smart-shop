import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private CART_API = `${environment.apiUrl}/carts`
}