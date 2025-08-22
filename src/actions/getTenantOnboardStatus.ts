import prisma from "@/lib/prisma";

import { ITenantOnboardStatus } from "@/types/setup/siteSetup";

export const getTenantOnboardStatus = async (tenantId: string): Promise<ITenantOnboardStatus> => {
  let aiAssistant = 0;
  const tenant = await prisma.tenant.findUnique({
    where: {
      id: tenantId,
    },
    select: {
      createdAt: true,
      updatedAt: true,
      id: true,

      onBoarding: true,
    },
  });

  aiAssistant = await prisma.knowledgeSource.count({
    where: { tenantId },
  });

  return {
    onBoarded: tenant?.onBoarding || false,
    aiAssistant: aiAssistant > 0,
  };
};
