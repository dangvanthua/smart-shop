import { Component, EventEmitter, Output } from '@angular/core';
import { ChaterListComponent } from "./chater-list/chater-list.component";
import { ChatAreaComponent } from "./chat-area/chat-area.component";
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapBoxArrowRight, bootstrapChevronDown } from '@ng-icons/bootstrap-icons';
import { ChatResponse } from '../../../dto/response/chat-response.model';
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-messager',
  standalone: true,
  imports: [
    NgIconComponent,
    ChaterListComponent, 
    ChatAreaComponent
  ],
  viewProviders: provideIcons({bootstrapBoxArrowRight, bootstrapChevronDown}),
  templateUrl: './messager.component.html',
  styleUrl: './messager.component.scss'
})
export class MessagerComponent {
  @Output() closeMessenger = new EventEmitter<void>();

  chats: Array<ChatResponse> = [];

  constructor(private chatService: ChatService) {}

  onClose(event: Event): void {
    this.closeMessenger.emit();
    event.stopPropagation();
  }
}
