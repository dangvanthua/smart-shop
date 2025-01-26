import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageRequest } from "../dto/request/message-request.model";
import { Observable } from "rxjs";
import { ApiResponse } from "../dto/response/api-response.model";
import { MessageResponse } from "../dto/response/message-response.model";

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    private MESSAGE_API = `${environment.apiUrl}/messages`;

    constructor(private http: HttpClient) {}

    saveMessage(messageRequest: MessageRequest): Observable<ApiResponse<void>> {
        return this.http.post<ApiResponse<void>>(this.MESSAGE_API, messageRequest);
    }

    getAllMessages(
        chatId: number, 
        page: number, 
        size: number): Observable<ApiResponse<MessageResponse[]>> {

        const params = new HttpParams()
            .set("page", page)
            .set("size", size);

        return this.http.get<ApiResponse<MessageResponse[]>>(
            `${this.MESSAGE_API}/chat/${chatId}`, {params});
    }

    setMessageToSeen(chatId: number): Observable<ApiResponse<void>> {
        const params = new HttpParams()
            .set("chat-id", chatId);
        return this.http.patch<ApiResponse<void>>(`${environment.apiUrl}`, {params});
    }
}