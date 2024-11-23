import { Role } from "@prisma/client";
import prisma from "@/lib/prisma";

export const checkSiteStatus = async (userRole: Role, redirectUrl?: string) => {
  const isMediaConfig = await prisma.serviceProvider.count({
    where: {
      service_type: "media",
    },
  });
  if (userRole === Role.ADMIN) {
    if (isMediaConfig > 0) {
      return redirectUrl ? redirectUrl : "/dashboard";
    } else {
      return "/admin/onboard/complete";
    }
  } else {
    return redirectUrl ? redirectUrl : "/dashboard";
  }
};
