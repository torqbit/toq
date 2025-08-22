import prisma from "@/lib/prisma";
import { SessionUser } from "@/types/auth/session";
import { $Enums } from "@prisma/client";

export async function getCustomerByEmail(email: string, domain: string): Promise<SessionUser | null> {
  return await prisma.user.findUnique({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      phone: true,
      isActive: true,
      tenants: {
        select: {
          tenantId: true,
          role: true,
          tenant: {
            select: {
              domain: true,
              subscription: {
                where: {
                  status: "ACTIVE",
                },
                include: {
                  plan: true,
                },
                orderBy: {
                  createdAt: "desc",
                },
              },
            },
          },
        },
        where: {
          tenant: {
            domain: domain,
          },
        },
      },
      account: {
        select: {
          password: true,
        },
      },
    },
    where: {
      email: email,
    },
  });
}

export async function getUserByTenant(email: string, tenantId: string): Promise<SessionUser | null> {
  return await prisma.user.findUnique({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      phone: true,
      isActive: true,
      tenants: {
        select: {
          tenantId: true,
          role: true,
          tenant: {
            select: {
              domain: true,
              subscription: {
                where: {
                  status: $Enums.SubStatus.ACTIVE,
                },
                include: {
                  plan: true,
                },
                orderBy: {
                  createdAt: "desc",
                },
              },
            },
          },
        },
        where: {
          tenant: {
            id: tenantId,
          },
        },
      },
      account: {
        select: {
          password: true,
        },
      },
    },
    where: {
      email: email,
    },
  });
}

export default async function getUserByEmail(email: string, domain?: string): Promise<SessionUser | null> {
  if (domain) {
    return await prisma.user.findFirst({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        phone: true,
        isActive: true,
        tenants: {
          select: {
            tenantId: true,
            role: true,
            tenant: {
              select: {
                domain: true,
                subscription: {
                  where: {
                    status: "ACTIVE",
                  },
                  include: {
                    plan: true,
                  },
                  orderBy: {
                    createdAt: "desc",
                  },
                },
              },
            },
          },
          where: {
            tenant: {
              domain: domain,
            },
          },
        },
        account: {
          select: {
            password: true,
          },
        },
      },
      where: {
        email: email,
      },
    });
  } else {
    return await prisma.user.findFirst({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        phone: true,
        isActive: true,
        tenants: {
          select: {
            tenantId: true,
            role: true,
            tenant: {
              select: {
                domain: true,
                subscription: {
                  where: {
                    status: "ACTIVE",
                  },
                  include: {
                    plan: true,
                  },
                  orderBy: {
                    createdAt: "desc",
                  },
                },
              },
            },
          },
        },
        account: {
          select: {
            password: true,
          },
        },
      },
      where: {
        email: email,
      },
    });
  }
}
