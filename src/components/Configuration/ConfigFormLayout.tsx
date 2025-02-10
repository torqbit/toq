import { FC, useEffect } from "react";

import styles from "./CMS/CMS.module.scss";
import { Collapse } from "antd";
import SvgIcons from "../SvgIcons";
import { CaretRightOutlined, RightOutlined } from "@ant-design/icons";

const ConfigFormLayout: FC<{
  children?: React.ReactNode;
  formTitle: string;
  extraContent?: React.ReactNode;
  isCollapsible?: boolean;
  width?: string;
  marginBottom?: string;
  showArrow?: boolean;
}> = ({
  children,
  formTitle,
  extraContent,
  isCollapsible = false,
  width = "1200px",
  marginBottom,
  showArrow = true,
}) => {
  return (
    <section className={`${styles.cms__container} ${styles.question_card}`} style={{ width, marginBottom }}>
      <Collapse
        style={{ borderRadius: 4 }}
        defaultActiveKey={[isCollapsible ? "" : formTitle]}
        collapsible={isCollapsible ? "header" : "icon"}
        items={[
          {
            key: formTitle,
            label: <h4 style={{ margin: 0 }}>{formTitle}</h4>,
            headerClass: styles.collapse__header__wrapper,
            children: children,
            extra: extraContent,
            showArrow: isCollapsible,
          },
        ]}
      />
    </section>
  );
};

export default ConfigFormLayout;
