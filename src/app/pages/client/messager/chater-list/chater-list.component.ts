import { Component, input, InputSignal, output } from '@angular/core';
import { ChatUserComponent } from "./chat-user/chat-user.component";
import { ChatResponse } from '../../../../dto/response/chat-response.model';
import { UserResponse } from '../../../../dto/response/user-response.model';
import { ChatService } from '../../../../services/chat.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-chater-list',
  standalone: true,
  imports: [ChatUserComponent],
  templateUrl: './chater-list.component.html',
  styleUrl: './chater-list.component.scss'
})
export class ChaterListComponent {
  chats: InputSignal<ChatResponse[]> = input<ChatResponse[]>([]);
  searchNewContact = false;
  contacts: Array<UserResponse> = [];
  chatSelected = output<ChatResponse>();

  constructor(
    private chatService: ChatService,
    private userService: UserService,
  ) {}
}
