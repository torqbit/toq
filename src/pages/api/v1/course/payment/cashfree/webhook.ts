import { NextApiResponse, NextApiRequest } from "next";
import prisma from "@/lib/prisma";
import { addDays, generateDayAndYear } from "@/lib/utils";
import MailerService from "@/services/MailerService";
import { $Enums } from "@prisma/client";
import { CashFreePaymentData, InvoiceData } from "@/types/payment";
import appConstant from "@/services/appConstant";
import fs from "fs";
import { businessConfig } from "@/services/businessConfig";
import { ContentManagementService } from "@/services/cms/ContentManagementService";
import { BillingService } from "@/services/BillingService";
import os from "os";
import path from "path";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body;
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
      courseId: true,
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
          courseId: Number(orderDetail.courseId),
        },
        select: {
          expiryInDays: true,
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
            updatedAt: currentTime,
          },
        }),
        prisma.courseRegistration.create({
          data: {
            studentId: orderDetail.user.id,
            courseId: Number(orderDetail.courseId),
            expireIn: courseExpiryDate,
            courseState: $Enums.CourseState.ENROLLED,
            courseType: $Enums.CourseType.PAID,
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
      const cms = new ContentManagementService();

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
};

export default handler;
