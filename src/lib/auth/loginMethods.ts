import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { AuthProvider } from "@prisma/client";

export default async function getLoginMethods(req: any) {
  let loginMethods: string[] = [];

  const configuredProviders = (await authOptions(req)).providers.map((p) => p.id);

  (await authOptions(req)).providers.forEach((provider) => {
    if (provider.id.toUpperCase() === AuthProvider.EMAIL) {
      loginMethods.push(provider.id);
    } else if (provider.id.toUpperCase() === AuthProvider.GOOGLE) {
      loginMethods.push(provider.id);
    } else if (provider.id.toUpperCase() === AuthProvider.GITHUB) {
      loginMethods.push(provider.id);
    }
  });
  return {
    available: loginMethods,
    configured: configuredProviders,
  };
}
