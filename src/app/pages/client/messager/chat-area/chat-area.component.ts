import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ChatInputComponent } from "./chat-input/chat-input.component";
import { ChatResponse } from '../../../../dto/response/chat-response.model';
import { TokenService } from '../../../../services/token.service';
import { MessageResponse } from '../../../../dto/response/message-response.model';

@Component({
  selector: 'app-chat-area',
  standalone: true,
  imports: [CommonModule, ChatInputComponent],
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.scss']
})
export class ChatAreaComponent {
  page: number = 0;
  size: number = 12;
  userId?: number | null;
  messageContent: string = '';
  @Input() messages: Array<MessageResponse> = [];
  @Input() selectedChat?: ChatResponse | null;
  @Output() messageSent = new EventEmitter<string>();
  @ViewChild('scrollableDiv') scrollableDiv!: ElementRef<HTMLDivElement>;

  constructor(
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.userId = this.tokenService.getUserIdFromToken();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    if(this.scrollableDiv) {
      const div = this.scrollableDiv.nativeElement;
      div.scrollTop = div.scrollHeight;
    }
  }
  
  onMessageSent(message: string): void {
    if(message.trim()) {
      this.messageSent.emit(message);
    }
  }
}
