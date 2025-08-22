import appConstant from "@/services/appConstant";
import prisma from "@/lib/prisma";
import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import { getSiteConfigFromYaml } from "@/services/getSiteConfig";

export const createAdminTenant = async () => {
  console.log("Creating admin tenant");

  // read the site config from the file
  const siteConfig = getSiteConfigFromYaml();
  let data: PageSiteConfig = siteConfig;
  data = {
    ...siteConfig,
    updated: true,
    brand: {
      ...siteConfig.brand,
      name: appConstant.platformName,
    },
  };

  const url = new URL(process.env.NEXTAUTH_URL || "");
  const rootDomain = url.port ? `${url.hostname}:${url.port}` : url.hostname;
  const dbTenant = await prisma.tenant.upsert({
    where: {
      domain: rootDomain,
    },
    create: {
      name: appConstant.platformName,
      domain: rootDomain,
      siteConfig: JSON.stringify(data),
      authConfigs: {
        create: {
          provider: "EMAIL",
          isEnabled: true,
        },
      },
    },
    update: {
      siteConfig: JSON.stringify(data),
    },
  });

  // get the agent based on the tenantId
  const agent = await prisma.aiAgent.findFirst({
    where: {
      tenantId: dbTenant.id,
    },
    select: {
      id: true,
    },
  });

  if (!agent) {
    await prisma.aiAgent.create({
      data: {
        name: `${data?.brand?.name} AI Assistant`,
        model: appConstant.TextToTextModel,
        temperature: appConstant.defaultAgentTemperature,
        agentPrompt: `You are ${data?.brand?.name}'s AI Assistant, an intelligent support system designed to educate and empower users while generating valuable leads. Your primary goals are:
    
    1. Provide accurate, helpful, and engaging responses about ${data?.brand?.name}'s products and services
    2. Guide users through educational content and resources
    3. Convert user interest into actionable leads when appropriate
    4. Maintain a professional, friendly, and informative tone
    5. Direct users to relevant courses, events, or blog content when beneficial
    
    Key Guidelines:
    - Always be helpful, patient, and clear in your responses
    - Focus on educating users while identifying potential leads
    - Use the brand's voice and maintain consistency with ${data?.brand?.name}'s messaging
    - When appropriate, guide users to relevant resources or next steps
    - Be proactive in offering assistance and additional information
    
    Product Description to reference:
    "${data?.brand?.description || "Educate and empower your customers and turn them into lead generating engine"}"`,
        tenantId: dbTenant.id,
      },
    });
  }

  return dbTenant.id;
};
