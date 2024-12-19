import { NextApiResponse, NextApiRequest } from "next";
import prisma from "@/lib/prisma";
import { addDays, generateDayAndYear } from "@/lib/utils";
import { $Enums } from "@prisma/client";
import { CashFreePaymentData, InvoiceData } from "@/types/payment";
import appConstant from "@/services/appConstant";
import { businessConfig } from "@/services/businessConfig";
import { BillingService } from "@/services/BillingService";
import os from "os";
import path from "path";
import { withMethods } from "@/lib/api-middlewares/with-method";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body;

  // 1. check if the body contains the order, else 200 "Order is missing"

  // 2. verify the webhook request. If verfied, then proceed to step 3, else "Unable to verify the webhook signature"

  // 3. Define the type using zod for the order type
  // 4. Extract the fields and check the current status of that order.
  // 5. if pending, then update with the webhook status
  // if success, then ignore the webhook status
  // if dropped, then ignore the webhook status
  // if failed, then ignore the webhook status

  // cashfreeService.handleWebhook(order: ZodOrder): Promise<CourseRegistration| undefined>
  // billingService.sendCourseInvoice(cr: CourseRegistration): Promise<boolean>

  if (body.data.order) {
    const currentTime = new Date();
    const orderDetail = await prisma.order.findUnique({
      where: {
        orderId: String(body.data.order.order_id),
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
        latestStatus: true,
      },
    });

    const latestCashfreeOrder = await prisma.cashfreeOrder.findFirst({
      where: {
        gatewayOrderId: String(body.data.order.order_id),
      },
      select: {
        id: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (orderDetail && latestCashfreeOrder) {
      if (body.data.payment.payment_status === $Enums.paymentStatus.SUCCESS) {
        const courseDetail = await prisma.course.findUnique({
          where: {
            courseId: Number(orderDetail.productId),
          },
          select: {
            expiryInDays: true,
            slug: true,
            name: true,
            thumbnail: true,
            coursePrice: true,
            courseId: true,
          },
        });
        const courseExpiryDate = courseDetail && addDays(Number(courseDetail.expiryInDays));

        let cashfreePaymentData: CashFreePaymentData = {
          gatewayStatus: body.data.payment.payment_status,
          paymentMethod: body.data.payment.payment_group,
          gatewayOrderId: body.data.order.order_id,
          paymentId: body.data.payment.cf_payment_id,
          currency: body.data.payment.payment_currency,
          message: body.data.payment.payment_message,
          bankReference: body.data.payment.bank_reference,
          paymentTime: body.data.payment.payment_time,
        };

        const [updateOrder, updateCashfreeOrder, courseRegistration] = await prisma.$transaction([
          prisma.order.update({
            where: {
              id: orderDetail.id,
            },
            data: {
              latestStatus: body.data.payment.payment_status,
              updatedAt: currentTime,
              currency: cashfreePaymentData.currency,
            },
          }),
          prisma.cashfreeOrder.update({
            where: {
              id: latestCashfreeOrder.id,
            },
            data: {
              ...cashfreePaymentData,
              paymentId: Number(cashfreePaymentData.paymentId),
              updatedAt: currentTime,
            },
          }),
          prisma.courseRegistration.create({
            data: {
              studentId: orderDetail.user.id,
              courseId: Number(orderDetail.productId),
              expireIn: courseExpiryDate,
              courseState: $Enums.CourseState.ENROLLED,
              courseType: $Enums.CourseType.PAID,
              orderId: orderDetail.id,
            },
            select: {
              registrationId: true,
            },
          }),
        ]);

        await prisma.order.update({
          where: {
            id: orderDetail.id,
          },
          data: {
            registrationId: courseRegistration.registrationId,
          },
        });

        const invoiceData = await prisma.invoice.create({
          data: {
            studentId: orderDetail.user.id,
            taxRate: appConstant.payment.taxRate,
            taxIncluded: true,
            paidDate: String(cashfreePaymentData.paymentTime),
            amountPaid: body.data.payment.payment_amount,
            orderId: String(cashfreePaymentData.gatewayOrderId),
            items: { courses: [Number(courseDetail?.courseId)] },
          },
        });

        const invoiceConfig: InvoiceData = {
          courseDetail: {
            courseId: Number(courseDetail?.courseId),
            courseName: String(courseDetail?.name),
            slug: String(courseDetail?.slug),
            validUpTo: generateDayAndYear(addDays(Number(courseDetail?.expiryInDays))),
            thumbnail: String(courseDetail?.thumbnail),
          },

          totalAmount: body.data.payment.payment_amount,
          currency: String(cashfreePaymentData.currency),
          businessInfo: {
            gstNumber: businessConfig.gstNumber,
            panNumber: businessConfig.panNumber,
            address: businessConfig.address,
            state: businessConfig.state,
            country: businessConfig.country,
            taxRate: Number(invoiceData.taxRate),
            taxIncluded: invoiceData.taxIncluded,
            platformName: appConstant.platformName,
          },
          stundentInfo: {
            name: String(orderDetail.user.name),
            email: String(orderDetail.user.email),
            phone: String(orderDetail.user.phone),
          },

          invoiceNumber: Number(invoiceData.id),
        };
        let homeDir = os.homedir();
        const savePath = path.join(
          homeDir,
          `${appConstant.homeDirName}/${appConstant.staticFileDirName}/${invoiceData.id}_invoice.pdf`
        );

        new BillingService().sendInvoice(invoiceConfig, savePath);

        return res.status(200).json({
          success: true,
          message: "Payment successful",
        });
      } else if (body.data.payment.payment_status === $Enums.cashfreePaymentStatus.USER_DROPPED) {
        await prisma.order.update({
          where: {
            id: orderDetail.id,
          },
          data: {
            latestStatus: $Enums.paymentStatus.PENDING,
            updatedAt: currentTime,
            currency: body.data.payment.payment_currency,
          },
        });

        await prisma.cashfreeOrder.update({
          where: {
            id: String(latestCashfreeOrder.id),
          },
          data: {
            gatewayStatus: body.data.payment.payment_status,
            message: body.data.payment.payment_message,
            updatedAt: currentTime,
          },
        });
        return res.status(200).json({ success: true, message: body.data.payment.payment_message });
      } else {
        await prisma.order.update({
          where: {
            id: orderDetail.id,
          },
          data: {
            latestStatus: $Enums.paymentStatus.PENDING,
            updatedAt: currentTime,
            currency: body.data.payment.payment_currency,
          },
        });

        await prisma.cashfreeOrder.update({
          where: {
            id: String(latestCashfreeOrder.id),
          },
          data: {
            gatewayStatus: body.data.payment.payment_status,
            message: body.data.payment.payment_message,
            updatedAt: currentTime,
            errorDetails: body.data.error_details || "",
          },
        });

        return res.status(200).json({ success: true, message: body.data.payment.payment_message });
      }
    }
  } else {
    return res.status(200).json({ success: true, message: "Order detail is missing" });
  }
};

export default withMethods(["POST"], handler);
