import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UserRequest } from "../dto/request/user-request.model";
import { ApiResponse } from "../dto/response/api-response.model";
import { UserResponse } from "../dto/response/user-response.model";
import { Observable } from "rxjs";
import { AuthRequest } from "../dto/request/auth-request.model";
import { AuthResponse } from "../dto/response/auth-response.model";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private USER_API = `${environment.apiUrl}/users`;

    constructor(private http: HttpClient) { }

    register(userRequest: UserRequest): Observable<ApiResponse<UserResponse>> {
        return this.http.post<ApiResponse<UserResponse>>(`${this.USER_API}`, userRequest);
    }

    getUserDetail(): Observable<ApiResponse<UserResponse>> {
        return this.http.get<ApiResponse<UserResponse>>(`${this.USER_API}/detail`);
    }
}