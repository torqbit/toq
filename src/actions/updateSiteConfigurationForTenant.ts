import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import { fetchImageBuffer } from "./fetchImageBuffer";
import fs from "fs";
import sharp from "sharp";
import { createSlug, getExtension } from "@/lib/utils";
import { toIco, toIcoBuffer } from "./pngToIco";
import prisma from "@/lib/prisma";
import { SiteInfo } from "@/lib/types/site";

import appConstant from "@/services/appConstant";
import { fetchIconAsBuffer } from "./extractIcon";

async function generateFileBuffer(input: string): Promise<{ success: boolean; buffer?: Buffer; error?: string }> {
  try {
    const isSvg = input.trim().toLowerCase().startsWith("<svg");

    if (isSvg) {
      const tempFilePath = `temp-${Date.now()}.svg`;
      try {
        await fs.promises.writeFile(tempFilePath, input, "utf-8");
        const buffer = await fs.promises.readFile(tempFilePath);
        fs.unlinkSync(tempFilePath);
        return {
          success: true,
          buffer,
        };
      } catch (error) {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
        throw error;
      }
    } else {
      const buffer = await fetchImageBuffer(input);
      return {
        success: true,
        buffer,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function updateSiteConfiguration(tenantDetails: SiteInfo, tenantId: string, siteUrl: string) {
  const site = DEFAULT_THEME;
  let data: PageSiteConfig = site;
  let icon = site.brand.icon;
  let favicon = site.brand.favicon;
  let ogImage = site.brand.ogImage;
  let logo = site.brand.logo;
  let darkLogo = site.brand.darkLogo;

  const iconBuffer = await fetchIconAsBuffer(64, siteUrl);

  data = {
    ...site,
    updated: false,
    businessInfo: {
      gstNumber: "",
      panNumber: "",
      address: "",
      state: "",
      country: "",
    },
    sections: {
      ...site.sections,
      testimonials: {
        ...site.sections.testimonials,
        enabled: false,
      },
      faq: {
        ...site.sections.faq,
        items: tenantDetails.faqs,
        enabled: true,
      },
      courses: {
        ...site.sections.courses,

        enable: true,
      },
    },
    heroSection: {
      ...site.heroSection,
      title: `Welcome to ${tenantDetails.name} Learning center`,
      description: tenantDetails.description || site.heroSection.description,
      banner: {
        lightModePath: "",
        darkModePath: "",
      },
    },
    brand: {
      ...site.brand,
      description: tenantDetails.description || site.brand.description,
      socialLinks: tenantDetails.socialLinks,
      name: tenantDetails.name || site.brand.name,
      themeSwitch: false,
      defaultTheme: tenantDetails.theme,
      brandColor: tenantDetails.brandColor,
      icon,
      favicon,
      darkLogo: darkLogo,
      logo: logo,
      ogImage,
      title: tenantDetails.title || site.brand.title,
    },
  };

  await prisma.tenant.update({
    where: {
      id: tenantId,
    },
    data: {
      siteConfig: JSON.stringify(data),
    },
  });

  return data;
}
