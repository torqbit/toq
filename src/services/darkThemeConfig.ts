import { Theme } from "@/types/theme";
import { PageSiteConfig } from "./siteConstant";
import { IBrandConfig } from "@/types/schema";

export const themeColors = {
  commons: {
    success: "#1f883d",
  },
  dark: {
    bgPrimary: "#2c2c2c",
    bgSecondary: "#242424",
    fontPrimary: "#fff",
    fontSecondary: "#b9b9b9",
    fontPlaceholder: "#686868",
    colorSplit: "#454545",
    bgTertiary: "#131313",
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
      colorBgContainer: themeColors.dark.bgPrimary,
      colorBorder: themeColors.dark.colorSplit,
      colorTextPlaceholder: themeColors.dark.fontPlaceholder,
      colorPrimary: `${siteConfig.brand?.brandColor}`,
      colorSplit: themeColors.dark.colorSplit,
      hoverBorderColor: `${siteConfig.brand?.brandColor}`,
      activeBorderColor: `${siteConfig.brand?.brandColor}`,
      colorTextDisabled: themeColors.dark.fontSecondary,
      colorTextDescription: themeColors.dark.fontSecondary,
      colorLink: `${siteConfig.brand?.brandColor}`,
    },

    Badge: {
      colorInfo: `${siteConfig.brand?.brandColor}`,
    },

    components: {
      Layout: {
        bodyBg: themeColors.dark.bgSecondary,
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
        nodeSelectedBg: themeColors.dark.bgPrimary,
        directoryNodeSelectedBg: themeColors.dark.bgPrimary,
        directoryNodeSelectedColor: "#fff",
      },
      Menu: {
        itemColor: themeColors.dark.fontSecondary,
        groupTitleColor: "#eee",
        itemActiveBg: themeColors.dark.bgSecondary,
        itemSelectedBg: themeColors.dark.bgSecondary,
        itemSelectedColor: "#fff",
        itemBg: themeColors.dark.bgPrimary,
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
        colorBgElevated: themeColors.dark.bgPrimary,
      },
      Card: {
        paddingLG: 20,
        colorBorderSecondary: themeColors.dark.colorSplit,
      },
      Form: {
        labelColor: "#888",
      },
      Button: {
        defaultBg: themeColors.dark.bgPrimary,
        groupBorderColor: "#000",
        colorPrimaryActive: "#fff",
      },
      Notification: {
        colorBgElevated: themeColors.dark.bgPrimary,
      },
      Input: {
        borderRadius: 4,
        activeShadow: "none",
        activeBg: themeColors.dark.bgTertiary,
        hoverBg: themeColors.dark.bgSecondary,
        colorIcon: themeColors.dark.fontPlaceholder,
        addonBg: "#383e4b",
        colorTextPlaceholder: themeColors.dark.fontPlaceholder,
        activeBorderColor: themeColors.dark.fontSecondary,
      },

      Select: {
        activeBorderColor: themeColors.dark.fontSecondary,
        optionSelectedColor: themeColors.dark.fontSecondary,
        optionActiveBg: themeColors.dark.bgSecondary,
        colorFillSecondary: themeColors.dark.fontPlaceholder,
        colorBgContainer: themeColors.dark.bgPrimary,
        colorBgElevated: themeColors.dark.bgPrimary,
        colorIcon: themeColors.dark.fontSecondary,
        optionSelectedBg: themeColors.dark.bgTertiary,
        colorTextPlaceholder: themeColors.dark.fontSecondary,
        activeShadow: "none",
      },

      Dropdown: {
        colorPrimary: "#666",
        controlItemBgActive: "#EEE",
        colorText: themeColors.dark.fontSecondary,
        controlItemBgHover: themeColors.dark.bgPrimary,
        colorBgElevated: themeColors.dark.bgSecondary,
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
        colorBgElevated: themeColors.dark.bgPrimary,
      },
      Tag: {
        defaultBg: themeColors.dark.colorSplit,
        defaultColor: themeColors.dark.fontSecondary,
      },
      Collapse: {
        headerBg: themeColors.dark.bgPrimary,
        colorText: themeColors.dark.fontSecondary,
      },
      Table: {
        colorBgContainer: themeColors.dark.bgPrimary,
        borderColor: themeColors.dark.colorSplit,
        colorText: themeColors.dark.fontSecondary,
        headerSplitColor: themeColors.dark.bgSecondary,
      },
      Pagination: {
        colorPrimaryBorder: themeColors.dark.bgSecondary,
        colorPrimary: themeColors.dark.fontSecondary,
        colorPrimaryHover: themeColors.dark.fontSecondary,
        colorTextDisabled: themeColors.dark.fontSecondary,
      },
      Carousel: {
        colorBgContainer: `${siteConfig.brand?.brandColor}`,
      },
      Modal: {
        contentBg: themeColors.dark.bgSecondary,
        colorIcon: themeColors.dark.fontSecondary,
        headerBg: themeColors.dark.bgSecondary,
      },
      Switch: {
        colorPrimaryHover: "#68696d",
      },
      Popconfirm: {
        colorTextHeading: themeColors.dark.fontSecondary,
        colorText: themeColors.dark.fontSecondary,
      },
      Message: {
        contentBg: themeColors.dark.bgPrimary,
      },
      Breadcrumb: {
        itemColor: themeColors.dark.fontSecondary,
        colorBgTextHover: "#000",
        separatorColor: themeColors.dark.fontSecondary,
      },
      Segmented: {
        itemSelectedBg: themeColors.dark.bgPrimary,
        itemHoverColor: "#fff",
        trackBg: themeColors.dark.bgTertiary,
        controlPaddingHorizontal: 30,
        itemColor: themeColors.dark.fontSecondary,
      },
    },
  };
};

export default darkThemeConfig;
