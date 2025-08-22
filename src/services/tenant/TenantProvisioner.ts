import { TenantProvisionerProvider } from "@/types/tenant/tenant";
import { DEFAULT_THEME, PageSiteConfig } from "../siteConstant";
import prisma from "@/lib/prisma";
import { APIResponse } from "@/types/apis";
import SecretsManager from "../secrets/SecretsManager";
import { EmailManagementService } from "../email/EmailManagementService";

const secretsStore = SecretsManager.getSecretsProvider();

export class TenantProvisioner implements TenantProvisionerProvider {
  userId: string;
  constructor(userId: string) {
    this.userId = userId;
  }

  async deleteTenant(tenantId: string): Promise<APIResponse<any>> {
    let accessKey = process.env.BUNNY_ACCESS_KEY;
    if (accessKey) {
      const findProvider = await prisma.serviceProvider
        .findUnique({
          where: {
            service_type_tenantId: {
              service_type: "CMS",
              tenantId: tenantId,
            },
          },
          select: {
            providerDetail: true,
          },
        })
        .then(async (r) => {
          const findAccounts = await prisma.account.findMany({
            where: {
              tenantId: tenantId,
            },
            select: {
              user: {
                select: {
                  account: true,
                },
              },
            },
          });
          let deletableUserId: string[] = [];
          findAccounts.forEach((a) => {
            if (a.user.account.length == 1) {
              deletableUserId.push(a.user.account[0].userId);
            }
          });

          await prisma.tenant.delete({
            where: {
              id: tenantId,
            },
          });

          await prisma.user.deleteMany({
            where: {
              id: {
                in: deletableUserId,
              },
            },
          });

          return new APIResponse(true, 200, "Tenant has been deleted");
        })
        .catch((error) => {
          return new APIResponse(false, 400, `Unable to delete the tenant due to: ${error}`);
        });
      return findProvider;
    } else {
      return new APIResponse(false, 400, "Unable to find the access key");
    }
  }

  async provision(
    brandName: string,
    brandColor: string,
    brandTitle: string,
    email: string,
    ownerName: string,
    tenantId: string
  ): Promise<APIResponse<{ tenantId: string; domain: string }>> {
    let tenant = 0;
    const subDomainUrl = new URL(`${process.env.NEXTAUTH_URL}`);

    let subDomain = `${brandName}.${subDomainUrl.hostname}`.toLowerCase();

    const tenantResponse = await this.updateTenant(brandName, brandColor, brandTitle, subDomain, tenantId);

    if (tenantResponse.success && tenantResponse.body) {
      //get the tenant owner details
      await this.notifyCustomer(email, brandName, ownerName, subDomain);
      return new APIResponse(true, 200, "Tenant Created", tenantResponse.body);
    } else {
      return new APIResponse(tenantResponse.success, tenantResponse.status, tenantResponse.message);
    }
  }

  async updateTenant(
    brandName: string,
    brandColor: string,
    brandTitle: string,
    domain: string,
    tenantId: string
  ): Promise<APIResponse<{ tenantId: string; domain: string }>> {
    const site = DEFAULT_THEME;

    let data: PageSiteConfig = {
      ...site,
      updated: false,
      businessInfo: {
        gstNumber: "",
        panNumber: "",
        address: "",
        state: "",
        country: "",
      },
      brand: {
        ...site.brand,
        name: brandName,
        brandColor: brandColor,

        title: brandTitle,
      },
    };

    const response = await prisma
      .$transaction(async (tx) => {
        const tenantData = await tx.tenant.update({
          where: {
            id: tenantId,
          },
          data: {
            name: brandName,
            siteConfig: JSON.stringify(data),
          },
          select: {
            id: true,
          },
        });

        //find the latest session for the current userId
        const session = await tx.session.findFirst({
          where: {
            userId: String(this.userId),
            tenantId: tenantId,
          },
          select: {
            expires: true,
            sessionToken: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        // create a session for the new tenant
        await tx.session.create({
          data: {
            userId: String(this.userId),
            tenantId: String(tenantData?.id),
            expires: session?.expires || new Date(),
            sessionToken: session?.sessionToken || "",
          },
        });

        return { success: true, body: { tenantId: tenantData.id } };
      })
      .catch((error) => {
        console.error(error);
        return { success: false, body: error };
      });
    if (response.success && response.body) {
      return new APIResponse(true, 200, "Stream has been configured", {
        tenantId: response.body.tenantId,
        domain: domain,
      });
    } else {
      return new APIResponse(response.success, 400, response.body.tenantId);
    }
  }

  async notifyCustomer(email: string, brandName: string, ownerName: string, subDomain: string) {
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const dashboardUrl = `${protocol}://${subDomain}/dashboard`;
    const ms = await new EmailManagementService().getMailerService();
    const emailResponse = await ms.sendMail("NEW_TENANT", {
      name: ownerName,
      brandName: brandName,
      tenantOwnerEmail: email,
      url: dashboardUrl,
    });
    return emailResponse;
  }
}
