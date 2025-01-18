export interface MessageResponse {
    content?: string;
    created_at?: string;
    id?: number;
    media_url?: string;
    receiver_id?: number;
    sender_id?: number;
    state?: 'SENT' | 'SEEN';
    type?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO';
}