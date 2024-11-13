import { FC, ReactNode } from "react";
import { INavBarProps } from "./courses/navbar";

export interface ThemeSchema {
  navBar?: {
    component?: React.FC<INavBarProps>;
    navigationLinks?: { title: string; link: string }[];
  };
  brand?: {
    logo?: ReactNode | string;
    name?: string;
  };
  darkMode?: boolean;
}
