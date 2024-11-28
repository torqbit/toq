import { bannerAlignment, ThemeSchema } from "@/types/schema";
import { lazy } from "react";
const NavBar = lazy(() => import("@/templates/standard/components/NavBar/NavBar"));
const Features = lazy(() => import("@/templates/standard/components/Feature/Features"));

export type PageSiteConfig = ThemeSchema;

export const DEFAULT_THEME = {
  template: "standard",
  updated: false,
  navBar: {
    links: [
      {
        title: "Courses",
        link: "/#courses",
      },
      {
        title: "Events",
        link: "/events",
      },
      {
        title: "Blog",
        link: "/blog",
      },
    ],
  },

  brand: {
    name: "TORQBIT",
    logo: "/icon/torqbit.png",
    title: "Become a Pro Product Builder",
    description: "Master the art of product building and turn your ideas into successful, scalable products",
    ogImage: "/icon/torqbit.png",
    favicon: "/favicon.ico",
    brandColor: "#5b63d3",
    discord: "https://discord.gg/NserMXcx",
    github: "https://github.com/torqbit",
    youtube: "https://www.youtube.com/@torqbit",
  },

  darkMode: true,
  heroSection: {
    title: "Become a Pro Product Builder",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores rerum voluptatum perferendis autem veritatis nostrum. Libero aliquam dignissimos sunt voluptatum!",
    actionButtons: {
      primary: {
        label: "Go to Dashboard",
        link: "/dashboard",
      },
      secondary: {
        label: "Contact Us",
        link: "mailto:support@torqbit.com",
      },
    },
    banner: {
      lightModePath: "/img/macbook-light.png",
      darkModePath: "/img/macbook-dark.png",
      position: "bottom" as bannerAlignment,
    },
  },
  sections: {
    feature: {
      featureInfo: {
        featureList: [
          {
            img: "/img/landing/auth.png",
            title: "Authentication",
            description: "Configure authentication with Google, Github or any other auth provider supported by NextAuth",
            link: "/docs/auth",
            cardClass: "steps__card__small",
          },
          {
            img: "/img/landing/auth.png",
            title: "Authentication",
            description: "Configure authentication with Google, Github or any other auth provider supported by NextAuth",
            link: "/docs/auth",
            cardClass: "steps__card__small",
          },
          {
            img: "/img/landing/auth.png",
            title: "Authentication",
            description: "Configure authentication with Google, Github or any other auth provider supported by NextAuth",
            link: "/docs/auth",
            cardClass: "steps__card__small",
          },
          {
            img: "/img/landing/auth.png",
            title: "Authentication",
            description: "Configure authentication with Google, Github or any other auth provider supported by NextAuth",
            link: "/docs/auth",
            cardClass: "steps__card__small",
          },
        ],
        title: "Features",
        description: "Features for the learning platform",
      },
    },
  },
};

export const DEEP_OBJECT_KEYS = Object.entries(DEFAULT_THEME)
  .map(([key, value]) => {
    const isObject = value && typeof value === "object" && !Array.isArray(value);
    if (isObject) {
      return key;
    }
  })
  .filter(Boolean);
