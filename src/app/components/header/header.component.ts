import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapPerson, bootstrapCart, bootstrapMenuApp, bootstrapPersonVcard } from '@ng-icons/bootstrap-icons';
import { StickyNavigationDirective } from '../../directives/fix-navigation.directive';
import { CategoryService } from '../../services/category.service';
import { CategoryResponse } from '../../dto/response/category-response.model';
import { ApiResponse } from '../../dto/response/api-response.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgIconComponent,
    StickyNavigationDirective
  ],
  viewProviders: [
    provideIcons({
      bootstrapPerson,
      bootstrapCart,
      bootstrapMenuApp,
      bootstrapPersonVcard
    })],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  categories: CategoryResponse[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (response: ApiResponse<CategoryResponse[]>) => {
        if(response.code === 1000 && response.result) {
          this.categories = response.result;
        }
      }
    })
  }
}
