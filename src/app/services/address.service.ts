import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { AddressRequest } from "../dto/request/address-request.model";
import { Observable } from "rxjs";
import { ApiResponse } from "../dto/response/api-response.model";
import { AddressResponse } from "../dto/response/address-response.model";

@Injectable({
    providedIn: 'root'
})
export class AddressService {

    private ADDRESS_API = `${environment.apiUrl}/address`;

    constructor(private http: HttpClient) {}

    createAddress(addressRequest: AddressRequest): Observable<ApiResponse<void>> {
        return this.http.post<ApiResponse<void>>(`${this.ADDRESS_API}`, addressRequest);
    }

    updateAddress(addressRequest: AddressRequest): Observable<ApiResponse<void>> {
        return this.http.put<ApiResponse<void>>(`${this.ADDRESS_API}`, addressRequest);
    }

    getAllAddress(): Observable<ApiResponse<AddressResponse[]>> {
        return this.http.get<ApiResponse<AddressResponse[]>>(`${this.ADDRESS_API}`);
    }
}