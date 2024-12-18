export interface CategoryResponse {
    id: number;
    name: string;
    sub_categories: CategoryResponse[];
    createdAt: string;
    isExpanded: boolean;
  }