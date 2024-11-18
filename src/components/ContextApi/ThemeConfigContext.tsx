import { deepMerge } from "@/lib/utils";
import { DEEP_OBJECT_KEYS, DEFAULT_THEME, PageThemeConfig } from "@/services/themeConstant";
import { ReactNode, useRef } from "react";
import config from "@/theme.config";

export function useThemeConfig() {
  let configData = {
    ...DEFAULT_THEME,
    ...(config &&
      Object.fromEntries(
        Object.entries(config).map(([key, userValue]) => [
          key,
          DEEP_OBJECT_KEYS.includes(key) && typeof userValue === "object" && userValue !== null
            ? deepMerge(DEFAULT_THEME[key as keyof PageThemeConfig], userValue)
            : userValue !== undefined && userValue !== null
            ? userValue
            : DEFAULT_THEME[key as keyof PageThemeConfig],
        ])
      )),
  };

  return configData;
}
