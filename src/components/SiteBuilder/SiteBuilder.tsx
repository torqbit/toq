import { FC } from "react";
import styles from "./SiteBuilder.module.scss";
import { Breadcrumb, Collapse, CollapseProps, Flex, Form, Switch } from "antd";
import Link from "next/link";
import SvgIcons from "../SvgIcons";
import { Scrollbars } from "react-custom-scrollbars";
import { PageSiteConfig } from "@/services/siteConstant";
import BrandForm from "./sections/Brand/BrandForm";
import HeroForm from "./sections/Hero/HeroForm";
import FeatureForm from "./sections/Feature/FeatureForm";
import CourseForm from "./sections/Courses/CourseForm";
import DisableText from "./DisableText/DisableText";
import { setConfig } from "isomorphic-dompurify";
import BlogForm from "./sections/Blog/BlogForm";

const SiteBuilder: FC<{
  config: PageSiteConfig;
  updateSiteConfig: (config: PageSiteConfig) => void;
}> = ({ config, updateSiteConfig }) => {
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

  return (
    <div className={styles.side__bar__container}>
      {/* <Scrollbars  autoHide style={{ width: "300px", height: "100%", overflow: "hidden" }}> */}
      <Breadcrumb
        className={styles.side__bar__breadcrumb}
        items={[
          {
            title: <Link href={`/admin`}>Administration</Link>,
          },
          {
            title: "Design",
          },
        ]}
      />

      <div className={styles.config__sections}>
        <div className={styles.darkmode__switch}>
          <p>Show Theme</p>
          <Switch
            size="small"
            className={styles.switch}
            checked={config.darkMode}
            onChange={() => updateSiteConfig({ ...config, darkMode: !config.darkMode })}
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
      {/* </Scrollbars> */}
    </div>
  );
};

export default SiteBuilder;
