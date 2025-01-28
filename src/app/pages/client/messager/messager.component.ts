import { Component, EventEmitter, Output } from '@angular/core';
import { ChaterListComponent } from "./chater-list/chater-list.component";
import { ChatAreaComponent } from "./chat-area/chat-area.component";
import SockJS from 'sockjs-client'; 
import * as Stomp from 'stompjs';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapBoxArrowRight, bootstrapChevronDown, bootstrapGear } from '@ng-icons/bootstrap-icons';
import { ChatResponse } from '../../../dto/response/chat-response.model';
import { ChatService } from '../../../services/chat.service';
import { ApiResponse } from '../../../dto/response/api-response.model';
import { TokenService } from '../../../services/token.service';
import { MessageService } from '../../../services/message.service';
import { MessageResponse } from '../../../dto/response/message-response.model';
import { NotificationResponse } from '../../../dto/response/notification-response.model';
import { MessageRequest } from '../../../dto/request/message-request.model';
import { MessageResponses } from '../../../dto/response/messages-response.model';

@Component({
  selector: 'app-messager',
  standalone: true,
  imports: [
    NgIconComponent,
    ChaterListComponent, 
    ChatAreaComponent
  ],
  viewProviders: provideIcons({
    bootstrapBoxArrowRight, 
    bootstrapChevronDown,
    bootstrapGear,
  }),
  templateUrl: './messager.component.html',
  styleUrls: ['./messager.component.scss']
})
export class MessagerComponent {
  @Output() closeMessenger = new EventEmitter<void>();
  selectedChat: ChatResponse | null = null;
  page: number = 0;
  size: number = 12;
  chats: Array<ChatResponse> = [];
  messages: Array<MessageResponse> = [];
  userId?: number | null;
  socketClient: any = null;
  private notificationSubscription: any;

  constructor(
    private chatService: ChatService,
    private tokenService: TokenService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.userId = this.tokenService.getUserIdFromToken();
    this.initWebSocket();
    // xu ly thong tin chat
    this.chatService.getAllChats(this.page, this.size).subscribe({
      next: (response: ApiResponse<ChatResponse[]>) => {
        if(response.code === 1000 && response.result) {
          this.chats = response.result;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  chatSelected(chat: ChatResponse): void {
    this.selectedChat = chat;
    this.chats.forEach(c => c.id === this.selectedChat?.id ? c.unread_count = 0 : c);
    this.messages = [];
    if(this.selectedChat.id) {
      this.loadMessages(this.selectedChat.id);
      this.messageService.setMessageToSeen(this.selectedChat.id).subscribe({
        next: (response: ApiResponse<void>) => {
          // console.log('Set message to seen success');
        },
        error: (err) => {
          console.log('Have some error occured', err);
        }
      });
    }else{
      console.log('Cannot get your message');
    }
  }

  private loadMessages(chatId: number): void {
    if (!chatId) {
      console.error('Invalid chat ID');
      return;
    }
    
    this.messageService.getAllMessages(chatId, this.page, this.size)
      .subscribe({
        next: (response: ApiResponse<MessageResponses>) => {
          if (response.code === 1000 && response.result) {
            this.messages = response.result.message_responses ?? [];
          }
        },
        error: (err) => {
          console.error('Error loading messages:', err);
        }
    });
  }

  private initWebSocket(): void {
    if(this.userId) {
      let ws = new SockJS('http://localhost:8080/api/v1/ws');
      this.socketClient = Stomp.over(ws);
      const subUrl = `/user/${this.userId.toString()}/chat`;
      this.socketClient.connect({'Authorization': 'Bearer ' + this.tokenService.getToken()}, 
      () => {
        this.notificationSubscription = this.socketClient.subscribe(subUrl, 
          (message: any) => {
            const notification: NotificationResponse = JSON.parse(message.body);
            this.handleNotification(notification);
          },
          () => console.log('Error while connecting to websocket')
        );
      });
    }
  }
  
  private handleNotification(notification: NotificationResponse): void {
    if (!notification) return;
  
    // Nếu là cuộc trò chuyện đang mở
    if (this.selectedChat && this.selectedChat.id === notification.chat_id) {
      switch (notification.type) {
        case 'MESSAGE':
        case 'IMAGE':
          const message: MessageResponse = {
            sender_id: notification.sender_id,
            receiver_id: notification.receiver_id,
            content: notification.content,
            type: notification.message_type,
            media_url: notification.media_url,
            created_at: new Date().toString(),
          };
  
          if (notification.type === 'IMAGE') {
            this.selectedChat.last_message = 'Attachment';
          } else {
            this.selectedChat.last_message = notification.content;
          }
          this.messages.push(message);
          break;
  
        case 'SEEN':
          this.messages.forEach(m => (m.state = 'SEEN'));
          break;
      }
    } else {
      // Nếu là cuộc trò chuyện khác
      const destChat = this.chats.find(c => c.id === notification.chat_id);
      if (destChat && notification.type !== 'SEEN') {
        if (notification.type === 'MESSAGE') {
          destChat.last_message = notification.content;
        } else if (notification.type === 'IMAGE') {
          destChat.last_message = 'Attachment';
        }
        destChat.last_message_time = new Date().toString();
        destChat.unread_count = (destChat.unread_count || 0) + 1;
      }
    }
  }  

  private getSenderId(): number {
    if(this.selectedChat?.sender_id === this.userId) {
      return this.selectedChat?.sender_id as number;
    }
    return this.selectedChat?.receiver_id as number;
  }

  private getReceiverId(): number {
    if(this.selectedChat?.sender_id === this.userId) {
      return this.selectedChat?.receiver_id as number;
    }
    return this.selectedChat?.sender_id as number;
  }

  onMessageSent(newMessage: string): void {
    if (newMessage) {
      const messageRequest: MessageRequest = {
        chat_id: this.selectedChat?.id,
        sender_id: this.getSenderId(),
        receiver_id: this.getReceiverId(),
        content: newMessage,
        type: 'TEXT',
      };
      this.messageService.saveMessage(messageRequest).subscribe({
        next: (response: ApiResponse<void>) => {
          if (response.code === 1000) {
            const message: MessageResponse = {
              sender_id: this.getSenderId(),
              receiver_id: this.getReceiverId(),
              content: newMessage,
              type: 'TEXT',
              state: 'SENT',
              created_at: new Date().toString(),
            };
  
            // Nếu đang ở cuộc trò chuyện hiện tại, thêm tin nhắn
            if (this.selectedChat) {
              this.selectedChat.last_message = newMessage;
              this.messages.push(message);
            }
  
            // Xử lý cập nhật danh sách chats
            const chatToUpdate = this.chats.find(c => c.id === this.selectedChat?.id);
            if (chatToUpdate) {
              chatToUpdate.last_message = newMessage;
              chatToUpdate.last_message_time = new Date().toString();
  
              // Nếu cuộc trò chuyện không phải đang được mở, tăng unread_count
              if (!this.selectedChat || chatToUpdate.id !== this.selectedChat.id) {
                chatToUpdate.unread_count = (chatToUpdate.unread_count || 0) + 1;
              }
            }
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }

  onClose(event: Event): void {
    this.closeMessenger.emit();
    event.stopPropagation();
  }

  ngOnDestroy(): void {
    if (this.socketClient && this.socketClient.connected) {
      this.socketClient.disconnect(() => {
        console.log('WebSocket disconnected');
      });
    }
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }  
}
