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
  user?: User;
  showThemeSwitch: boolean;
  activeTheme: Theme;
  isMobile: boolean;
  brand: IBrandInfo;
  items: {
    title: string;
    link: string;
  }[];
}
