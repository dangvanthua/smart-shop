export interface NotificationResponse {
    chat_id?: number;
    content?: string;
    sender_id?: number;
    receiver_id?: number;
    chat_name?: string;
    message_type?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO';
    type?: 'SEEN' | 'MESSAGE' | 'IMAGE' | 'VIDEO' | 'AUDIO';
    media_url?: string;
}