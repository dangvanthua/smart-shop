import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserResponse } from "../dto/response/user-response.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { ApiResponse } from "../dto/response/api-response.model";
import { ChatRequest } from "../dto/request/chat-request.model";
import { ChatResponse } from "../dto/response/chat-response.model";

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    private CHAT_API = `${environment.apiUrl}/chats`;
    
    constructor(private http: HttpClient) {}

    createChat(chatReq: ChatRequest): Observable<ApiResponse<number>> {
        return this.http.post<ApiResponse<number>>(`${this.CHAT_API}`, chatReq);
    }

    getAllChats(page: number, size: number): Observable<ApiResponse<ChatResponse[]>> {
        
        const params = new HttpParams()
            .set("page", page)
            .set("size", size);

        return this.http.get<ApiResponse<ChatResponse[]>>(`${this.CHAT_API}`, {params})
    }
}