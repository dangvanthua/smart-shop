import { ProductImageResponse } from "./product-image.model";
import { ProductVariantResponse } from "./product-varriant.model";
import { SellerInfoResponse } from "./seller-response.model";

export interface ProductDetailResponse {
    id: number;
    name: string;
    description: string;
    price: number;
    stock_quantity: number;
    is_active: boolean;
    images: ProductImageResponse[];
    seller_info: SellerInfoResponse;
    product_variants: ProductVariantResponse[];
  }