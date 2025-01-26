import { Component, Output, EventEmitter, InputSignal, input } from '@angular/core';
import { ChatUserComponent } from "./chat-user/chat-user.component";
import { ChatResponse } from '../../../../dto/response/chat-response.model';
import { UserResponse } from '../../../../dto/response/user-response.model';
import { ChatService } from '../../../../services/chat.service';
import { UserService } from '../../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '../../../../dto/response/api-response.model';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../../../services/token.service';
import { ChatRequest } from '../../../../dto/request/chat-request.model';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapFullscreenExit, bootstrapMenuButtonWide, bootstrapPatchPlus } from '@ng-icons/bootstrap-icons';

@Component({
  selector: 'app-chater-list',
  standalone: true,
  imports: [
    ChatUserComponent,
    FormsModule,
    CommonModule,
    NgIconComponent
  ],
  viewProviders: provideIcons({
    bootstrapMenuButtonWide,
    bootstrapPatchPlus,
    bootstrapFullscreenExit
  }),
  templateUrl: './chater-list.component.html',
  styleUrl: './chater-list.component.scss'
})
export class ChaterListComponent {
  searchNewContact = false;
  searchKey: string = '';
  contacts: Array<UserResponse> = [];
  @Output() chatSelected = new EventEmitter<ChatResponse>();
  chats: InputSignal<ChatResponse[]> = input<ChatResponse[]>([]);

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    
  }

  onSelectContact(contact: UserResponse): void {
    const chatReq: ChatRequest = {
      receiver_id: contact.id
    }
    this.chatService.createChat(chatReq).subscribe({
      next: (response: ApiResponse<number>) => {
        if(response.code === 1000 && response.result) {
          const chat: ChatResponse = {
            id: response.result,
            name: contact.fullname,
            sender_id: this.tokenService.getUserIdFromToken(),
            receiver_id: contact.id
          };
          this.chats().unshift(chat);
          this.searchNewContact = false;
          this.chatSelected.emit(chat);
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  onSearchBuyer(): void {
    this.userService.searchUserIsBuyer().subscribe({
      next: (response: ApiResponse<UserResponse[]>) => {
        if(response.code === 1000 && response.result) {
          this.contacts = response.result;
          this.searchNewContact = true;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  onExitSearch() {
    this.searchNewContact = false;
  }

  chatClicked(chat: ChatResponse): void {
    this.chatSelected.emit(chat);
  }
}
