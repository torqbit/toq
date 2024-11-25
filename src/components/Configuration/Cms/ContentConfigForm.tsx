import { FC } from "react";

import styles from "./Cms.module.scss";
import { Form, Input, Segmented } from "antd";

const ContentConfigForm: FC<{
  input?: React.ReactNode;
  title: string;
  divider?: boolean;
  optional?: boolean;
  description: string;
}> = ({ title, description, input, divider, optional }) => {
  return (
    <div className={styles.cms__form} style={{ borderBottom: !divider ? "none" : "" }}>
      <div>
        <h4>
          {title} {optional && <p>Optional</p>}
        </h4>
        <p>{description}</p>
      </div>
      <div>{input}</div>
    </div>
  );
};

export default ContentConfigForm;
