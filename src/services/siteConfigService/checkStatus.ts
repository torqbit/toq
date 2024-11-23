import { Role } from "@prisma/client";
import prisma from "@/lib/prisma";

export const checkSiteStatus = async (redirectUrl?: string) => {
  const totalUser = await prisma.account.count();

  const isMediaConfig = await prisma.serviceProvider.count({
    where: {
      service_type: "media",
    },
  });
  if (totalUser > 1) {
    return redirectUrl ? redirectUrl : "/dashboard";
  } else {
    if (isMediaConfig > 0) {
      return redirectUrl ? redirectUrl : "/dashboard";
    } else {
      return "/admin/onboard/complete";
    }
  }
};
