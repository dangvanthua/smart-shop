import { Component } from '@angular/core';
import { HeaderComponent } from "../../../components/header/header.component";
import { FooterComponent } from "../../../components/footer/footer.component";
import {Chart, registerables} from 'chart.js';
import { CommonModule } from '@angular/common';

Chart.register(...registerables);
@Component({
  selector: 'app-order-info',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './order-info.component.html',
  styleUrl: './order-info.component.scss'
})
export class OrderInfoComponent {
  public orders = [
    {
      id: 42,
      date: '2022-11-03 09:26',
      deliveryDate: '2022-11-18',
      total: 210.5,
      quantity: 11,
      lastUpdate: '2022-12-13 07:16',
      status: 'SUBMITTED'
    },
    {
      id: 36,
      date: '2022-11-01 12:51',
      deliveryDate: '2022-12-10',
      total: 65.0,
      quantity: 5,
      lastUpdate: '2022-11-02 07:33',
      status: 'INVOICED'
    },
    // Add more orders as needed
  ];
}
