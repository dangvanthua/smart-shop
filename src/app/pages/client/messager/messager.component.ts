import { Component, EventEmitter, Output } from '@angular/core';
import { ChaterListComponent } from "./chater-list/chater-list.component";
import { ChatAreaComponent } from "./chat-area/chat-area.component";
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapBoxArrowRight, bootstrapChevronDown, bootstrapGear } from '@ng-icons/bootstrap-icons';
import { ChatResponse } from '../../../dto/response/chat-response.model';
import { ChatService } from '../../../services/chat.service';
import { UserResponse } from '../../../dto/response/user-response.model';
import { MessageResponse } from '../../../dto/response/message-response.model';
import { MessageService } from '../../../services/message.service';

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
  styleUrl: './messager.component.scss'
})
export class MessagerComponent {
  @Output() closeMessenger = new EventEmitter<void>();
  selectedChat: ChatResponse = {};
  chats: Array<ChatResponse> = [];
  messages: Array<MessageResponse> = [];

  constructor(
    private chatService: ChatService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    // xu ly thong tin chat

  }

  onClose(event: Event): void {
    this.closeMessenger.emit();
    event.stopPropagation();
  }

  chatSelected(chat: ChatResponse): void {
    this.selectedChat = chat;
  }
}
