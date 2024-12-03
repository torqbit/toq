import { FC } from "react";

import styles from "./CMS/CMS.module.scss";
import { IConfigForm } from "./CMS/ContentManagementSystem";
import { Flex } from "antd";

const ContentConfigForm: FC<IConfigForm> = ({ title, description, input, divider, optional, layout }) => {
  return (
    <div
      className={styles.cms__form}
      style={{
        borderBottom: !divider ? "none" : "",
        display: "flex",
        flexDirection: layout && layout === "vertical" ? "column" : "row",
        gap: layout && layout === "vertical" ? "0px" : "40px",
      }}
    >
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
