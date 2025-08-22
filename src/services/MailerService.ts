import { IEmailEventType } from "@/lib/types/email";
import { render } from "@react-email/render";
import WelcomeEmailPage from "@/components/Email/WelcomeEmail";
import nodemailer, { Transporter } from "nodemailer";
import { Resend } from "resend";
import {
  IEmailResponse,
  IEmailVerificationConfig,
  IFeedBackConfig,
  ISendSubscriptionExpireNotify,
  ISubscriptionEmailConfig,
  ISupportMail,
  ITestEmailConfig,
  IWelcomeEmailConfig,
  IWelcomeTenantConfig,
} from "@/lib/emailConfig";

import TestEmailCredentialsEmail from "@/components/Email/TestEmailCredentialsEmail";

import { DEFAULT_THEME, PageSiteConfig } from "./siteConstant";
import { IPrivateCredentialInfo } from "@/types/mail";
import WelcomeTenantEmailPage from "@/components/Email/WelcomeTenantOwner";
import appConstant from "./appConstant";
import SubscriptionTenantEmailPage from "@/components/Email/SubscriptionEmail";
import SubscriptionExpireEmail from "@/components/Email/SubscriptionExpireNotify";
import EmailVerificationPage from "@/components/Email/EmailVerificationPage";
import TrialSubscriptionExpireEmail from "@/components/Email/TrialSubscriptionExpiryReminder";

export const getEmailErrorMessage = (response: string, message?: string) => {
  let errResponse;
  if (response === "CONN") {
    errResponse = "Connection failed";
  } else if (response === "AUTH PLAIN") {
    errResponse = " Authentication failed";
  } else if (response === "ECONNECTION") {
    errResponse = "Connection failed";
  } else if (response === "DATA") {
    errResponse = message;
  } else {
    errResponse = response;
  }
  return errResponse;
};

export default class MailerService {
  name: string = "";
  siteConfig: PageSiteConfig | undefined;

  private SMTP_FROM_EMAIL: string | undefined;
  private resend = new Resend(`${process.env.NEXT_SMTP_PASSWORD}`);

  async initialize(info: IPrivateCredentialInfo) {
    this.SMTP_FROM_EMAIL = info.smtpFromEmail;
  }
  constructor(info: IPrivateCredentialInfo) {
    this.siteConfig = info.siteConfig;
    this.initialize(info);
  }
  sendMail = (eventType: IEmailEventType, config: any) => {
    switch (eventType) {
      case "NEW_USER":
        return this.sendWelcomeMail(config as IWelcomeEmailConfig);
      case "NEW_TENANT":
        return this.sendTenantWelcomeMail(config as IWelcomeTenantConfig);

      case "TENANT_SUBSCRIPTION":
        return this.sendSubscriptionMail(config as ISubscriptionEmailConfig);
      case "VERIFY_EMAIL":
        return this.sendVerificationEmail(config as IEmailVerificationConfig);
      case "TEST_EMAIL_CREDENIDTIALS":
        return this.sendEmailCredentialsTestMail(config as ITestEmailConfig);
      case "SUBSCRIPTION_EXPIRE_REMINDER":
        return this.sendSubscriptionExpireNotify(config as ISendSubscriptionExpireNotify);
      case "TRIAL_SUBSCRIPTION_EXPIRE_REMINDER":
        return this.sendTrialSubscriptionExpireNotify(config as ISendSubscriptionExpireNotify);

      default:
        throw new Error("something went wrong");
    }
  };

  // multipe mails

  async sendWelcomeMail(config: IWelcomeEmailConfig): Promise<IEmailResponse> {
    try {
      const htmlString = render(
        WelcomeEmailPage({ configData: { ...config, site: this.siteConfig as PageSiteConfig } })
      );
      const sendMail = await this.resend.emails.send({
        to: config.email,
        from: `${this.siteConfig?.brand?.name} <${this.SMTP_FROM_EMAIL || process.env.FROM_SMTP_USER_EMAIL}>`,
        subject: `Welcome to ${this.siteConfig?.brand?.name}: Ignite Your Learning Journey!`,
        html: htmlString,
      });
      return { success: true, message: "Email sent successfully" };
    } catch (error: any) {
      return { success: false, error: `Error sending email:${getEmailErrorMessage(error.command)}` };
    }
  }

  async sendTenantWelcomeMail(config: IWelcomeTenantConfig): Promise<IEmailResponse> {
    try {
      const htmlString = render(WelcomeTenantEmailPage({ configData: { ...config } }));
      const sendMail = await this.resend.emails.send({
        to: config.tenantOwnerEmail,
        from: `${this.siteConfig?.brand?.name} <${this.SMTP_FROM_EMAIL || process.env.FROM_SMTP_USER_EMAIL}>`,
        subject: `Welcome to ${appConstant.platformName}: Lead your customer to success!`,
        html: htmlString,
      });
      return { success: true, message: "Email sent successfully" };
    } catch (error: any) {
      return { success: false, error: `Error sending email:${getEmailErrorMessage(error.command)}` };
    }
  }

  async sendSubscriptionMail(config: ISubscriptionEmailConfig) {
    try {
      const htmlString = render(SubscriptionTenantEmailPage({ configData: { ...config } }));
      const mailConfig = {
        to: config.tenantOwnerEmail,
        from: `${DEFAULT_THEME?.brand?.name} <${this.SMTP_FROM_EMAIL || process.env.FROM_SMTP_USER_EMAIL}>`,
        subject: `Welcome to ${appConstant.platformName}: Lead your customer to success!`,
        html: htmlString,
      };
      if (config.pdfPath) {
        Object.assign(mailConfig, {
          attachments: [
            {
              filename: "invoice.pdf",
              path: config.pdfPath,
              contentType: "application/pdf",
            },
          ],
        });
      }
      await this.resend.emails.send(mailConfig);
      return { success: true, message: "Email sent successfully" };
    } catch (error: any) {
      return { success: false, error: `Error sending email:${getEmailErrorMessage(error.command)}` };
    }
  }

  async sendFeedBackMail(config: IFeedBackConfig) {
    try {
      const sendMail = await this.resend.emails.send({
        to: `${process.env.FROM_SMTP_SUPPORT_EMAIL}`,

        from: `${this.siteConfig?.brand?.name} <${this.SMTP_FROM_EMAIL}>`,
        subject: `Feedback received from ${config.email} `,
        text: `Hey there, \n \n We have received a feedback from ${config.name} \n \n ${config.feedback}`,
      });
      return { success: true, message: "Email sent successfully" };
    } catch (error: any) {
      return { success: false, error: `Error sending email:${getEmailErrorMessage(error.command)}` };
    }
  }

  async sendEmailCredentialsTestMail(config: ITestEmailConfig) {
    const testTransporter = nodemailer.createTransport({
      port: 587,
      host: config.credendials.smtpHost,
      secure: false,
      auth: {
        user: config.credendials.smtpUser,
        pass: config.credendials.smtpPassword,
      },
      from: `${config.credendials.smtpFromEmail}`,
    });
    try {
      const htmlString = render(
        TestEmailCredentialsEmail({
          configData: { ...config, site: this.siteConfig as PageSiteConfig },
        })
      );

      const sendMail = await testTransporter.sendMail({
        to: config.email,
        from: `${this.siteConfig?.brand?.name} <${config.credendials.smtpFromEmail}>`,
        subject: `Test Email Credentials `,
        html: htmlString,
      });
      return { success: true, message: "Email sent successfully" };
    } catch (error: any) {
      console.log("error ", error);
      return { success: false, error: `Error sending email:${getEmailErrorMessage(error.command, error.response)}` };
    }
  }

  async sendSubscriptionExpireNotify(config: ISendSubscriptionExpireNotify): Promise<IEmailResponse> {
    try {
      const htmlString = render(SubscriptionExpireEmail({ configData: { ...config } }));
      const sendMail = await this.resend.emails.send({
        to: config.toEmail,
        from: `${this.siteConfig?.brand?.name} <${this.SMTP_FROM_EMAIL || process.env.FROM_SMTP_USER_EMAIL}>`,
        subject: `Subscription Expiry Reminder`,
        html: htmlString,
      });
      return { success: true, message: "Email sent successfully" };
    } catch (error: any) {
      return { success: false, error: `Error sending email:${getEmailErrorMessage(error.command)}` };
    }
  }
  async sendTrialSubscriptionExpireNotify(config: ISendSubscriptionExpireNotify): Promise<IEmailResponse> {
    try {
      const htmlString = render(TrialSubscriptionExpireEmail({ configData: { ...config } }));
      console.log(config, "this is data");
      const sendMail = await this.resend.emails.send({
        to: config.toEmail,
        from: `${DEFAULT_THEME.brand.name} <${this.SMTP_FROM_EMAIL || process.env.FROM_SMTP_USER_EMAIL}>`,
        subject: `Subscription Expiry Reminder`,
        html: htmlString,
      });
      return { success: true, message: "Email sent successfully" };
    } catch (error: any) {
      return { success: false, error: `Error sending email:${getEmailErrorMessage(error.command)}` };
    }
  }

  async sendVerificationEmail(config: {
    email: string;
    url: string;
    mode: "login" | "signup";
  }): Promise<IEmailResponse> {
    try {
      const htmlString = render(
        EmailVerificationPage({
          configData: {
            email: config.email,
            url: config.url,
            mode: config.mode,
            site: this.siteConfig as PageSiteConfig,
          },
        })
      );

      const sendMail = await this.resend.emails.send({
        to: config.email,
        from: `${this.siteConfig?.brand?.name} <${this.SMTP_FROM_EMAIL || process.env.FROM_SMTP_USER_EMAIL}>`,
        subject: `Verify your email for ${this.siteConfig?.brand?.name}`,
        html: htmlString,
      });
      return { success: true, message: "Verification email sent successfully" };
    } catch (error: any) {
      console.log(error, "send mail error");
      return { success: false, error: `Error sending verification email: ${getEmailErrorMessage(error.command)}` };
    }
  }
}
