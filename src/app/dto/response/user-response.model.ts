import { RoleResponse } from "./role-response.model";

export interface UserResponse {
    id: number;
    fullname: string;
    phoneNumber: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
    isActive: number;
    dateOfBirth: string;
    avatar: string;
    role: RoleResponse;
}