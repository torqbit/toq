import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { PaymentManagemetService } from "@/services/payment/PaymentManagementService";
import { paymentAuth } from "@/types/payment";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const accessConfig = paymentAuth.parse(body);
    const paymentManager = new PaymentManagemetService();
    const result = await paymentManager.verifyConnection(
      accessConfig.gateway,
      accessConfig.apiKey,
      accessConfig.secretKey,
      accessConfig.config
    );
    return res.status(result.status).json(result);
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));
