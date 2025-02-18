import appConstant from "@/services/appConstant";
import { PaymentManagemetService } from "@/services/payment/PaymentManagementService";
import { ConfigurationState, gatewayProvider } from "@prisma/client";

export const getCurrency = async (provider: gatewayProvider): Promise<string> => {
  const paymentManager = new PaymentManagemetService();
  const result = await paymentManager.getGatewayConfig(provider);
  if (result.body.config && result.body.state == ConfigurationState.PAYMENT_CONFIGURED) {
    return result.body.config.currency;
  } else {
    return appConstant.currency;
  }
};
