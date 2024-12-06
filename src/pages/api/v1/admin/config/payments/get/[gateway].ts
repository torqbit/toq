import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { PaymentManagemetService } from "@/services/payment/PaymentManagementService";
import { paymentGatewayName } from "@/types/payment";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const query = req.query;
    const pg = paymentGatewayName.parse(query);
    const paymentManager = new PaymentManagemetService();
    const result = await paymentManager.getGatewayConfig(pg.gateway);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withUserAuthorized(handler));
