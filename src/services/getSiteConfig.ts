import { IncomingMessage, ServerResponse } from "http";
import { DEFAULT_THEME, PageSiteConfig } from "./siteConstant";
import prisma from "@/lib/prisma";
import fs from "fs";
import YAML from "yaml";

export const getSiteConfig = async (
  res: ServerResponse<IncomingMessage>,
  domain?: string
): Promise<{ site: PageSiteConfig }> => {
  const nextAuthUrl = new URL(process.env.NEXTAUTH_URL || "");
  const authDomain = `${nextAuthUrl.host}`;

  if (domain) {
    const tenantInfo = await prisma.tenant.findUnique({
      where: {
        domain,
      },
      select: {
        siteConfig: true,
      },
    });

    if (tenantInfo && tenantInfo.siteConfig) {
      return { site: JSON.parse(tenantInfo.siteConfig) as PageSiteConfig };
    } else {
      res.writeHead(302, { Location: "/404?error=siteNotFound" });
      res.end();
      return { site: DEFAULT_THEME as PageSiteConfig };
    }
  } else {
    return { site: DEFAULT_THEME as PageSiteConfig };
  }
};

export const getSiteConfigByTenantId = async (tenantId?: string): Promise<{ site: PageSiteConfig }> => {
  if (tenantId) {
    const tenantInfo = await prisma.tenant.findUnique({
      where: {
        id: tenantId,
      },
      select: {
        siteConfig: true,
      },
    });
    if (tenantInfo && tenantInfo.siteConfig) {
      return { site: JSON.parse(tenantInfo.siteConfig) as PageSiteConfig };
    } else {
      return { site: DEFAULT_THEME as PageSiteConfig };
    }
  } else {
    return { site: DEFAULT_THEME as PageSiteConfig };
  }
};

export const getSiteConfigFromYaml = (): PageSiteConfig => {
  try {
    const file = fs.readFileSync("./site.yaml", "utf8");
    const config = YAML.parse(file);

    // Deep merge helper function
    const deepMergeObjects = (target: any, source: any) => {
      const output = { ...target };
      if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach((key) => {
          if (isObject(source[key]) && !Array.isArray(source[key])) {
            if (!(key in target)) {
              Object.assign(output, { [key]: source[key] });
            } else {
              output[key] = deepMergeObjects(target[key], source[key]);
            }
          } else if (Array.isArray(source[key])) {
            // If target has an array and source has an array, replace it
            output[key] = [...(source[key] || [])];
          } else {
            Object.assign(output, { [key]: source[key] });
          }
        });
      }
      return output;
    };

    // Start with default theme
    let configData: PageSiteConfig = { ...DEFAULT_THEME };

    // Deep merge with YAML config if it exists
    if (config) {
      configData = deepMergeObjects(configData, config);
    }

    return configData;
  } catch (error) {
    console.error("Error parsing site config:", error);
    return DEFAULT_THEME;
  }
};

// Helper function to check if value is an object
const isObject = (item: any): boolean => {
  return item && typeof item === "object" && !Array.isArray(item);
};
