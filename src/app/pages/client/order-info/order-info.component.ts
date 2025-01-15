import { Component } from '@angular/core';
import {Chart, registerables} from 'chart.js';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapFileBarGraph, bootstrapFilter } from '@ng-icons/bootstrap-icons';
import { OrderService } from '../../../services/order.service';
import { ApiResponse } from '../../../dto/response/api-response.model';
import { OrderHistoryResponse } from '../../../dto/response/order-history-response.model';
import { EnumTranslatePipe } from '../../../directives/enum-translate.directive';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderResponse } from '../../../dto/response/order-response.model';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OrderFilterRequest } from '../../../dto/request/order-filter-request.model';

Chart.register(...registerables);
@Component({
  selector: 'app-order-info',
  standalone: true,
  imports: [
    HeaderComponent, 
    FooterComponent, 
    CommonModule,
    ReactiveFormsModule,
    NgIconComponent,
    EnumTranslatePipe
  ],
   viewProviders: [
    provideIcons({
      bootstrapFilter, 
      bootstrapFileBarGraph
    })],
  templateUrl: './order-info.component.html',
  styleUrl: './order-info.component.scss'
})
export class OrderInfoComponent {

  orders?: OrderHistoryResponse;
  page: number = 0;
  size: number = 5;
  totalPages: number = 0;
  totalElement: number = 0;
  formFilter: FormGroup;

  constructor(
    private orderService: OrderService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.formFilter = this.fb.group({
      status: [''],
      reference: ['']
    });
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {

    const filters = this.formFilter.value;

    const orderFilterRequest: OrderFilterRequest = {
      status: filters.status || '',
      reference: filters.reference || ''
    };

    this.orderService.getOrderHistory(this.page, this.size, orderFilterRequest).subscribe({
      next: (response: ApiResponse<OrderHistoryResponse>) => {
        if(response.code === 1000 && response.result) {
          this.orders = response.result;
          this.totalPages = response.result.total_pages;
          this.totalElement = response.result.total_elements;
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  filterOrder() {
    this.page = 0;
    this.loadOrders();
  }

  changePage(newPage: number): void {
    if(newPage >=0 && newPage < this.totalPages) {
      this.page = newPage;
      this.loadOrders();
    }
  }

  getPages(): number[]{
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i);
  }

  openDetailModal(order: OrderResponse) {
    const modalRef = this.modalService.open(OrderDetailComponent, {size: 'lg', animation: true});
    modalRef.componentInstance.order = order;
  }
}
