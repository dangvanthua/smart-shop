export interface SellerInfoResponse {
    store_name: string;
    email: string;
    phone_number: string;
    image_url: string;
    is_verified: boolean;
    total_products_sold: number;
    total_reviews: number;
    registration_date: string | null;
  }