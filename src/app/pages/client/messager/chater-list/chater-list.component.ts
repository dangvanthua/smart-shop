import { Component, input, InputSignal, output } from '@angular/core';
import { ChatUserComponent } from "./chat-user/chat-user.component";
import { ChatResponse } from '../../../../dto/response/chat-response.model';
import { UserResponse } from '../../../../dto/response/user-response.model';
import { ChatService } from '../../../../services/chat.service';
import { UserService } from '../../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '../../../../dto/response/api-response.model';
import { debounceTime, Subject, Subscription, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../../../services/token.service';

@Component({
  selector: 'app-chater-list',
  standalone: true,
  imports: [
    ChatUserComponent,
    FormsModule,
    CommonModule
  ],
  templateUrl: './chater-list.component.html',
  styleUrl: './chater-list.component.scss'
})
export class ChaterListComponent {
  searchNewContact = false;
  searchKey: string = '';
  contacts: Array<UserResponse> = [];
  chats: InputSignal<ChatResponse[]> = input<ChatResponse[]>([]);
  chatSelected = output<ChatResponse>();
  private searchSubject: Subject<string> = new Subject<string>();
  private subscription: Subscription = new Subscription();

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.searchSubject.pipe(
        debounceTime(500),
        switchMap((searchTerm) => this.userService.searchUserIsBuyer(searchTerm))
      ).subscribe({
        next: (response: ApiResponse<UserResponse[]>) => {
          if(response.code === 1000 && response.result) {
            this.searchNewContact = true;
            this.contacts = response.result;
          }
        },
        error: (err) => {
          console.log(err);
        }
      })
    )
  }

  searchUser(): void {
    this.searchSubject.next(this.searchKey);
  }

  onSelectContact(contact: UserResponse): void {
    this.chatService.createChat(contact.id).subscribe({
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
      }
    })
  }

  chatClicked(chat: ChatResponse): void {
    this.chatSelected.emit(chat);
  }

  ngOnDestroy() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
