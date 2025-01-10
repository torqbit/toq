import { Theme } from "@/types/theme";
import { PageSiteConfig } from "./siteConstant";
import { IBrandConfig } from "@/types/schema";

export const themeColors = {
  dark: {
    bgPrimary: "#2c2c2c",
    bgSecondary: "#242424",
    fontPrimary: "#fff",
    fontSecondary: "#b9b9b9",
    colorSplit: "#454545",
  },
  light: {},
};
export const getIconTheme = (
  theme: Theme,
  brand?: IBrandConfig
): { bgColor: string; brandColor: string; fontColor: string } => {
  switch (theme) {
    case "dark":
      return {
        bgColor: themeColors.dark.bgPrimary,
        fontColor: themeColors.dark.fontSecondary,
        brandColor: brand?.brandColor || "blue",
      };
    case "light":
      return {
        bgColor: "#fff",
        fontColor: "#666",
        brandColor: brand?.brandColor || "blue",
      };
    default:
      return {
        bgColor: "#fff",
        fontColor: "#666",
        brandColor: brand?.brandColor || "blue",
      };
  }
};

const darkThemeConfig = (siteConfig: PageSiteConfig) => {
  return {
    token: {
      borderRadius: 4,
      colorText: themeColors.dark.fontSecondary,
      colorBgContainer: "#2c2c2c",
      colorBorder: themeColors.dark.colorSplit,
      colorTextPlaceholder: "#666",
      colorPrimary: `${siteConfig.brand?.brandColor}`,
      colorSplit: themeColors.dark.colorSplit,
      hoverBorderColor: `${siteConfig.brand?.brandColor}`,
      activeBorderColor: `${siteConfig.brand?.brandColor}`,
      colorTextDisabled: themeColors.dark.fontSecondary,
      colorTextDescription: themeColors.dark.fontSecondary,
    },

    Badge: {
      colorInfo: `${siteConfig.brand?.brandColor}`,
    },

    components: {
      Layout: {
        bodyBg: "#242424",
      },
      Steps: {
        colorSplit: themeColors.dark.colorSplit,
      },
      Statistic: {
        contentFontSize: 12,
        titleFontSize: 12,
        marginXXS: 0,
        colorTextDescription: "#fff",
      },
      Progress: {
        remainingColor: "#d4d4d4",
        defaultColor: `${siteConfig.brand?.brandColor}`,
      },
      Tree: {
        nodeSelectedBg: "#2c2c2c",
        directoryNodeSelectedBg: "#2c2c2c",
        directoryNodeSelectedColor: "#fff",
      },
      Menu: {
        itemColor: themeColors.dark.fontSecondary,
        groupTitleColor: "#eee",
        itemActiveBg: "#242424",
        itemSelectedBg: "#242424",
        itemSelectedColor: "#fff",
        itemBg: "#2c2c2c",
      },
      Radio: {
        buttonSolidCheckedActiveBg: "#000",
        buttonSolidCheckedBg: "#000",
        buttonSolidCheckedHoverBg: "#000",
        colorBorder: "#68696d",
      },
      Sider: {
        color: "#666",
      },
      Divider: {
        colorSplit: themeColors.dark.colorSplit,
      },
      Popover: {
        colorBgElevated: "#2c2c2c",
      },
      Card: {
        paddingLG: 20,
        colorBorderSecondary: themeColors.dark.colorSplit,
      },
      Form: {
        labelColor: "#888",
      },
      Button: {
        defaultBg: "#2c2c2c",
        groupBorderColor: "#000",
        colorPrimaryActive: "#fff",
      },
      Input: {
        borderRadius: 4,
        activeShadow: "none",
        activeBg: "#222938",
        hoverBg: "#222938",
        addonBg: "#383e4b",

        colorTextPlaceholder: themeColors.dark.fontSecondary,
        activeBorderColor: themeColors.dark.fontSecondary,
      },

      Select: {
        activeBorderColor: themeColors.dark.fontSecondary,
        optionSelectedColor: themeColors.dark.fontSecondary,
        optionActiveBg: "#242424",
        colorBgContainer: "#2c2c2c",
        colorBgElevated: "#2c2c2c",
        optionSelectedBg: "#242424",
        colorTextPlaceholder: themeColors.dark.fontSecondary,
        activeShadow: "none",
      },

      Dropdown: {
        colorPrimary: "#666",
        controlItemBgActive: "#EEE",
        colorText: themeColors.dark.fontSecondary,
        controlItemBgHover: "#2c2c2c",
        colorBgElevated: "#242424",
        controlItemBgActiveHover: "#dcdcdc",
      },
      List: {
        colorSplit: themeColors.dark.colorSplit,
      },

      Tabs: {
        inkBarColor: "#fff",
        itemColor: themeColors.dark.fontSecondary,
        itemActiveColor: "#fff",
        itemSelectedColor: "#fff",
        itemHoverColor: "#fff",
        cardBg: themeColors.dark.fontSecondary,
      },

      Drawer: {
        zIndexPopup: 1001,
        padding: 10,
        colorIcon: themeColors.dark.fontSecondary,
        footerPaddingInline: 20,
        footerPaddingBlock: 10,
        paddingLG: 20,
        colorBgElevated: "#2c2c2c",
      },
      Tag: {
        defaultBg: themeColors.dark.colorSplit,
        defaultColor: themeColors.dark.fontSecondary,
      },
      Collapse: {
        headerBg: "#2c2c2c",
        colorText: themeColors.dark.fontSecondary,
      },
      Table: {
        colorBgContainer: "#2c2c2c",
        borderColor: themeColors.dark.colorSplit,
        colorText: themeColors.dark.fontSecondary,
        headerSplitColor: "#242424",
      },
      Pagination: {
        colorPrimaryBorder: "#242424",
        colorPrimary: themeColors.dark.fontSecondary,
        colorPrimaryHover: themeColors.dark.fontSecondary,
        colorTextDisabled: themeColors.dark.fontSecondary,
      },
      Carousel: {
        colorBgContainer: `${siteConfig.brand?.brandColor}`,
      },
      Modal: {
        contentBg: "#242424",
        colorIcon: themeColors.dark.fontSecondary,
        headerBg: "#242424",
      },
      Switch: {
        colorPrimaryHover: "#68696d",
      },
      Popconfirm: {
        colorTextHeading: themeColors.dark.fontSecondary,
        colorText: themeColors.dark.fontSecondary,
      },
      Message: {
        contentBg: "#2c2c2c",
      },
      Breadcrumb: {
        itemColor: themeColors.dark.fontSecondary,
        colorBgTextHover: "#000",
        separatorColor: themeColors.dark.fontSecondary,
      },
      Segmented: {
        itemSelectedBg: "#2c2c2c",
        itemHoverColor: "#fff",
        trackBg: "#151823",
        controlPaddingHorizontal: 30,
        itemColor: "#000",
      },
    },
  };
};

export default darkThemeConfig;
