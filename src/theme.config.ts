import { PageThemeConfig } from "@/services/themeConstant";
import SvgIcons from "./components/SvgIcons";

const config: PageThemeConfig = {
  navBar: {
    navigationLinks: [
      {
        title: "first",
        link: "/",
      },
      {
        title: "second",
        link: "/",
      },
    ],
  },
  brand: {
    name: "Mehrab",
    logo: SvgIcons.sun,
  },
};

export default config;
