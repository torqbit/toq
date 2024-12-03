import { FC, ReactNode } from "react";
import { INavBarProps } from "./landing/navbar";
import { IFeatureInfo } from "./landing/feature";
export type bannerAlignment = "left" | "right" | "bottom" | "background";
export interface IBrandConfig {
  name: string;
  logo: string;
  title: string;
  description: string;
  ogImage: string;
  favicon: string;
  brandColor: string;
  discord: string;
  github: string;
  youtube: string;
}

export interface ThemeSchema {
  template?: string;
  updated?: boolean;
  navBar?: {
    links?: { title: string; link: string }[];
  };
  brand?: {
    logo?: ReactNode | string;
    name?: string;
    title?: string;
    description?: string;
    ogImage?: string;
    favicon?: string;
    brandColor?: string;
    socialLinks?: {
      github?: string;
      youtube?: string;
      instagram?: string;
      twitter?: string;
      discord?: string;
    };
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

  sections?: {
    feature?: {
      featureInfo?: IFeatureInfo;
    };
  };
}
