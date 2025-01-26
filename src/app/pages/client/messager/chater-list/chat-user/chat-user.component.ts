import { Component, Input } from '@angular/core';
import { UserResponse } from '../../../../../dto/response/user-response.model';
import { ChatResponse } from '../../../../../dto/response/chat-response.model';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapImageFill } from '@ng-icons/bootstrap-icons';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat-user',
  standalone: true,
  imports: [
    NgIconComponent,
    DatePipe
  ],
  viewProviders: provideIcons(
    {
      bootstrapImageFill
    }),
  templateUrl: './chat-user.component.html',
  styleUrl: './chat-user.component.scss'
})
export class ChatUserComponent {
  @Input() contact?: UserResponse; 
  @Input() chat?: ChatResponse;

  wrappedMessage(message: string | undefined): string {
    if(!message) return 'Chưa có tin nhắn';
    return message.length < 20 ? message : message.substring(0, 10) + '...';
  }
}
