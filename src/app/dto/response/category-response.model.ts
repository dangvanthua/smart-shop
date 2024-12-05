export interface CategoryResponse {
    id: number;
    name: string;
    subCategories: CategoryResponse[];
    createdAt: string;
  }