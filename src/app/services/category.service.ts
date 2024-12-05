import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "../dto/response/api-response.model";
import { CategoryResponse } from "../dto/response/category-response.model";

@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    private CATE_API = `${environment.apiUrl}/categories`;

    constructor(private http: HttpClient) {}

    getAllCategories(): Observable<ApiResponse<CategoryResponse[]>> {
        return this.http.get<ApiResponse<CategoryResponse[]>>(`${this.CATE_API}`);
    }
}