import SecretsManager from "@/services/secrets/SecretsManager";
import { APIResponse } from "@/types/apis";
import { IEmailCredentials } from "@/types/cms/email";
import emailService from "@/services/MailerService";
import prisma from "@/lib/prisma";
import { ServiceType } from "@prisma/client";
import { IPrivateCredentialInfo } from "@/types/mail";
import MailerService from "@/services/MailerService";
import { getSiteConfigByTenantId } from "@/services/getSiteConfig";
import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";

export const emailConstantsVariable = {
  SMTP_HOST: "SMTP_HOST",
  SMTP_USER: "SMTP_USER",
  SMTP_PASSWORD: "SMTP_PASSWORD",
  SMTP_FROM_EMAIL: "SMTP_FROM_EMAIL",
};
export class EmailManagementService {
  serviceType: ServiceType = ServiceType.EMAIL;

  getMailerService = async (tenantId?: string): Promise<emailService> => {
    try {
      let siteConfig: PageSiteConfig = DEFAULT_THEME;
      if (tenantId) {
        const siteConfigData = await getSiteConfigByTenantId(tenantId);
        if (siteConfigData) {
          siteConfig = siteConfigData.site;
        }
      }
      let info: IPrivateCredentialInfo = {
        smtpHost: process.env.NEXT_SMTP_HOST || "",
        smtpUser: process.env.NEXT_SMTP_USER || "",
        smtpFromEmail: process.env.NEXT_SMTP_EMAIL || "",
        smtpPassword: process.env.NEXT_SMTP_PASSWORD || "",
        siteConfig: siteConfig as PageSiteConfig,
      };
      const ms = new MailerService(info);

      return ms;
    } catch (error: any) {
      throw new Error(`something went wrong due to ${error}`);
    }
  };
  getEmailCredentials = async (tenantId: string): Promise<APIResponse<IPrivateCredentialInfo>> => {
    try {
      const secretStore = SecretsManager.getSecretsProvider();
      const smtpHost = await secretStore.get(emailConstantsVariable.SMTP_HOST, tenantId);
      const smtpUser = await secretStore.get(emailConstantsVariable.SMTP_USER, tenantId);
      const smtpPassword = await secretStore.get(emailConstantsVariable.SMTP_PASSWORD, tenantId);

      const smtpFromEmail = await secretStore.get(emailConstantsVariable.SMTP_FROM_EMAIL, tenantId);

      if (!smtpHost || !smtpUser || !smtpFromEmail || !smtpPassword) {
        return {
          success: false,
          error: "Email credentials not found",
          message: "Email credentials not found",
          status: 400,
        };
      }
      return {
        success: true,
        body: { smtpHost, smtpUser, smtpFromEmail, smtpPassword },
        message: "Successfully fetched the email configuration",
        status: 200,
      };
    } catch (error: any) {
      return { success: false, error: "error", message: error.message, status: 400 };
    }
  };

  verifyEmailCredentialsAndSave = async (
    emailConfig: IEmailCredentials,
    name: string,
    email: string,
    tenantId: string
  ): Promise<APIResponse<void>> => {
    try {
      const providerDetail = await this.getEmailCredentials(tenantId);
      let result: any;
      if (providerDetail.body) {
        const es = new emailService(providerDetail.body);
        result = await es.sendMail("TEST_EMAIL_CREDENIDTIALS", { credendials: emailConfig, name, email });
      }

      const secretStore = SecretsManager.getSecretsProvider();
      if (result && result.success) {
        await secretStore.put(emailConstantsVariable.SMTP_HOST, emailConfig.smtpHost, tenantId);
        await secretStore.put(emailConstantsVariable.SMTP_USER, emailConfig.smtpUser, tenantId);
        await secretStore.put(emailConstantsVariable.SMTP_PASSWORD, emailConfig.smtpPassword, tenantId);
        await secretStore.put(emailConstantsVariable.SMTP_FROM_EMAIL, emailConfig.smtpFromEmail, tenantId);
        await prisma.serviceProvider.create({
          data: {
            provider_name: emailConfig.smtpHost,
            service_type: this.serviceType,
            providerDetail: {},
            tenantId: tenantId,
            state: "EMAIL_CONFIGURED",
          },
        });
        return new APIResponse<void>(true, 200, `Successfully saved the email configuration`);
      } else {
        return new APIResponse<void>(false, 400, result?.error);
      }
    } catch (error: any) {
      return { success: false, error: "error", message: error.message, status: 400 };
    }
  };
}
