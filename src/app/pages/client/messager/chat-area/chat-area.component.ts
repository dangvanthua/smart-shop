import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { ChatInputComponent } from "./chat-input/chat-input.component";
import { ChatResponse } from '../../../../dto/response/chat-response.model';
import { MessageService } from '../../../../services/message.service';
import { TokenService } from '../../../../services/token.service';
import { MessageResponse } from '../../../../dto/response/message-response.model';
import { ApiResponse } from '../../../../dto/response/api-response.model';

@Component({
  selector: 'app-chat-area',
  standalone: true,
  imports: [CommonModule, ChatInputComponent],
  templateUrl: './chat-area.component.html',
  styleUrl: './chat-area.component.scss'
})
export class ChatAreaComponent {
  page: number = 0;
  size: number = 12;
  userId?: number | null;
  messages?: MessageResponse[];
  @Input() selectedChat?: ChatResponse;

  constructor(
    private messageService: MessageService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.userId = this.tokenService.getUserIdFromToken();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Khi selectedChat thay đổi
    if (changes['selectedChat'] && this.selectedChat) {
      this.loadMessages(this.selectedChat.id!);
    }
  }

  loadMessages(chatId: number): void {
    this.messageService.getAllMessages(chatId, this.page, this.size)
    .subscribe({
      next: (response: ApiResponse<MessageResponse[]>) => {
        if(response.code === 1000 && response.result) {
          this.messages = response.result ?? [];
        }
      },
      error: (err) => {
        console.error('Error loading messages:', err);
      }
    });
  }

  onMessageSent(message: string): void {
    
  }
}
