import { Theme } from "@prisma/client";
import { User } from "next-auth";
import { ReactNode } from "react";
export interface IBrandInfo {
  name?: string;
  logo?: ReactNode | string;
}
export interface INavBarProps {
  user: User | undefined;
  showThemeSwitch?: boolean;
  activeTheme?: Theme;
  isMobile: boolean;
  brand?: IBrandInfo;
  items: {
    title: string;
    link: string;
  }[];
}

export interface ISideNavBarProps {
  isOpen: boolean;
  onAnchorClick: () => void;
  items?: {
    title: string;
    link: string;
  }[];

  showThemeSwitch?: boolean;
  activeTheme?: Theme;
  brand?: IBrandInfo;
}
