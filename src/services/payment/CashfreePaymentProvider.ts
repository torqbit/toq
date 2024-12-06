import { Cashfree } from "cashfree-pg";
import prisma from "@/lib/prisma";
import { $Enums } from "@prisma/client";
import { PaymentApiResponse, CoursePaymentConfig, PaymentServiceProvider, UserConfig } from "@/types/payment";
import appConstant from "../appConstant";

export class CashfreePaymentProvider implements PaymentServiceProvider {
  name: string = String(process.env.GATEWAY_PROVIDER_NAME);
  clientId: string;
  secretId: string;
  apiVersion: string = "2023-08-01";

  constructor(clientId: string, secretId: string) {
    this.clientId = clientId;
    this.secretId = secretId;
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

  async processPendingPayment(orderId: string, userConfig: UserConfig, courseConfig: CoursePaymentConfig): Promise<PaymentApiResponse> {
    let currentTime = new Date();
    const orderDetail = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      select: {
        createdAt: true,
      },
    });
    const latestCashfreeOrder = await prisma.cashfreeOrder.findFirst({
      where: {
        orderId: orderId,
      },
      select: {
        createdAt: true,
        sessionExpiry: true,
        sessionId: true,
        gatewayOrderId: true,
        gatewayStatus: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (latestCashfreeOrder) {
      const cashfreeOrderDetail = await prisma.cashfreeOrder.create({
        data: {
          studentId: userConfig.studentId,
          amount: courseConfig.coursePrice,
          courseId: courseConfig.courseId,
          orderId: orderId,
          sessionExpiry: latestCashfreeOrder.sessionExpiry,
          sessionId: latestCashfreeOrder.sessionId,
        },
        select: {
          orderId: true,
          id: true,
          createdAt: true,
          sessionExpiry: true,
          sessionId: true,
        },
      });

      let orderCreatedTime = orderDetail?.createdAt.getTime();

      if (cashfreeOrderDetail && cashfreeOrderDetail.sessionExpiry && cashfreeOrderDetail.sessionExpiry.getTime() < currentTime.getTime()) {
        await prisma.order.update({
          where: {
            id: orderId,
          },
          data: {
            updatedAt: currentTime,
            latestStatus: $Enums.paymentStatus.FAILED,
          },
        });
        const order = await prisma.order.create({
          data: {
            studentId: userConfig.studentId,
            latestStatus: $Enums.paymentStatus.INITIATED,
            courseId: courseConfig.courseId,
            paymentGateway: $Enums.gatewayProvider.CASHFREE,
            amount: courseConfig.amount,
          },
        });

        const paymentData = await this.createOrder(order.id, userConfig, courseConfig);
        return paymentData;
      } else {
        await prisma.order.update({
          where: {
            id: orderId,
          },
          data: {
            latestStatus: $Enums.paymentStatus.PENDING,
          },
        });

        await prisma.cashfreeOrder.update({
          where: {
            id: cashfreeOrderDetail.id,
          },
          data: {
            gatewayOrderId: latestCashfreeOrder.gatewayOrderId,
            sessionId: latestCashfreeOrder.sessionId,
            sessionExpiry: latestCashfreeOrder.sessionExpiry,
            gatewayProvider: $Enums.gatewayProvider.CASHFREE,
            updatedAt: currentTime,
          },
        });

        return {
          success: true,
          message: "Redirecting to payment page",
          gatewayName: $Enums.gatewayProvider.CASHFREE,
          gatewayResponse: {
            sessionId: String(cashfreeOrderDetail?.sessionId),
          },
        };
      }
    } else {
      return {
        success: false,
        error: `Something went wrong, contact the support team.`,
      };
    }
  }

  async createOrder(orderId: string, userConfig: UserConfig, courseConfig: CoursePaymentConfig): Promise<PaymentApiResponse> {
    try {
      const cashfreeOrderDetail = await prisma.cashfreeOrder.create({
        data: {
          studentId: userConfig.studentId,
          amount: courseConfig.coursePrice,
          courseId: courseConfig.courseId,
          orderId: orderId,
        },
        select: {
          orderId: true,
          id: true,
        },
      });

      let currentTime = new Date();
      const sessionExpiry = new Date(currentTime.getTime() + appConstant.payment.sessionExpiryDuration);

      Cashfree.XClientId = this.clientId;
      Cashfree.XClientSecret = this.secretId;
      Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;
      const date = new Date();
      let request = {
        order_amount: courseConfig.amount,
        order_currency: "INR",

        customer_details: {
          customer_id: userConfig.studentId,
          customer_name: userConfig.studentName,
          customer_email: userConfig.email,
          customer_phone: userConfig.phone,
        },
        order_meta: {
          return_url: `${process.env.NEXTAUTH_URL}/courses/${courseConfig.courseId}?callback=payment`,
          notify_url: `${process.env.NEXTAUTH_URL}/api/v1/course/payment/cashfree/webhook`,
          payment_methods: "upi, nb, cc, dc,app",
        },
        order_note: "",
        order_expiry_time: sessionExpiry.toISOString(),
      };

      const paymentData = await Cashfree.PGCreateOrder(appConstant.payment.version, request)
        .then(async (response: any) => {
          let a = response.data;

          await prisma.order.update({
            where: {
              id: orderId,
            },
            data: {
              orderId: a.order_id,
              latestStatus: $Enums.paymentStatus.PENDING,
            },
          });

          await prisma.cashfreeOrder.update({
            where: {
              id: cashfreeOrderDetail.id,
            },
            data: {
              gatewayOrderId: a.order_id,
              sessionId: a.payment_session_id,
              sessionExpiry: sessionExpiry,
              gatewayProvider: $Enums.gatewayProvider.CASHFREE,
              updatedAt: date,
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
          const orderDetail = await prisma.order.update({
            where: {
              id: orderId,
            },
            data: {
              latestStatus: $Enums.paymentStatus.FAILED,
              updatedAt: date,
            },
            select: {
              id: true,
            },
          });

          const latestCashfreeOrder = await prisma.cashfreeOrder.findFirst({
            where: {
              orderId: orderDetail.id,
            },
            select: {
              id: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          });

          if (latestCashfreeOrder) {
            await prisma.cashfreeOrder.update({
              where: {
                id: latestCashfreeOrder.id,
              },
              data: {
                gatewayStatus: $Enums.cashfreePaymentStatus.FAILED,

                updatedAt: date,
                message: error.response.data.message,
              },
            });
          }

          return { success: false, error: error.response.data.message };
        });
      return paymentData as PaymentApiResponse;
    } catch (error) {
      return { success: false, error: "error" };
    }
  }

  async purchaseCourse(courseConfig: CoursePaymentConfig, userConfig: UserConfig, orderId: string): Promise<PaymentApiResponse> {
    let currentTime = new Date();
    const orderDetail = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      select: {
        latestStatus: true,
      },
    });

    if (orderDetail?.latestStatus === $Enums.paymentStatus.PENDING) {
      let latestCashfreeOrder = await prisma.cashfreeOrder.findFirst({
        where: {
          orderId: orderId,
        },
        select: {
          gatewayStatus: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (
        Number(latestCashfreeOrder?.createdAt) + appConstant.payment.lockoutMinutes > currentTime.getTime() &&
        latestCashfreeOrder &&
        latestCashfreeOrder.gatewayStatus !== $Enums.cashfreePaymentStatus.FAILED &&
        latestCashfreeOrder.gatewayStatus !== $Enums.cashfreePaymentStatus.USER_DROPPED
      ) {
        return {
          success: false,
          error: `Your payment session is still active .`,
        };
      }
      const paymentResponse = await this.processPendingPayment(orderId, userConfig, courseConfig);
      return paymentResponse;
    } else {
      const response = await this.createOrder(orderId, userConfig, courseConfig);
      return response;
    }
  }
}
