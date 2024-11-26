import { FC } from "react";

import styles from "./CMS.module.scss";
import { ICmsForm } from "./ContentManagementSystem";
import { Flex } from "antd";

const ContentConfigForm: FC<ICmsForm> = ({ title, description, input, divider, optional }) => {
  return (
    <div className={styles.cms__form} style={{ borderBottom: !divider ? "none" : "" }}>
      <div>
        <Flex align="center" gap={10}>
          <h5>{title}</h5>

          {optional && <p>Optional</p>}
        </Flex>

        <p>{description}</p>
      </div>
      <div>{input}</div>
    </div>
  );
};

export default ContentConfigForm;
