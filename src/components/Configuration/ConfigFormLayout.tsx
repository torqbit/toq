import { FC } from "react";

import styles from "./CMS/CMS.module.scss";
import { Button, Flex, Form, Input, Segmented } from "antd";

const ConfigFormLayout: FC<{
  children?: React.ReactNode;
  formTitle: string;
  extraContent?: React.ReactNode;
}> = ({ children, formTitle, extraContent }) => {
  return (
    <section className={styles.cms__container}>
      <div className={styles.cms__form__header}>
        <h4>{formTitle}</h4>
        {extraContent}
      </div>
      <div>{children}</div>
    </section>
  );
};

export default ConfigFormLayout;
