import { $Enums, CourseRegistration, Order, orderStatus, paymentStatus } from "@prisma/client";
import { z } from "zod";
import { APIResponse } from "./apis";

export interface CashFreeConfig extends GatewayConfig {
  clientId: string;
  secretId: string;
}

export interface UserConfig {
  studentId: string;
  email: string;
  phone: string;
  studentName: string;
}

export interface CoursePaymentConfig {
  courseId: number;
  slug: string;
  amount: number;
  coursePrice: number;
}

export interface GatewayResponse {
  sessionId: string;
}

export interface PaymentApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
  gatewayName?: string;
  status?: number;
  gatewayResponse?: GatewayResponse;
}

export interface PaymentServiceProvider {
  name: string;
  purchaseCourse(
    courseConfig: CoursePaymentConfig,
    userConfig: UserConfig,
    orderId: string
  ): Promise<APIResponse<PaymentApiResponse>>;
  updateOrder(
    orderId: string,
    gatewayOrderId: string,
    onSuccess: (
      productId: number,
      customerDetail: paymentCustomerDetail,
      orderId: string,
      paymentData: ISuccessPaymentData
    ) => Promise<APIResponse<CourseRegistration | undefined>>
  ): Promise<APIResponse<paymentStatus>>;
}
export enum OrderDetailStatus {
  ACTIVE = "ACTIVE",
  PAID = "PAID",
  EXPIRED = "EXPIRED",
}

export interface ISuccessPaymentData {
  amount: number;
  currency: string;
  paymentTime: string;
  gatewayOrderId: string;
}

export interface paymentCustomerDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface CashFreePaymentData {
  status?: orderStatus;
  paymentMethod?: string;
  gatewayOrderId?: string;
  paymentId?: string;
  currency?: string;
  message?: string;
  bankReference?: string;
  paymentTime?: string;
  gatewayStatus?: paymentStatus;
}

export interface OrderDetail extends Order {
  // gatewayOrder: CashfreeOrder[];
}

export interface latestOrderDetail {
  id: string;
  orderStatus: $Enums.orderStatus | null;
  updatedAt: Date;
  registeredCourse: {
    expireIn: Date | null;
  } | null;
}

export interface InvoiceData {
  courseDetail: {
    courseId: number;
    slug: string;
    courseName: string;
    validUpTo: string;
    thumbnail: string;
  };
  businessInfo: {
    gstNumber: string;
    panNumber: string;
    address: string;
    state: string;
    country: string;
    taxRate: number;
    taxIncluded: boolean;
    platformName: string;
  };
  stundentInfo: {
    name: string;
    phone: string;
    email: string;
  };

  totalAmount: number;
  currency: string;

  invoiceNumber: number;
}

export interface OrderHistory {
  status: string;
  paymentDate: Date;
  amount: number;
  courseName: string;
  invoiceId: number;
  currency: string;
}

export const paymentGatewayName = z.object({
  gateway: z.string().min(2, "Payment gateway name is required"),
});

export const paymentAuth = z.object({
  apiKey: z.string().min(2, "Access key is required"),
  secretKey: z.string().min(2, "Secret key is required"),
  gateway: z.string().min(2, "Payment gateway is required"),
  config: z.object({
    paymentConfig: z.object({
      currency: z.string(),
      paymentMethods: z.array(z.string()),
      liveMode: z.boolean(),
    }),
    name: z.string().min(2, "Payment gateway is required"),
  }),
});

export type PaymentAuthConfig = z.infer<typeof paymentAuth>;

export const paymentInfo = z.object({
  currency: z.string().min(2, "Choose the currency"),
  paymentMethods: z.array(z.string()).min(1, "Atleast one payment method must be specified"),
  liveMode: z.boolean(),

  gateway: z.string().min(2, "Payment gateway is required"),
});

export type PaymentInfoConfig = z.infer<typeof paymentInfo>;

export interface GatewayConfig {
  name: string;
  paymentConfig?: {
    currency: string;
    paymentMethods: string[];
    liveMode: boolean;
  };
}

export interface CFPaymentsConfig extends GatewayConfig {
  name: string;
  auth: {
    clientId: string;
    secretId: string;
  };
}
