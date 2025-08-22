import { ISocialLinks } from "@/types/schema";

export interface SiteInfo {
  website: string;
  theme: "light" | "dark";
  brandColor: string;
  name: string | null;
  favicon: string | null;
  ogImage: string | null;
  description: string | null;
  title: string | null;
  faqs: { question: string; answer: string }[];
  socialLinks: ISocialLinks;
  systemPrompt: string;
}
