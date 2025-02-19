import { getFetch, postFetch } from "@/services/request";
import { APIResponse } from "@/types/apis";
import { CFPaymentsConfig, PaymentAuthConfig, PaymentInfoConfig } from "@/types/payment";
import { $Enums, ConfigurationState } from "@prisma/client";

class PaymentsClient {
  verifyPaymentGateway = (
    authConfig: PaymentAuthConfig,
    onSuccess: (response: APIResponse<any>) => void,
    onFailure: (err: string) => void
  ) => {
    postFetch(authConfig, `/api/v1/admin/config/payments/verify`)
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

  getPaymentGatewayConfig = (
    gateway: $Enums.gatewayProvider,
    onSuccess: (
      response: APIResponse<{
        state: ConfigurationState;
        config: { currency: string; paymentMethods: string[]; liveMode: boolean };
      }>
    ) => void,
    onFailure: (err: string) => void
  ) => {
    getFetch(`/api/v1/admin/config/payments/get/${gateway}`)
      .then(async (result) => {
        const response = (await result.json()) as APIResponse<{
          state: ConfigurationState;
          config: { currency: string; paymentMethods: string[]; liveMode: boolean };
        }>;
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

  savePaymentGatewayConfig = (
    config: PaymentInfoConfig,
    onSuccess: (response: APIResponse<any>) => void,
    onFailure: (err: string) => void
  ) => {
    postFetch(config, `/api/v1/admin/config/payments/configure`)
      .then(async (result) => {
        const response = (await result.json()) as APIResponse<any>;
        if (response.success) {
          onSuccess(response);
        } else {
          onFailure(response.error || `Unable to save the payment gateway configuration`);
        }
      })
      .catch((err) => {
        onFailure(err);
      });
  };
}

export default new PaymentsClient();
