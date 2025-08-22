import appConstant from "@/services/appConstant";
import { gatewayProvider } from "@prisma/client";
export const getCurrency = async (provider: gatewayProvider): Promise<string> => {
  return Promise.resolve(appConstant.currency);
};
