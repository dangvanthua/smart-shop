import { Component } from '@angular/core';

@Component({
  selector: 'app-payment-cancel',
  standalone: true,
  imports: [],
  templateUrl: './payment-cancel.component.html',
  styleUrl: './payment-cancel.component.scss'
})
export class PaymentCancelComponent {
  constructor() { }

  ngOnInit(): void {
    console.log('Thanh toán đã bị hủy.');
  }
}
