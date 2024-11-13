import { ReactNode } from "react";
import { INavBarProps } from "./courses/navbar";

export interface ThemeSchema {
  platformName: string;
  navBar: {
    component: React.FC<INavBarProps>;
  };
  logo: ReactNode | string;
  navigationLinks: { title: string; link: string }[];
  darkMode: boolean;
}
