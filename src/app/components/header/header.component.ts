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
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProductResponse } from '../../dto/response/product-response.model';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgIconComponent,
    StickyNavigationDirective,
    ClickOutsideDirective,
    CommonModule,
    RouterModule,
    ReactiveFormsModule
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
  searchControl = new FormControl();
  filteredProducts: ProductResponse[] = [];
  categories: CategoryResponse[] = [];
  userDetail?: UserResponse;
  showList: boolean = false;

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private userService: UserService,
    private tokenService: TokenService,
    private productService: ProductService,
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((keyword) => this.productService.searchProductByKeyword(keyword))
    )
    .subscribe((results) => {
      if(results.code === 1000 && results.result) {
        this.filteredProducts = results.result;
      }
    })
  }

  onSearch() {
    const keyword = this.searchControl.value;
    this.productService.searchProductByKeyword(keyword).subscribe((results) => {
      if(results.code === 1000 && results.result) {
        this.filteredProducts = results.result;
      }
    });
  }

  showProductList() {
    this.showList = true;
  }

  hideProductList() {
    this.showList = false;
  }


  goToProductDetail(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  loadUserInfo() {
    if(this.tokenService.isLoggedIn()) {
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

  logOut() {
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }
}
