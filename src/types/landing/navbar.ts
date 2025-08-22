import { PageSiteConfig } from "@/services/siteConstant";
import { Theme } from "@/types/theme";
import { User } from "next-auth";
import { ReactNode } from "react";
export interface IBrandInfo {
  name: string;

  icon: ReactNode | string;
  logo: ReactNode | string;
  darkLogo: string | ReactNode;
}
export interface INavBarProps {
  user?: any;
  showThemeSwitch: boolean;
  activeTheme: Theme;
  isMobile: boolean;
  brand: IBrandInfo;
  defaultNavlink?: string;
  homeLink: string;
  previewMode?: boolean;
  extraContent: React.ReactNode;
  navBarWidth?: string | number;
  siteConfig: PageSiteConfig;
  items: {
    title: string;
    link: string;
  }[];
}
