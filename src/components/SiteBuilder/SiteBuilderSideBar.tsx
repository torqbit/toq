import { FC } from "react";
import styles from "./SiteBuilderSideBar.module.scss";
import { Breadcrumb, Collapse, CollapseProps, Flex, Form } from "antd";
import Link from "next/link";

import SvgIcons from "../SvgIcons";
import Brand from "./sections/Brand/Brand";
import { Scrollbars } from "react-custom-scrollbars";
import { PageSiteConfig } from "@/services/siteConstant";

const SiteBuilderSideBar: FC<{ config: PageSiteConfig; OnUpdateConfig: (info: string, key: string) => void }> = ({
  config,
  OnUpdateConfig,
}) => {
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
      className: styles.collapse__header,
      label: collapseHeader("Brand Configuration", SvgIcons.pencilEdit),
      children: <Brand config={config} form={brandForm} onUpdateBrandInfo={OnUpdateConfig} />,
      showArrow: false,
    },
    {
      key: "2",
      className: styles.collapse__header,
      showArrow: false,

      label: collapseHeader("this is "),
      children: <p>this is children</p>,
    },
    {
      key: "3",
      className: styles.collapse__header,
      showArrow: false,

      label: collapseHeader("this is "),
      children: <p>this is children</p>,
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
          <Collapse className={styles.collapse__wrapper} items={items} size="middle" defaultActiveKey={["1"]} />;
        </div>
      </Scrollbars>
    </div>
  );
};

export default SiteBuilderSideBar;
