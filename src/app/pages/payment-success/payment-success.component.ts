import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { VerifyPaymentRequest } from '../../dto/request/payment-request.model';
import { ApiResponse } from '../../dto/response/api-response.model';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.scss'
})
export class PaymentSuccessComponent {
  paymentDetails: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService) { }

  ngOnInit(): void {
    // Lấy thông tin từ URL khi thanh toán thành công
    this.route.queryParams.subscribe(params => {
      const paymentId = params['paymentId'];
      const token = params['token'];
      const payerId = params['PayerID'];

      // Xử lý dữ liệu hoặc gọi API xác nhận thanh toán
      if (paymentId && token && payerId) {
        this.verifyPayment(paymentId, payerId);
      } else {
        // Nếu thiếu thông tin cần thiết, thông báo lỗi
        console.error('Thông tin thanh toán không đầy đủ.');
      }
    });
  }

  verifyPayment(paymentId: string, payerId: string): void {
    // Gọi API để xác nhận thanh toán từ PayPal (hoặc backend)
    const verifyReq: VerifyPaymentRequest = {
      payment_id: paymentId,
      payer_id: payerId
    }
    this.paymentService.executePayment(verifyReq).subscribe({
      next: (response: ApiResponse<Map<string, any>>) => {
        if(response.code === 1000) {
          console.log("Thanh cong")
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
    // Sau khi xác nhận thành công, có thể hiển thị thông báo thành công

    console.log('Đang xác nhận thanh toán', paymentId, payerId);
  }

  goToHome() {
    this.router.navigate(["/"]);
  }

  viewOrder() {

  }
}
