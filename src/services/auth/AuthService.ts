import { AuthAPIResponse } from "@/types/auth/api";
import { postFetch } from "../request";
import { Role, ServiceType } from "@prisma/client";
import prisma from "@/lib/prisma";

const authErrorMessage = "Failed to authenticate";
class AuthService {
  signup = (
    userData: {
      name: string;
      email: string;
      password: string;
    },
    onSuccess: (response: AuthAPIResponse) => void,
    onFailure: (message: string) => void
  ) => {
    postFetch(userData, `/api/v1/user/signup`).then((result) => {
      result.json().then((r) => {
        const apiResponse = r as AuthAPIResponse;
        apiResponse.success ? onSuccess(apiResponse) : onFailure(apiResponse.error || authErrorMessage);
      });
    });
  };

  checkSiteStatus = async (userRole: Role, redirectUrl?: string) => {
    const configDetails = await prisma.serviceProvider.findMany({
      select: {
        service_type: true,
      },
    });
    const serviceType = configDetails.map((s) => s.service_type);
    const allExist = serviceType.includes(ServiceType.CMS) && serviceType.includes(ServiceType.PAYMENTS);
    if (userRole === Role.ADMIN) {
      if (allExist) {
        return redirectUrl !== "undefined" ? `/${redirectUrl}` : "/dashboard";
      } else {
        return "/admin/onboard/complete";
      }
    } else {
      return redirectUrl !== "undefined" ? `/${redirectUrl}` : "/dashboard";
    }
  };
}

export default new AuthService();
