import { Component } from '@angular/core';
import { ChatUserComponent } from "./chat-user/chat-user.component";

@Component({
  selector: 'app-chater-list',
  standalone: true,
  imports: [ChatUserComponent],
  templateUrl: './chater-list.component.html',
  styleUrl: './chater-list.component.scss'
})
export class ChaterListComponent {

}
