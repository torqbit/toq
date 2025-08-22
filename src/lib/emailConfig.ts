import { PageSiteConfig } from "@/services/siteConstant";
import { IEmailCredentials } from "@/types/cms/email";

export interface IWelcomeEmailConfig {
  name: string;
  url: string;
  email: string;
  site: PageSiteConfig;
}
export interface IEmailVerificationConfig {
  url: string;
  email: string;
  mode: "login" | "signup";
  site: PageSiteConfig;
}

export interface IWelcomeTenantConfig {
  name: string;
  brandName: string;
  tenantOwnerEmail: string;
  url: string;
}
export interface ISendSubscriptionExpireNotify {
  toEmail: string;
  name: string;
  site: PageSiteConfig;
  url: string;
  expirationDate: string;
  daysRemaining?: number;
}

export interface ISubscriptionEmailConfig {
  name: string;
  tenantOwnerEmail: string;
  billPeriod: string;
  pdfPath: string;
}

export interface ISupportMail {
  name: string;
  url: string;
  tenantOwnerEmail: string;
  title: string;
  brandName: string;
  brandColor: string;
  brandIcon: string;
}

export interface IFeedBackConfig {
  feedback: string;
  site: PageSiteConfig;

  name: string;
  email: string;
}
export interface ITestEmailConfig {
  name: string;
  email: string;
  site: PageSiteConfig;

  credendials: IEmailCredentials;
}
export interface IEmailResponse {
  success: boolean;

  message?: string;
  error?: string;
}
