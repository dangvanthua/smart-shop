import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-area',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-area.component.html',
  styleUrl: './chat-area.component.scss'
})
export class ChatAreaComponent {
  messages: { content: string; isSent: boolean; time: string }[] = [];

  ngOnInit(): void {
    // Giả lập dữ liệu tin nhắn
    this.messages = [
      { content: 'Hello! How can I help you?', isSent: false, time: '10:00 AM' },
      { content: 'I have a question about my order.', isSent: true, time: '10:02 AM' },
      { content: 'Sure, what’s your order ID?', isSent: false, time: '10:03 AM' },
      { content: 'It’s #12345.', isSent: true, time: '10:05 AM' },
      { content: 'Sure, what’s your order ID?', isSent: false, time: '10:03 AM' },
      { content: 'It’s #12345.', isSent: true, time: '10:05 AM' },
      { content: 'Sure, what’s your order ID?', isSent: false, time: '10:03 AM' },
      { content: 'It’s #12345.', isSent: true, time: '10:05 AM' },
      { content: 'Sure, what’s your order ID?', isSent: false, time: '10:03 AM' },
      { content: 'It’s #12345.', isSent: true, time: '10:05 AM' },
    ];
  }
}
