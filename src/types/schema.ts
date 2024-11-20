import { FC, ReactNode } from "react";
import { INavBarProps } from "./landing/navbar";
import { IFeatureInfo } from "./landing/feature";
export type bannerAlignment = "left" | "right" | "bottom" | "background";

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
      position?: bannerAlignment;
    };
  };

  footer?: {
    githubLink?: string;
    youtubeLink?: string;
    instagramLink?: string;
    twitterLink?: string;
    discordLink?: string;
    tagLine?: String;
  };
  sections: {
    feature?: {
      component?: React.FC<IFeatureInfo>;
      featureInfo?: IFeatureInfo;
    };
  };
}
