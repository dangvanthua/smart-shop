import { ProductAttributeResponse } from "./product-attr.model";

export interface ProductVariantResponse {
    id: number;
    sku: string;
    price: number;
    stock_quantity: number;
    attributes: ProductAttributeResponse[];
  }