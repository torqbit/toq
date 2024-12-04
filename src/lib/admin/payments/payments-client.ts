import { postFetch } from "@/services/request";
import { APIResponse } from "@/types/apis";
import { PaymentAuthConfig } from "@/types/payment";

class PaymentsClient {
  verifyPaymentGateway = (
    authConfig: PaymentAuthConfig,
    onSuccess: (response: APIResponse<any>) => void,
    onFailure: (err: string) => void
  ) => {
    postFetch(authConfig, `/api/v1/admin/config/payments/configure`)
      .then(async (result) => {
        const response = (await result.json()) as APIResponse<any>;
        if (response.success) {
          onSuccess(response);
        } else {
          onFailure(response.error || `Unable to verify the payment gateway credentials`);
        }
      })
      .catch((err) => {
        onFailure(err);
      });
  };
}

export default new PaymentsClient();
