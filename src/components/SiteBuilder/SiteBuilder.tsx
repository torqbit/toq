import { FC, useEffect } from "react";
import styles from "./SiteBuilder.module.scss";
import { Breadcrumb, Collapse, CollapseProps, Flex, Form, Segmented, Switch } from "antd";
import SvgIcons from "../SvgIcons";

import { PageSiteConfig } from "@/services/siteConstant";
import BrandForm from "./sections/Brand/BrandForm";
import HeroForm from "./sections/Hero/HeroForm";
import FeatureForm from "./sections/Feature/FeatureForm";
import CourseForm from "./sections/Courses/CourseForm";
import BlogForm from "./sections/Blog/BlogForm";
import { Theme } from "@/types/theme";
import { useAppContext } from "../ContextApi/AppContext";

const SiteBuilder: FC<{
  config: PageSiteConfig;
  updateSiteConfig: (config: PageSiteConfig) => void;
}> = ({ config, updateSiteConfig }) => {
  const { dispatch } = useAppContext();
  const collapseHeader = (title: string, icon?: React.ReactNode) => {
    return (
      <Flex className={styles.collapse__header} justify="space-between" align="center">
        <Flex align="center" gap={5}>
          <i>{icon}</i>
          <p style={{ margin: 0 }}>{title} </p>
        </Flex>
      </Flex>
    );
  };

  const items: CollapseProps["items"] = [
    {
      key: "1",
      className: styles.collapse__header,
      label: collapseHeader("Brand Configuration", SvgIcons.brand),
      children: <BrandForm config={config} updateSiteConfig={updateSiteConfig} />,
    },
    {
      key: "2",
      className: styles.collapse__header,
      children: <HeroForm config={config} updateSiteConfig={updateSiteConfig} />,

      label: collapseHeader("Hero", SvgIcons.hero),
    },
    {
      key: "3",
      className: styles.collapse__header,
      children: <FeatureForm config={config} updateSiteConfig={updateSiteConfig} />,

      label: collapseHeader("Feature", SvgIcons.features),
    },
    {
      key: "4",
      className: styles.collapse__header,

      children: (
        <>
          <CourseForm config={config} updateSiteConfig={updateSiteConfig} />
        </>
      ),

      label: collapseHeader("Courses", SvgIcons.courseConfig),
    },
    {
      key: "5",
      className: styles.collapse__header,

      children: (
        <>
          <BlogForm config={config} updateSiteConfig={updateSiteConfig} />
        </>
      ),

      label: collapseHeader("Blog", SvgIcons.blog),
    },
  ];

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

  return (
    <div className={styles.side__bar__container}>
      <h4 style={{ padding: "10px 20px" }}>Site Design</h4>

      <div className={styles.config__sections}>
        <div className={styles.darkmode__switch}>
          <p>Show Theme</p>
          <Switch
            size="small"
            className={styles.switch}
            checked={config.brand?.themeSwitch}
            onChange={() =>
              updateSiteConfig({ ...config, brand: { ...config.brand, themeSwitch: !config.brand?.themeSwitch } })
            }
          />
        </div>

        <div className={styles.darkmode__switch}>
          <p>Default Theme</p>
          <Segmented
            className={`${styles.segment} `}
            defaultValue={config.brand?.defaultTheme}
            size="small"
            options={[
              { label: "Dark", value: "dark" },
              { label: "Light", value: "light" },
            ]}
            onChange={(value: Theme) => {
              onCheckTheme(value);
            }}
          />
        </div>
        <Collapse
          accordion
          expandIconPosition="end"
          className={styles.collapse__wrapper}
          items={items}
          size="middle"
          defaultActiveKey={["1"]}
        />
      </div>
    </div>
  );
};

export default SiteBuilder;
