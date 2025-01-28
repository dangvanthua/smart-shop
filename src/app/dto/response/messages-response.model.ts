import { MessageResponse } from "./message-response.model";

export interface MessageResponses {
    message_responses: Array<MessageResponse>;
    total_elements: number;
    total_pages: number;
}