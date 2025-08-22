import prisma from "@/lib/prisma";

export const getTenantInfo = async (userId: string, domain: string) => {
  const tenant = await prisma.tenant.findUnique({
    where: {
      domain: domain,
    },
    select: {
      id: true,
    },
  });

  if (tenant) {
    const userTenant = await prisma.userTenant.findUnique({
      where: {
        userId_tenantId: {
          userId,
          tenantId: tenant.id,
        },
      },
      select: {
        role: true,
      },
    });

    if (userTenant) {
      return { tenantId: tenant.id, tenantRole: userTenant.role };
    }
  }
};
