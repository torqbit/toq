import { DEFAULT_THEME } from "@/services/siteConstant";

export async function fetchIconAsBuffer(size: number, url: string) {
  const faviconUrl = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=${size}`;
  try {
    let response = await fetch(faviconUrl);

    if (!response.ok) {
      response = await fetch(DEFAULT_THEME.brand.favicon);
    }

    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
  } catch (error) {
    let response = await fetch(DEFAULT_THEME.brand.favicon);

    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
  }
}
