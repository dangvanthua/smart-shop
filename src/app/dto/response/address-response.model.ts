export interface AddressResponse {
    id: number;
    address_line: string;
    city: string;
    ward: string;
    district: string;
    postal_code: string;
    country: string;
    is_default: boolean;
}