import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { CategoryService } from '../../../../services/category.service';
import { CategoryResponse } from '../../../../dto/response/category-response.model';
import { Router } from '@angular/router';
import { TokenService } from '../../../../services/token.service';
import { ProductService } from '../../../../services/product.service';
import { ProductResponse } from '../../../../dto/response/product-response.model';
import { ProductRequest } from '../../../../dto/request/product-request.model';
import { ApiResponse } from '../../../../dto/response/api-response.model';

@Component({
  selector: 'app-seller',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule,
  ],
  templateUrl: './seller.component.html',
  styleUrl: './seller.component.scss'
})
export class SellerComponent {

  productForm!: FormGroup;
  categories: CategoryResponse[] = [];
  product: ProductResponse | null = null;

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

  selectedMainImage: File[] = [];
  previewMainImage: string | ArrayBuffer | null = null;
  isUploadingThumbnail: boolean = false;
  selectedSubImages: File[] = [];
  subImagePreviews: string[] = [];
  isUploadingGallery: boolean = false;

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
      price: ['', [Validators.required, Validators.min(1000), Validators.max(100000000)]],
      quantity: [0, [Validators.required, Validators.min(1)]],
      category: [Validators.required],
    });
  }

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        if(response.code === 1000 && response.result) {
          this.categories = response.result;
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onCreateProduct(): void {
    if(this.productForm.valid) {
      const productReq: ProductRequest = {
        name: this.productForm.get('name')?.value,
        description: this.productForm.get('description')?.value,
        price: Number.parseInt(this.productForm.get('price')?.value),
        quantity: Number.parseInt(this.productForm.get('quantity')?.value),
        category_id: Number.parseInt(this.productForm.get('category')?.value),
        seller_id: this.tokenService.getUserIdFromToken() ?? 0,
      }

      this.productService.createProduct(productReq).subscribe({
        next: (response) => {
          if(response.code === 1000 && response.result) {
            this.product = response.result;
          }
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  onMainImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedMainImage = [];
      this.selectedMainImage.push(input.files[0]);
      const reader = new FileReader();
      reader.onload = () => {
        this.previewMainImage = reader.result;
      };
      reader.readAsDataURL(this.selectedMainImage[0]);
    }
  }

  uploadMainImage(): void {
    if (!this.selectedMainImage) {
      return;
    }

    this.isUploadingThumbnail = true;
    const formData = new FormData();
    formData.append('files', this.selectedMainImage[0]);
    formData.append('thumbnail', 'true');
    
    if(this.product?.id != null && this.product.id > 0) {
      this.productService.uploadProductImages(this.product?.id, formData).subscribe({
        next: (reponse: ApiResponse<void>) => {
          if(reponse.code === 1000) {
            console.log("Upload thumbnail image success");
            this.isUploadingThumbnail = false;
          }
        },
        error: (err) => {
          console.log(err);
          this.isUploadingThumbnail = false;
        }
      })
    }
  }

  onSubImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if(input.files) {
      const files = Array.from(input.files);

      if(files.length > 5) {
        files.shift();
      }

      this.selectedSubImages = files;
      this.subImagePreviews = [];

      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          this.subImagePreviews.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  uploadSubImages(): void {
    if (this.selectedSubImages.length === 0) {
      return;
    }
    
    if(this.product?.id != null && this.product.id > 0) {
      this.isUploadingGallery = true;
      const formData = new FormData();
      formData.append('thumbnail', 'false')
      this.selectedSubImages.forEach(file => {
        formData.append('files', file);
      });
      this.productService.uploadProductImages(this.product.id, formData).subscribe({
        next: (response: ApiResponse<void>) => {
          if(response.code === 1000) {
            console.log("Upload gallery image success");
            this.isUploadingGallery = false;
          }
        },
        error: (err) => {
          console.log(err);
          this.isUploadingGallery = false;
        }
      })
    }
  }
}
