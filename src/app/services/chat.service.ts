import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserResponse } from "../dto/response/user-response.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { ApiResponse } from "../dto/response/api-response.model";
import { ChatRequest } from "../dto/request/chat-request.model";

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    private CHAT_API = `${environment}/chats`;
    
    constructor(private http: HttpClient) {}

    searchUserIsBuyer(chatRequest: ChatRequest): Observable<ApiResponse<number>> {
        return this.http.post<ApiResponse<number>>(`${this.CHAT_API}`, chatRequest);
    }

    createChat(receiverId: number): Observable<ApiResponse<number>> {
        return this.http.post<ApiResponse<number>>(`${this.CHAT_API}`, receiverId);
    }
}