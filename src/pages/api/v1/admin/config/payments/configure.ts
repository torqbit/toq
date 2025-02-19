import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { PaymentManagemetService } from "@/services/payment/PaymentManagementService";
import { GatewayConfig, paymentAuth, paymentInfo } from "@/types/payment";
import { ConfigurationState } from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const paymentConfig = paymentInfo.parse(body);
    const paymentManager = new PaymentManagemetService();
    const gatewayConfig: GatewayConfig = {
      name: paymentConfig.gateway,
      paymentConfig: {
        paymentMethods: paymentConfig.paymentMethods,
        currency: paymentConfig.currency,
        liveMode: paymentConfig.liveMode,
      },
    };
    const result = await paymentManager.saveConfig(gatewayConfig, ConfigurationState.PAYMENT_CONFIGURED);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));
