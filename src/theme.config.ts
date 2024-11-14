import { PageThemeConfig } from "@/services/themeConstant";
import SvgIcons from "./components/SvgIcons";
import NavBar from "./components/Marketing/LandingPage/NavBar";

const config: PageThemeConfig = {
  navBar: {
    component: NavBar,
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
  },

  brand: {
    name: "Torqbit",
    logo: "/icon/torqbit.png",
  },

  darkMode: false,
};
export default config;
