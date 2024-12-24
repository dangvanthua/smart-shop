import { RoleResponse } from "./role-response.model";

export interface UserResponse {
    id: number;
    fullname: string;
    phone_number: string;
    email: string;
    password: string;
    created_at: string;
    updated_at: string;
    is_active: number;
    date_of_birth: string;
    avatar: string;
    role_responses: RoleResponse[];
}