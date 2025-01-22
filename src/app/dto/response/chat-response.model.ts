export interface ChatResponse {
    id?: number;
    last_message?: string;
    last_message_time?: string;
    name?: string;
    receiver_id?: number;
    sender_id?: number | null;
    unread_count?: number;
    chat_avatar?: string;
}