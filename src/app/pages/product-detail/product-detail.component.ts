import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapCartPlus } from '@ng-icons/bootstrap-icons';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [NgIconComponent],
  viewProviders: [provideIcons({ bootstrapCartPlus })],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {

}
