import { PageThemeConfig } from "@/services/themeConstant";
import SvgIcons from "./components/SvgIcons";
import NavBar from "./components/Marketing/LandingPage/NavBar/NavBar";

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
        title: "Blog",
        link: "/blog",
      },
    ],
  },

  brand: {
    name: "Torqbit",
  },

  darkMode: false,
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
      lightPath: "/img/macbook-light.png",
      darkPath: "/img/macbook-dark.png",
      align: "right",
    },
  },
};
export default config;
