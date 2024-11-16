import { FC, ReactNode } from "react";
import { INavBarProps } from "./courses/navbar";
export type bannerAlignment = "left" | "right" | "bottom";

export interface ThemeSchema {
  navBar?: {
    component?: React.FC<INavBarProps>;
    navigationLinks?: { title: string; link: string }[];
  };
  brand?: {
    logo?: ReactNode | string;
    name?: string;
    title?: string;
    description?: string;
    ogImage?: string;
    favicon?: string;
    brandColor?: string;
  };
  darkMode?: boolean;
  heroSection?: {
    title?: string;
    description?: string;
    actionButtons?: {
      primary?: {
        label?: string;
        link?: string;
      };
      secondary?: {
        label?: string;
        link?: string;
      };
    };
    banner?: {
      lightModePath?: string;
      darkModePath?: string;
      align?: bannerAlignment;
    };
  };

  footer?: {
    githubLink?: string;
    youtubeLink?: string;
    instagramLink?: string;
    twitterLink?: string;
    discordLink?: string;
  };
}
