import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { bootstrapSendFill } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [
    FormsModule,
    NgIconComponent
  ],
  viewProviders: provideIcons({bootstrapSendFill}),
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss'
})
export class ChatInputComponent {
  @Output() messageSent = new EventEmitter<string>();
  message: string = '';

  sendMessage(): void {
    if (this.message.trim()) {
      this.messageSent.emit(this.message);
      this.message = ''; 
    }
  }
}
