import { FC } from "react";

import styles from "./CMS/CMS.module.scss";
import { Collapse } from "antd";

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
  width = "1000px",
  marginBottom,
  showArrow = true,
}) => {
  return (
    <section className={styles.cms__container} style={{ width, marginBottom }}>
      <Collapse
        style={{ borderRadius: 4 }}
        defaultActiveKey={[formTitle]}
        collapsible={isCollapsible ? "header" : "icon"}
        items={[
          {
            headerClass: styles.header__wrapper__collapse,
            key: formTitle,
            extra: extraContent,
            label: <h4 style={{ margin: 0 }}>{formTitle}</h4>,
            children: children,
            showArrow: showArrow,
          },
        ]}
      />
    </section>
  );
};

export default ConfigFormLayout;
