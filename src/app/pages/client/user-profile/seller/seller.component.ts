import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { CategoryService } from '../../../../services/category.service';
import { CategoryResponse } from '../../../../dto/response/category-response.model';
import { Router } from '@angular/router';
import { TokenService } from '../../../../services/token.service';
import { ProductService } from '../../../../services/product.service';

@Component({
  selector: 'app-seller',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule
  ],
  templateUrl: './seller.component.html',
  styleUrl: './seller.component.scss'
})
export class SellerComponent {

  productForm!: FormGroup;
  categories: CategoryResponse[] = [];

  editorConfig: AngularEditorConfig = {
    editable: true,
    sanitize: false,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Nhập mô tả sản phẩm...',
    outline: false,
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['insertImage', 'insertVideo']
    ]
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private categoryService: CategoryService,
    private tokenService: TokenService,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
    });
  }

  onSubmit(): void {

  }
}
