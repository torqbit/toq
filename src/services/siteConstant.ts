import { bannerAlignment, IBusinessInfo, ThemeSchema } from "@/types/schema";
import { Theme } from "@/types/theme";
import { businessConfig } from "./businessConfig";

export type PageSiteConfig = ThemeSchema;

export const DEFAULT_THEME = {
  template: "standard",
  updated: false,
  navBar: {
    links: [
      {
        title: "Courses",
        link: "/courses",
      },
    ],
  },

  brand: {
    name: "Toq",
    logo: "https://cdn.torqbit.com/static/brand/toq/logo-light.png",
    darkLogo: "https://cdn.torqbit.com/static/brand/toq/logo-dark.png",
    defaultTheme: "light" as Theme,
    themeSwitch: true,
    icon: "https://cdn.torqbit.com/static/brand/toq/logo.png",
    title: "Unified Customer support and education platform",
    description: "One platform to scale support, onboard faster, and reduce repetitive questions.",
    ogImage: "https://cdn.torqbit.com/static/brand/toq/logo.png",
    favicon: "https://cdn.torqbit.com/static/favicon.ico",
    brandColor: "#5b63d3",
    socialLinks: {
      discord: "https://discord.gg/NserMXcx",
      github: "https://github.com/torqbit",
      youtube: "https://www.youtube.com/@torqbit",
    },
  },

  darkMode: true,
  heroSection: {
    title: "One platform to scale support, onboard faster, and reduce repetitive questions.",
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
      lightModePath: "https://cdn.torqbit.com/static/landing/hero-bg.png",
      darkModePath: "https://cdn.torqbit.com/static/landing/hero-bg-dark.png",
      position: "bottom" as bannerAlignment,
    },
  },
  businessInfo: businessConfig,
  sections: {
    courses: {
      enable: false,
      title: "Courses",
      description: "Description for the course list",
    },
    learning: {
      enabled: false,
      title: "Our Learning path",
      description: "Description for the course list",
    },
    blog: {
      enable: false,
      title: "Blogs",
      description: "Description for the blog list",
    },

    faq: {
      title: "FAQ",
      description: "Frequently asked questions by the students",
      items: [
        {
          question: "First question",
          answer: "First answer",
        },
        {
          question: "Second question",
          answer: "Second answer",
        },
        {
          question: "Third question",
          answer: "Third answer",
        },
      ],
      enabled: true,
    },
    testimonials: {
      items: [],
      enabled: true,
      title: "Teachers love our product",
      description: "Find out what excites our users, when using our product",
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
