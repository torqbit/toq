import { useThemeConfig } from "@/components/ContextApi/ThemeConfigContext";

const antThemeConfig = () => {
  const themeConfig = useThemeConfig();

  return {
    token: {
      borderRadius: 4,
      colorText: "#666",
      colorPrimary: `${themeConfig.brand?.brandColor}`,
      colorSplit: "#888",
      colorTextDisabled: "#666",
    },
    components: {
      Layout: {
        bodyBg: "#f5f5f5",
      },

      Badge: {
        colorInfo: `${themeConfig.brand?.brandColor}`,
      },
      Progress: {
        remainingColor: "#666",
        defaultColor: `${themeConfig.brand?.brandColor}`,
      },
      Tree: {
        nodeSelectedBg: "#fff",
        directoryNodeSelectedBg: "#fff",
        directoryNodeSelectedColor: "#000",
      },
      Modal: {
        contentBg: "#f5f5f5",
      },
      Menu: {
        itemColor: "#666",
        itemActiveBg: "#eee",
        itemSelectedBg: "#eee",
        itemSelectedColor: "#000",
        itemBg: "#fff",
      },
      Divider: {
        colorSplit: "#d9d9d9",
      },
      Statistic: {
        contentFontSize: 12,
        titleFontSize: 12,
        marginXXS: 0,
        colorTextDescription: "#000",
      },
      Popover: {
        colorBgElevated: "#fff",

        boxShadowSecondary:
          "0 4px 4px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
      },
      Radio: {
        buttonSolidCheckedActiveBg: "#000",
        buttonSolidCheckedBg: "#000",
        buttonSolidCheckedHoverBg: "#000",
      },
      Sider: {
        color: "#666",
      },
      Card: {
        paddingLG: 20,
        colorBorderSecondary: "#d9d9d9",
      },
      Form: {
        labelColor: "#888",
      },
      Button: {
        groupBorderColor: "#000",
        colorPrimary: `${themeConfig.brand?.brandColor}`,
      },
      Input: {
        borderRadius: 4,
        activeShadow: "none",
      },
      Dropdown: {
        colorPrimary: "#666",
        controlItemBgActive: "#EEE",
        controlItemBgActiveHover: "#dcdcdc",
      },
      Tabs: {
        inkBarColor: "#000",
        itemColor: "#666",
        itemActiveColor: "#000",
        itemSelectedColor: "#000",
        itemHoverColor: "#000",
      },
      Drawer: {
        zIndexPopup: 1001,
        padding: 10,
        footerPaddingInline: 20,
        footerPaddingBlock: 10,
        paddingLG: 20,
      },
      Collapse: {
        contentPadding: "0px",
        headerBg: "#fff",
        paddingSM: 0,
      },
      Segmented: {
        itemSelectedBg: "#fff",
        controlPaddingHorizontal: 30,
        marginSM: 10,
      },
    },
  };
};

export default antThemeConfig;
