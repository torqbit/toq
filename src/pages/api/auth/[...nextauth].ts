import NextAuth, { NextAuthOptions, RequestInternal } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { parse } from "cookie";
import prisma from "@/lib/prisma";
import { $Enums, AuthProvider, Role, TenantRole } from "@prisma/client";
import { EmailManagementService } from "@/services/email/EmailManagementService";
import { getCookieName } from "@/lib/utils";

import { DEFAULT_THEME } from "@/services/siteConstant";
import AuthService from "@/services/auth/AuthService";
import { checkUserExist } from "../v1/user/check";
import { createAdminTenant } from "@/services/server/admin/createAdminTenant";

// Add new function to get tenant config
export async function getTenantConfig(domain: string) {
  const tenant = await prisma.tenant.findFirst({
    where: {
      domain: domain,
    },
    select: {
      id: true,
      authConfigs: true,
    },
  });
  return tenant;
}

async function getProviderByDomain(domain: string) {
  const mainUrl = new URL(`${process.env.NEXTAUTH_URL}`);

  if (domain.includes("localhost") || domain.includes(mainUrl.hostname)) {
    let provider = [];
    provider.push(
      EmailProvider({
        server: process.env.EMAIL_SERVER,
        from: process.env.NEXT_SMTP_EMAIL,
        maxAge: 24 * 60 * 60,
        sendVerificationRequest: async ({ identifier: email, url, provider: { server, from } }) => {
          // Parse the original URL
          const originalUrl = new URL(url);
          const protocol = originalUrl.protocol;
          const isUserExist = await checkUserExist(domain, email);

          // Extract the pathname and search params
          const pathWithParams = originalUrl.pathname + originalUrl.search;

          // Replace all instances of domain in the URL
          const callbackUrl = new URLSearchParams(originalUrl.search).get("callbackUrl");

          let updatedCallbackUrl = `${protocol}//${domain}/login/sso`;

          // if (callbackUrl) {
          //   // Replace domain in callback URL
          //   updatedCallbackUrl = new URL(callbackUrl).pathname;
          //   updatedCallbackUrl = `${protocol}//${domain}${updatedCallbackUrl}`;
          // }

          // Construct the final URL with the current domain
          const customUrl = `${protocol}//${domain}${pathWithParams}`;
          const finalUrl = customUrl.replace(
            encodeURIComponent(String(callbackUrl)),
            encodeURIComponent(updatedCallbackUrl)
          );

          const tenant = await getTenantConfig(domain);
          const ms = await new EmailManagementService().getMailerService(tenant?.id || "");
          if (ms) {
            await ms.sendMail("VERIFY_EMAIL", {
              email: email,
              url: finalUrl,
              mode: isUserExist ? "login" : "signup",
            });
          }
        },
      })
    );

    if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
      provider.push(
        GithubProvider({
          clientId: process.env.GITHUB_ID as string,
          clientSecret: process.env.GITHUB_SECRET as string,
        })
      );
    }
    if (process.env.GOOGLE_ID && process.env.GOOGLE_SECRET) {
      provider.push(
        GoogleProvider({
          clientId: process.env.GOOGLE_ID as string,
          clientSecret: process.env.GOOGLE_SECRET as string,
          authorization: {
            params: {
              state: Buffer.from(domain).toString("base64"),
              prompt: "consent",
              access_type: "offline",
              response_type: "code",
            },
          },
        })
      );
    }
    return provider;
  } else {
    return [];
  }
}

const sendWelcomeEmail = async (name: string, email: string, tenantId: string, url: string) => {
  const configData = {
    name: name || email.split("@")[0],
    url: url,
    email: email,
    site: DEFAULT_THEME,
  };
  const ms = await new EmailManagementService().getMailerService(String(tenantId));
  if (ms) {
    ms.sendMail("NEW_USER", configData).then((result) => {
      console.error(result.error);
    });
  }
};

export const authOptions = async (req: any): Promise<NextAuthOptions> => {
  // Get tenant from domain
  const domain = req?.headers?.host || "";
  const protocol = req.headers["x-forwarded-proto"]?.toString().split(",")[0] || "http";
  const tenant = await getTenantConfig(domain);
  let tenantId = tenant?.id;
  if (!tenantId) {
    tenantId = await createAdminTenant();
  }
  const mainUrl = new URL(`${process.env.NEXTAUTH_URL}`);
  let cookieDomain = mainUrl.hostname;

  return {
    secret: process.env.NEXTAUTH_SECRET,
    cookies: {
      sessionToken: {
        name: getCookieName(),
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: process.env.NODE_ENV === "production",
          domain: process.env.COOKIE_DOMAIN || cookieDomain,
        },
      },
    },
    adapter: {
      ...PrismaAdapter(prisma),
      createSession: async (data) => {
        const sessionData = [
          {
            sessionToken: data.sessionToken,
            expires: data.expires,
            userId: data.userId,
            tenantId: tenantId,
          },
        ];
        if (`${protocol}://${domain}` === process.env.NEXTAUTH_URL) {
          const ownedTenants = (await AuthService.getTenantsByUserId(data.userId, TenantRole.OWNER)).filter(
            (t) => t.tenantId !== tenantId
          );
          if (ownedTenants.length > 0) {
            sessionData.push(
              ...ownedTenants.map((tenant) => {
                return {
                  sessionToken: data.sessionToken,
                  expires: data.expires,
                  userId: data.userId,
                  tenantId: tenant.tenantId,
                };
              })
            );
          }
        }
        await prisma.session.createMany({
          data: sessionData,
        });
        return {
          sessionToken: data.sessionToken,
          userId: data.userId,
          expires: data.expires,
        };
      },
      getSessionAndUser: async (sessionToken) => {
        return prisma.session
          .findUnique({
            where: {
              sessionToken_tenantId: {
                sessionToken,
                tenantId: tenantId,
              },
            },
            select: {
              id: true,
              userId: true,
              expires: true,
              sessionToken: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                  phone: true,
                  role: true,
                  emailVerified: true,
                  isActive: true,
                  tenants: {
                    where: { tenantId },
                    select: {
                      tenantId: true,
                      role: true,

                      tenant: {
                        select: {
                          domain: true,
                          onBoarding: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          })
          .then((session) => {
            return session
              ? {
                  session,
                  user: {
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.name,
                    image: session.user.image,
                    phone: session.user.phone,
                    role: session.user.role,
                    isActive: session.user.isActive,
                    tenants: session.user.tenants,
                  },
                }
              : null;
          });
      },
      updateSession: async (data) => {
        return prisma.session.update({
          where: {
            sessionToken_tenantId: {
              sessionToken: data.sessionToken,
              tenantId: tenantId,
            },
          },
          data,
        });
      },
      deleteSession: async (sessionToken) => {
        await prisma.session.deleteMany({
          where: {
            sessionToken,
          },
        });
      },
      async getUserByAccount({ provider, providerAccountId }) {
        const account = await prisma.account.findUnique({
          where: {
            provider_providerAccountId_tenantId: {
              provider: provider,
              providerAccountId: providerAccountId,
              tenantId: tenantId,
            },
          },
          include: { user: true },
        });
        return account?.user ?? null;
      },
      async linkAccount(account: any) {
        let tenantId = tenant?.id;
        if (tenantId) {
          return prisma.account.upsert({
            where: {
              provider_providerAccountId_tenantId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                tenantId: tenantId,
              },
            },
            create: {
              userId: account.userId,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              tenantId: tenantId,
            },
            update: {
              access_token: account.access_token,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
            },
          });
        }
      },
      async createUser(user: any) {
        if (user.email != process.env.ADMIN_EMAIL && !domain.includes(mainUrl.hostname)) {
          await sendWelcomeEmail(user.name, user.email, tenantId, `${protocol}://${domain}`);
        }
        let userTenantId = tenantId;

        const userDetails = await prisma.user.upsert({
          where: {
            email: user.email,
          },
          create: {
            ...user,
            name: user.email.split("@")[0],
            role: user.email == process.env.ADMIN_EMAIL ? $Enums.Role.CUSTOMER : $Enums.Role.MEMBER,
          },
          update: {
            name: user.email.split("@")[0],
            image: user.image,
          },
        });

        await prisma.userTenant.create({
          data: {
            userId: userDetails.id,
            tenantId: userTenantId,
            role: user.email == process.env.ADMIN_EMAIL ? $Enums.TenantRole.OWNER : $Enums.TenantRole.MEMBER,
          },
        });

        return userDetails;
      },
    },
    providers: await getProviderByDomain(domain),
    session: {
      strategy: "database",
    },
    callbacks: {
      async signIn({ user, account, profile }) {
        if (account && account?.provider !== "credentials") {
          // Check if user exists in current tenant

          let dbUser = await prisma.user.findUnique({
            where: {
              email: user.email || "",
            },
            select: {
              id: true,
            },
          });

          if (dbUser) {
            // Add the user to the new tenant using upsert
            await prisma.userTenant.upsert({
              where: {
                userId_tenantId: {
                  userId: dbUser.id,
                  tenantId: tenant?.id || "",
                },
              },
              create: {
                userId: dbUser.id,
                tenantId: tenant?.id || "",
                role: $Enums.TenantRole.MEMBER,
              },
              update: {},
            });

            try {
              await prisma.account.upsert({
                where: {
                  provider_providerAccountId_tenantId: {
                    provider: account?.provider,
                    providerAccountId: account.providerAccountId,
                    tenantId: tenant?.id || "",
                  },
                },
                create: {
                  userId: dbUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  tenantId: tenant?.id || "",
                },
                update: {
                  access_token: account.access_token,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                },
              });
            } catch (error) {
              console.error(error);
            }
          }
        }
        return true;
      },
      async redirect({ url, baseUrl }) {
        // Get the current domain from the request
        const domain = req?.headers?.host || "";

        if (url.startsWith("/")) {
          return url;
        }

        // Parse the URL to handle the redirection
        const urlObj = new URL(url);
        const callbackUrl = urlObj.searchParams.get("callbackUrl");

        // If there's a specific callback URL in the parameters, use it
        if (callbackUrl) {
          const callbackUrlObj = new URL(callbackUrl);
          // Ensure we're using the tenant's domain
          return `${urlObj.protocol}//${domain}${callbackUrlObj.pathname}${callbackUrlObj.search}`;
        }

        // For verification callbacks, redirect to the tenant's domain
        if (url.includes("/verify-email") || url.includes("/error")) {
          return `${urlObj.protocol}//${domain}${urlObj.pathname}${urlObj.search}`;
        }

        // Default redirect to home page
        return `${urlObj.protocol}//${domain}${urlObj.pathname}`;
      },
      async jwt({ token, user, account, profile, trigger, session }) {},

      async session({ session, token, trigger, newSession, user }) {
        if (session.user) {
          session.id = user.id;
          session.role = user.role as Role;
          session.phone = user.phone as string;

          session.isActive = user.isActive;
          session.email = user.email;
          session.name = user.name;

          if (user.tenants.length > 0) {
            session.tenant = {
              tenantId: user.tenants[0].tenantId,
              role: user.tenants[0].role,
              domain: user.tenants[0].domain,
              onBoarding: user.tenants[0].onBoarding,
              subscription: user.role === Role.ADMIN ? null : user.tenants[0].subscription,
            };
          }
          session.isSubscriptionExpired = false;
          if (trigger == "update" && newSession?.name) {
            session.user.name = newSession?.name;
            session.phone = newSession?.phone;
            session.user.image = newSession?.image || null;
          }
        }

        return session;
      },
    },

    pages: {
      signIn: "/login",
      verifyRequest: "/auth/error",
      error: "/auth/error",
    },
  };
};
export default async function auth(req: any, res: any) {
  return await NextAuth(req, res, await authOptions(req));
}
