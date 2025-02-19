import { Cashfree, OrderEntity } from "cashfree-pg";
import prisma from "@/lib/prisma";
import { $Enums, CourseRegistration, gatewayProvider, orderStatus, paymentStatus } from "@prisma/client";
import {
  PaymentApiResponse,
  CoursePaymentConfig,
  PaymentServiceProvider,
  UserConfig,
  OrderDetailStatus,
  paymentCustomerDetail,
  ISuccessPaymentData,
} from "@/types/payment";
import appConstant from "../appConstant";
import { APIResponse } from "@/types/apis";
import { getCurrency } from "@/actions/getCurrency";
import { PaymentManagemetService } from "./PaymentManagementService";
import { convertArrayToString } from "@/lib/utils";

export class CashfreePaymentProvider implements PaymentServiceProvider {
  name: string = String(gatewayProvider.CASHFREE);
  clientId: string;
  secretId: string;
  apiVersion: string = "2023-08-01";

  constructor(clientId: string, secretId: string) {
    this.clientId = clientId;
    this.secretId = secretId;
  }

  async verifyWebhook(signature: string, payload: string): Promise<boolean> {
    Cashfree.XClientId = this.clientId;
    Cashfree.XClientSecret = this.secretId;
    const isValidSignature = Cashfree.PGVerifyWebhookSignature(signature, payload, this.secretId);
    console.log(isValidSignature, "checking webhook validation in cashfree service");
    return isValidSignature ? true : false;
  }

  async updateOrder(
    orderId: string,
    gatewayOrderId: string,
    onSuccess: (
      productId: number,
      customerDetail: paymentCustomerDetail,
      orderId: string,
      paymentData: ISuccessPaymentData
    ) => Promise<APIResponse<CourseRegistration | undefined>>
  ): Promise<APIResponse<paymentStatus>> {
    if (orderId && gatewayOrderId) {
      Cashfree.XClientId = this.clientId;
      Cashfree.XClientSecret = this.secretId;
      const detail = await Cashfree.PGOrderFetchPayments(this.apiVersion, gatewayOrderId);
      if (detail.data.length > 0) {
        let currentTime = new Date();
        const paymentDetail = detail.data[0];

        const updatedOrder = await prisma.order.update({
          select: {
            studentId: true,
            user: true,
            productId: true,
          },
          where: {
            id: orderId,
          },
          data: {
            orderStatus:
              paymentDetail.payment_status === orderStatus.SUCCESS ? orderStatus.SUCCESS : orderStatus.PENDING,
            updatedAt: currentTime,
            currency: paymentDetail.payment_currency,
            paymentStatus: paymentDetail.payment_status as paymentStatus,
            paymentId: paymentDetail.cf_payment_id,
            paymentTime: paymentDetail.payment_time,
            message: paymentDetail.payment_message,
          },
        });

        if (paymentDetail.payment_status === paymentStatus.SUCCESS) {
          let customerDetail: paymentCustomerDetail = {
            id: updatedOrder.studentId,
            name: String(updatedOrder.user.name),
            email: String(updatedOrder.user.email),
            phone: String(updatedOrder.user.phone),
          };

          let successPaymentData: ISuccessPaymentData = paymentDetail && {
            amount: Number(paymentDetail.payment_amount),
            currency: String(paymentDetail.payment_currency),
            paymentTime: String(paymentDetail.payment_time),
            gatewayOrderId: gatewayOrderId,
          };
          const response = await onSuccess(updatedOrder.productId, customerDetail, orderId, successPaymentData);
          return new APIResponse(response.success, response.status, response.message);
        }

        return new APIResponse(true, 200, "Order has been updated", paymentDetail.payment_status as paymentStatus);
      } else {
        return new APIResponse(false, 404, "Payment detail is missing");
      }
    } else {
      return new APIResponse(false, 404, "Gateway order id  is missing");
    }
  }

  async testClientCredentials(): Promise<number> {
    Cashfree.XClientId = this.clientId;
    Cashfree.XClientSecret = this.secretId;
    try {
      const response = await Cashfree.PGFetchOrder(this.apiVersion, "test-123");
      return response.status;
    } catch (error) {
      return (error as any).response.status;
    }
  }

  async getPaymentDetail(orderId: string): Promise<APIResponse<OrderEntity>> {
    Cashfree.XClientId = this.clientId;
    Cashfree.XClientSecret = this.secretId;
    try {
      const response = await Cashfree.PGFetchOrder(this.apiVersion, orderId);
      return new APIResponse(
        response.status === 200,
        response.status,
        response.status === 200 ? "fetched order detail" : "order detail is missing",
        response.data
      );
    } catch (error) {
      return (error as any).response.status;
    }
  }

  async processPendingPayment(
    orderId: string,
    userConfig: UserConfig,
    courseConfig: CoursePaymentConfig
  ): Promise<APIResponse<PaymentApiResponse>> {
    let currentTime = new Date();
    const orderDetail = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      select: {
        updatedAt: true,
        gatewayOrderId: true,
      },
    });

    const latestOrderDetail = orderDetail?.gatewayOrderId && (await this.getPaymentDetail(orderDetail?.gatewayOrderId));

    if (latestOrderDetail && latestOrderDetail.body) {
      if (
        latestOrderDetail.body.order_status &&
        latestOrderDetail.body.order_status === OrderDetailStatus.EXPIRED //expired
      ) {
        await prisma.order.update({
          where: {
            id: orderId,
          },
          data: {
            updatedAt: currentTime,
            orderStatus: orderStatus.FAILED,
          },
        });
        const order = await prisma.order.create({
          data: {
            studentId: userConfig.studentId,
            orderStatus: orderStatus.INITIATED,
            productId: courseConfig.courseId,
            paymentGateway: $Enums.gatewayProvider.CASHFREE,
            amount: courseConfig.amount,
          },
        });

        const paymentData = await this.createOrder(order.id, userConfig, courseConfig);
        return new APIResponse(true, 200, "Order has been created", paymentData);
      } else {
        await prisma.order.update({
          where: {
            id: orderId,
          },
          data: {
            orderStatus: orderStatus.PENDING,
          },
        });

        return new APIResponse(true, 200, "Redirecting to payment page", {
          gatewayName: $Enums.gatewayProvider.CASHFREE,
          gatewayResponse: {
            sessionId: String(latestOrderDetail?.body.payment_session_id),
          },
        });
      }
    } else {
      return new APIResponse(false, 404, "Order detail is missing");
    }
  }

  async createOrder(
    orderId: string,
    userConfig: UserConfig,
    courseConfig: CoursePaymentConfig
  ): Promise<APIResponse<PaymentApiResponse>> {
    try {
      let liveMode = false;
      let paymentMethods = appConstant.payment.cashfree.paymentMethods;
      const paymentManager = new PaymentManagemetService();
      const result = await paymentManager.getGatewayConfig(gatewayProvider.CASHFREE);
      if (result.body && result.body.config) {
        liveMode = result.body.config.liveMode;
        paymentMethods =
          result.body.config.paymentMethods.length > 0
            ? convertArrayToString(result.body.config.paymentMethods)
            : paymentMethods;
      }

      let currentTime = new Date();
      const sessionExpiry = new Date(currentTime.getTime() + appConstant.payment.sessionExpiryDuration);
      Cashfree.XClientId = this.clientId;
      Cashfree.XClientSecret = this.secretId;
      Cashfree.XEnvironment = liveMode ? Cashfree.Environment.PRODUCTION : Cashfree.Environment.SANDBOX;
      const date = new Date();
      let request = {
        order_amount: courseConfig.amount,
        order_currency: await getCurrency(gatewayProvider.CASHFREE),

        customer_details: {
          customer_id: userConfig.studentId,
          customer_name: userConfig.studentName,
          customer_email: userConfig.email,
          customer_phone: userConfig.phone,
        },
        order_meta: {
          return_url: `${process.env.NEXTAUTH_URL}/courses/${courseConfig.slug}?callback=payment&order_id=${orderId}`,
          notify_url: `${process.env.NEXTAUTH_URL}/api/v1/course/payment/cashfree/webhook`,
          payment_methods: paymentMethods,
        },
        order_note: "",
        order_expiry_time: sessionExpiry.toISOString(),
      };

      const paymentData = await Cashfree.PGCreateOrder(this.apiVersion, request)
        .then(async (response) => {
          let a = response.data;
          await prisma.order.update({
            where: {
              id: orderId,
            },
            data: {
              gatewayOrderId: a.order_id,
              orderStatus: orderStatus.PENDING,
            },
          });

          return {
            success: true,
            message: "Payment Successfull",
            gatewayName: this.name,
            gatewayResponse: {
              sessionId: a.payment_session_id,
            },
          } as PaymentApiResponse;
        })
        .catch(async (error: any) => {
          await prisma.order.update({
            where: {
              id: orderId,
            },
            data: {
              orderStatus: orderStatus.FAILED,
              paymentStatus: paymentStatus.FAILED,
              updatedAt: date,
              message: error.response.data.message,
            },
            select: {
              id: true,
            },
          });

          return { success: false, message: error.response.data.message };
        });
      return new APIResponse(
        paymentData.success ? paymentData.success : false,
        paymentData.success ? 200 : 400,
        paymentData.message,
        paymentData
      );
    } catch (error: any) {
      return new APIResponse(false, 500, error);
    }
  }

  async purchaseCourse(
    courseConfig: CoursePaymentConfig,
    userConfig: UserConfig,
    orderId: string
  ): Promise<APIResponse<PaymentApiResponse>> {
    let currentTime = new Date();
    const orderDetail = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      select: {
        orderStatus: true,
        paymentStatus: true,
        updatedAt: true,
      },
    });

    if (orderDetail && orderDetail?.orderStatus === orderStatus.PENDING) {
      if (
        new Date(orderDetail.updatedAt).getTime() + appConstant.payment.lockoutMinutes > currentTime.getTime() &&
        orderDetail.paymentStatus !== paymentStatus.FAILED &&
        orderDetail.paymentStatus !== paymentStatus.USER_DROPPED
      ) {
        return new APIResponse(false, 102, "Your payment session is still active.");
      }
      const paymentResponse = await this.processPendingPayment(orderId, userConfig, courseConfig);
      return new APIResponse(
        paymentResponse.success,
        paymentResponse.status,
        paymentResponse.message,
        paymentResponse.body
      );
    } else {
      const response = await this.createOrder(orderId, userConfig, courseConfig);
      return new APIResponse(response.success, response.status, response.message, response.body);
    }
  }
}
