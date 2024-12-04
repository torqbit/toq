import { $Enums, Order, CashfreeOrder } from "@prisma/client";
import { z } from "zod";

export interface GatewayConfig {
  name: string;
}

export interface CFPaymentsConfig extends GatewayConfig {
  auth: {
    clientId: string;
    secretId: string;
  };
  payments?: {
    currencies: string[];
    methods: string[];
  };
}

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
  amount: number;
  coursePrice: number;
}

export interface GatewayResponse {
  sessionId: string;
}

export interface PaymentApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  gatewayName?: string;
  status?: number;
  gatewayResponse?: GatewayResponse;
}

export interface PaymentServiceProvider {
  name: string;
  purchaseCourse(courseConfig: CoursePaymentConfig, userConfig: UserConfig, orderId: string): Promise<PaymentApiResponse>;
}

export interface CashFreePaymentData {
  status?: $Enums.paymentStatus;
  paymentMethod?: string;
  gatewayOrderId?: string;
  paymentId?: number;
  currency?: string;
  message?: string;
  bankReference?: string;
  paymentTime?: string;
  gatewayStatus?: $Enums.cashfreePaymentStatus;
}

export interface OrderDetail extends Order {
  gatewayOrder: CashfreeOrder[];
}

export interface InvoiceData {
  courseDetail: {
    courseId: number;
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

export const paymentAuth = z.object({
  apiKey: z.string().min(2, "Access key is required"),
  secretKey: z.string().min(2, "Secret key is required"),
  gateway: z.string().min(2, "Payment gateway is required"),
});

export type PaymentAuthConfig = z.infer<typeof paymentAuth>;

export const paymentInfo = z.object({
  currency: z.string().min(2, "Access key is required"),
  paymentMethods: z.array(z.string()).min(1, "Atleast one payment method must be specified"),
});

export type PaymentInfoConfig = z.infer<typeof paymentInfo>;
