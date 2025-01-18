export interface MessageRequest {
    chat_id?: number;
    content?: string;
    sender_id?: number;
    receiver_id?: number;
    type?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO';
}