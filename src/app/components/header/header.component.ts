import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { 
  bootstrapPerson, 
  bootstrapCart, 
  bootstrapMenuApp,
  bootstrapPersonVcard, 
  bootstrapChevronCompactRight, 
  bootstrapChevronDown } from '@ng-icons/bootstrap-icons';
import { StickyNavigationDirective } from '../../directives/fix-navigation.directive';
import { CategoryService } from '../../services/category.service';
import { CategoryResponse } from '../../dto/response/category-response.model';
import { ApiResponse } from '../../dto/response/api-response.model';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../dto/response/user-response.model';
import { TokenService } from '../../services/token.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgIconComponent,
    StickyNavigationDirective,
    CommonModule,
    RouterModule
  ],
  viewProviders: [
    provideIcons({
      bootstrapPerson,
      bootstrapCart,
      bootstrapMenuApp,
      bootstrapPersonVcard,
      bootstrapChevronCompactRight,
      bootstrapChevronDown
    })],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  categories: CategoryResponse[] = [];
  userDetail?: UserResponse;

  constructor(
    private categoryService: CategoryService,
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo() {
    if(this.tokenService.getToken()) {
      this.userService.getUserDetail().subscribe({
        next: (response: ApiResponse<UserResponse>) => {
          if(response.code === 1000 && response.result) {
            this.userDetail = response.result;
          }
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (response: ApiResponse<CategoryResponse[]>) => {
        if(response.code === 1000 && response.result) {
          this.categories = response.result.map(category => ({
            ...category,
            sub_categories: category.sub_categories || [],
            isExpanded: false,
          }));
        }
      }
    })
  }

  toggleCategory(category: CategoryResponse): void {
    category.isExpanded = !category.isExpanded;
  }
}
