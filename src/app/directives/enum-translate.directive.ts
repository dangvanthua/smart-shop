import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "enumTranslate",
    standalone: true
})
export class EnumTranslatePipe implements PipeTransform {
    transform(value: any, enumType: string) {
        if(!value) return '';

        const translations: {[key: string] : {[key: string]: string}} = {
            OrderStatus: {
                PENDING: 'Đang chờ xử lý',
                PROCESSING: 'Đang xử lý',
                SHIPPED: 'Đã giao hàng',
                DELIVERED: 'Đã giao',
                CANCELLED: 'Đã hủy',
            },
            PaymentMethod: {
                cod: 'Thanh toán khi nhận hàng',
                credit_card: 'Thẻ tín dụng',
                e_wallet: 'Ví điện tử',
            },
            ShippingMethod: {
                standard: 'Tiêu chuẩn',
                express: 'Nhanh',
            },
        };

        return translations[enumType]?.[value] || value;
    }
}