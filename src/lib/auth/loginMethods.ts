import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { authConstants } from "../utils";

export default function getLoginMethods() {
  let loginMethods: string[] = [];
  const configuredProviders = authOptions.providers.map((p) => p.id);
  authOptions.providers.forEach((provider) => {
    if (
      provider.id === authConstants.GOOGLE_AUTH_PROVIDER &&
      process.env[authConstants.ENV_GOOGLE_ID] &&
      process.env[authConstants.ENV_GOOGLE_ID] !== "" &&
      process.env[authConstants.ENV_GOOGLE_SECRET] &&
      process.env[authConstants.ENV_GOOGLE_SECRET] != ""
    ) {
      loginMethods.push(provider.id);
    } else if (
      provider.id === authConstants.GITHUB_AUTH_PROVIDER &&
      process.env[authConstants.ENV_GITHUB_ID] &&
      process.env[authConstants.ENV_GITHUB_ID] != "" &&
      process.env[authConstants.ENV_GITHUB_SECRET] &&
      process.env[authConstants.ENV_GITHUB_SECRET] != ""
    ) {
      loginMethods.push(provider.id);
    } else if (provider.id == authConstants.CREDENTIALS_AUTH_PROVIDER) {
      loginMethods.push(provider.id);
    }
  });
  return {
    available: loginMethods,
    configured: configuredProviders,
  };
}
