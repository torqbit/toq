import { deepMerge } from "@/lib/utils";
import { DEEP_OBJECT_KEYS, DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import { ReactNode, useRef } from "react";
import config from "@/site.config";

export function useSiteConfig() {
  let configData = {
    ...DEFAULT_THEME,
    ...(config &&
      Object.fromEntries(
        Object.entries(config).map(([key, userValue]) => [
          key,
          DEEP_OBJECT_KEYS.includes(key) && typeof userValue === "object" && userValue !== null
            ? deepMerge(DEFAULT_THEME[key as keyof PageSiteConfig], userValue)
            : userValue !== undefined && userValue !== null
            ? userValue
            : DEFAULT_THEME[key as keyof PageSiteConfig],
        ])
      )),
  };

  return configData;
}
