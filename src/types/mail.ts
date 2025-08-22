import { PageSiteConfig } from "@/services/siteConstant";

export interface IPrivateCredentialInfo {
  smtpHost: string;
  smtpUser: string;
  smtpFromEmail: string;
  smtpPassword: string;
  siteConfig?: PageSiteConfig;
}
