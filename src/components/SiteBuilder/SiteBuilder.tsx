import { FC } from "react";
import styles from "./SiteBuilder.module.scss";
import { Breadcrumb, Collapse, CollapseProps, Flex, Form, Switch } from "antd";
import Link from "next/link";
import SvgIcons from "../SvgIcons";
import { Scrollbars } from "react-custom-scrollbars";
import { PageSiteConfig } from "@/services/siteConstant";
import BrandForm from "./sections/Brand/BrandForm";
import HeroForm from "./sections/Hero/HeroForm";

const SiteBuilder: FC<{
  config: PageSiteConfig;
  updateSiteConfig: (config: PageSiteConfig) => void;
}> = ({ config, updateSiteConfig }) => {
  const [brandForm] = Form.useForm();

  const collapseHeader = (title: string, icon?: React.ReactNode) => {
    return (
      <Flex className={styles.collapse__header} justify="space-between" align="center">
        <Flex align="center" gap={5}>
          <i>{icon}</i>
          <p style={{ margin: 0 }}>{title} </p>
        </Flex>

        <i>{SvgIcons.chevronDown}</i>
      </Flex>
    );
  };
  const items: CollapseProps["items"] = [
    {
      key: "1",
      collapsible: "header",
      children: false,
      label: (
        <div className={styles.darkmode__switch}>
          <p>Enabel Dark mode</p>
          <Switch
            checked={config.darkMode}
            onChange={() => updateSiteConfig({ ...config, darkMode: !config.darkMode })}
          />
        </div>
      ),

      showArrow: false,
    },
    {
      key: "2",
      className: styles.collapse__header,
      label: collapseHeader("Brand Configuration", SvgIcons.pencilEdit),
      children: <BrandForm config={config} form={brandForm} updateSiteConfig={updateSiteConfig} />,
      showArrow: false,
    },
    {
      key: "4",
      className: styles.collapse__header,
      children: <HeroForm config={config} form={brandForm} updateSiteConfig={updateSiteConfig} />,
      showArrow: false,

      label: collapseHeader("Hero", SvgIcons.pencilEdit),
    },
  ];

  return (
    <div className={styles.side__bar__container}>
      <Scrollbars autoHide style={{ width: "300px", height: "100%" }}>
        <Breadcrumb
          className={styles.side__bar__breadcrumb}
          items={[
            {
              title: <Link href={`/admin`}>administration</Link>,
            },
            {
              title: "Design",
            },
          ]}
        />
        <div className={styles.config__sections}>
          <Collapse
            accordion
            className={styles.collapse__wrapper}
            items={items}
            size="middle"
            defaultActiveKey={["1"]}
          />
          ;
        </div>
      </Scrollbars>
    </div>
  );
};

export default SiteBuilder;
