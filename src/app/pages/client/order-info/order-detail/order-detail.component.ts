import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { OrderService } from '../../../../services/order.service';
import {NgbActiveModal, NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { OrderResponse } from '../../../../dto/response/order-response.model';
import { OrderDetailResponse } from '../../../../dto/response/order-detail-response.model';
import { EnumTranslatePipe } from '../../../../directives/enum-translate.directive';
import { OrderDetailService } from '../../../../services/order-detail.service';
import { ApiResponse } from '../../../../dto/response/api-response.model';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapClipboard, bootstrapClipboard2DataFill, bootstrapDashLg, bootstrapGripVertical } from '@ng-icons/bootstrap-icons';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule, 
    CurrencyPipe,
    NgbModule,
    EnumTranslatePipe,
    NgIconComponent
  ],
  viewProviders: [provideIcons({
    bootstrapClipboard, 
    bootstrapClipboard2DataFill,
    bootstrapDashLg,
    bootstrapGripVertical
  })],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent {
  @Input() order?: OrderResponse;

  orderDetails: OrderDetailResponse[] = [];
  totalQuantity: number = 0;
  totalPrice: number = 0;
  timeDifference?: string;

  constructor(
    public activeModal: NgbActiveModal,
    private orderDetailService: OrderDetailService
  ) {
    dayjs.extend(relativeTime);
    dayjs.locale('vi');
  }

  ngOnInit(): void {
    if(this.order?.id) {
      const orderId = this.order.id;
      if(orderId) {
        this.loadOrderDetails(orderId);
        this.calculateTimeDifference();
      }
    }
  }

  loadOrderDetails(orderId: number): void {
    this.orderDetailService.getOrderDetails(orderId).subscribe({
      next: (response: ApiResponse<OrderDetailResponse[]>) => {
        if(response.code === 1000 && response.result) {
          this.orderDetails = response.result;
          
          // tinh tong so luong san pham, gia
          this.orderDetails.forEach((orderDetail: OrderDetailResponse) => {
            this.totalPrice += orderDetail.total_money;
            this.totalQuantity += orderDetail.number_of_products;
          })
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  calculateTimeDifference() {
    if (this.order?.order_date) {
      const orderDate = dayjs(this.order.order_date); 
      this.timeDifference = orderDate.fromNow(); 
    }
  }
}
