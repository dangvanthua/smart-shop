import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { OrderService } from '../../../../services/order.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent {
  selectedOrder: any; 

  constructor(private orderService: OrderService) {}
}
