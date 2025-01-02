import { FC } from "react";

import styles from "./CMS/CMS.module.scss";
import { Button, Flex, Form, Input, Segmented } from "antd";

const ConfigFormLayout: FC<{
  children?: React.ReactNode;
  formTitle: string;
  extraContent?: React.ReactNode;
  width?: string;
}> = ({ children, formTitle, extraContent, width = "1000px" }) => {
  return (
    <section
      className={styles.cms__container}
      style={{
        width: width,
      }}
    >
      <div className={styles.cms__form__header}>
        <h4>{formTitle}</h4>
        {extraContent}
      </div>
      <div>{children}</div>
    </section>
  );
};

export default ConfigFormLayout;
