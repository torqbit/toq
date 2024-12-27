import { FC, useEffect } from "react";
import styles from "./SiteBuilder.module.scss";
import { Flex, Menu, MenuProps, Tabs, TabsProps } from "antd";
import SvgIcons from "../SvgIcons";

import { PageSiteConfig } from "@/services/siteConstant";

import { Theme } from "@/types/theme";
import { useAppContext } from "../ContextApi/AppContext";
import Link from "next/link";
import SiteDesign from "./Design";

const SiteBuilder: FC<{
  config: PageSiteConfig;
  selectedTab: string;
  contentMenu: MenuProps["items"];
  selectedMenu: string;
  setSelectedMenu: (value: string) => void;
  onChangeTab: (value: string) => void;
  updateSiteConfig: (config: PageSiteConfig) => void;
}> = ({ config, updateSiteConfig, onChangeTab, selectedTab, selectedMenu, setSelectedMenu, contentMenu }) => {
  const { dispatch } = useAppContext();

  const onCheckTheme = (theme: Theme) => {
    if (theme === "dark") {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }

    dispatch({
      type: "SWITCH_THEME",
      payload: theme,
    });
    updateSiteConfig({ ...config, brand: { ...config.brand, defaultTheme: theme } });
  };

  useEffect(() => {
    config.brand?.defaultTheme && onCheckTheme(config.brand?.defaultTheme);
  }, []);

  const Tabitems: TabsProps["items"] = [
    {
      key: "design",
      label: "Design",
      children: <SiteDesign onCheckTheme={onCheckTheme} updateSiteConfig={updateSiteConfig} config={config} />,
    },
    {
      key: "content",
      label: "Content",

      children: (
        <Menu
          mode="inline"
          onSelect={({ key }) => setSelectedMenu(key)}
          defaultSelectedKeys={["dashboard"]}
          selectedKeys={[selectedMenu]}
          style={{ width: "100%", borderInlineEnd: "none" }}
          items={contentMenu}
        />
      ),
    },
  ];

  return (
    <div className={styles.side__bar__container}>
      <Flex align="center" justify="space-between">
        <h4 style={{ padding: "10px 20px" }}>Site</h4>
        <Link className={styles.go_back_btn} href={"/dashboard"}>
          <i>{SvgIcons.arrowLeft}</i>
          <p>Go Back</p>
        </Link>
      </Flex>

      <Tabs
        tabBarGutter={40}
        tabBarStyle={{ padding: "0px 20px" }}
        activeKey={selectedTab}
        className={styles.site_config_tabs}
        items={Tabitems}
        onChange={onChangeTab}
      />
    </div>
  );
};

export default SiteBuilder;
