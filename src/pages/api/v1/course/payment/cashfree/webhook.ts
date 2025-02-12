import { NextApiResponse, NextApiRequest } from "next";
import prisma from "@/lib/prisma";
import { gatewayProvider, orderStatus } from "@prisma/client";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { PaymentManagemetService } from "@/services/payment/PaymentManagementService";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body;

  // 1. check if the body contains the order, else 200 "Order is missing" -- done---

  // 2. verify the webhook request. If verfied, then proceed to step 3, else "Unable to verify the webhook signature" -- done ---

  // 3. Define the type using zod for the order type
  // 4. Extract the fields and check the current status of that order. -- done ---
  // 5. if pending, then update with the webhook status -- done ---
  // if success, then ignore the webhook status -- done ---
  // if dropped, then ignore the webhook status -- done ---
  // if failed, then ignore the webhook status -- done ---

  // cashfreeService.handleWebhook(order: ZodOrder): Promise<CourseRegistration| undefined>
  // billingService.sendCourseInvoice(cr: CourseRegistration): Promise<boolean>

  console.log(req.body, "webhook body info");

  if (body.data.order) {
    const signature = req.headers["cf-signature"];

    const webhookPayload = JSON.stringify(req.body);

    const pms = new PaymentManagemetService();
    const isWebhookVerified = await pms.handleWebhook(gatewayProvider.CASHFREE, String(signature), webhookPayload);
    if (!isWebhookVerified.success) {
      return res.status(200).json({ success: false, message: isWebhookVerified.message });
    }

    const currentTime = new Date();
    const orderDetail = await prisma.order.findUnique({
      where: {
        gatewayOrderId: String(body.data.order.order_id),
      },
      select: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
          },
        },
        productId: true,
        id: true,
        orderStatus: true,
      },
    });

    console.log(orderDetail, "latest order detail in webhook");
    if (orderDetail?.orderStatus == orderStatus.PENDING) {
      await prisma.order.update({
        where: {
          gatewayOrderId: String(body.data.order.order_id),
        },
        data: {
          orderStatus: body.data.payment.payment_status,
          paymentStatus: body.data.payment.payment_status,
        },
      });
    }
    return res.status(200).json({ success: true, message: body.data.payment.payment_message });
  } else {
    return res.status(200).json({ success: true, message: "Order detail is missing" });
  }
};

export default withMethods(["POST"], handler);
