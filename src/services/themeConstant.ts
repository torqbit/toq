import { ThemeSchema } from "@/types/schema";
import { lazy } from "react";
const NavBar = lazy(() => import("@/components/Marketing/LandingPage/NavBar"));
import { string } from "zod";

export type PageThemeConfig = ThemeSchema;

export const DEFAULT_THEME: PageThemeConfig = {
  navBar: {
    component: NavBar,
  },
  platformName: "Torqbit",
  logo: "/icon/torqbit.png",
  navigationLinks: [
    {
      title: "Courses",
      link: "/#courses",
    },
    {
      title: "Events",
      link: "/events",
    },
    {
      title: "Blogs",
      link: "/blogs",
    },
  ],
  darkMode: false,
};

export const DEEP_OBJECT_KEYS = Object.entries(DEFAULT_THEME)
  .map(([key, value]) => {
    const isObject = value && typeof value === "object" && !Array.isArray(value);
    if (isObject) {
      return key;
    }
  })
  .filter(Boolean);
