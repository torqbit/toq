import { FC, ReactNode } from "react";
import { INavBarProps } from "./landing/navbar";
import { IFeatureInfo } from "./landing/feature";
export type bannerAlignment = "left" | "right" | "bottom" | "background";
export interface IBrandConfig {
  logo?: string | ReactNode;
  icon?: string | ReactNode;

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
}

export interface INavBarConfig {
  links?: { title: string; link: string }[];
}

export interface IHeroConfig {
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
}

export interface ICourseConfig {
  enable?: boolean;
  title?: string;
  description?: string;
}
export interface IBlogConfig {
  enable?: boolean;
  title?: string;
  description?: string;
}

export interface ThemeSchema {
  template?: string;
  updated?: boolean;
  navBar?: INavBarConfig;
  brand?: IBrandConfig;
  darkMode?: boolean;
  heroSection?: IHeroConfig;
  sections?: {
    courses?: ICourseConfig;
    blog?: IBlogConfig;
    feature?: {
      featureInfo?: IFeatureInfo;
    };
  };
}
