import { FC } from "react";

import styles from "./Cms/Cms.module.scss";
import { Button, Flex, Form, Input, Segmented } from "antd";

const ConfigFormLayout: FC<{
  children?: React.ReactNode;
  formTitle: string;
  extraContent?: React.ReactNode;
}> = ({ children, formTitle, extraContent }) => {
  return (
    <section className={styles.cms__container}>
      <div className={styles.cms__form__header}>
        <h3>{formTitle}</h3>
        {extraContent}
      </div>
      <div>{children}</div>
    </section>
  );
};

export default ConfigFormLayout;
