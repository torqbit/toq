import { FC, ReactNode } from "react";

import styles from "./cms.module.scss";
import { Divider, Flex } from "antd";

export interface IConfigForm {
  title: string;
  description: string;
  input: ReactNode;
  optional?: boolean;
  divider?: boolean;
  layout?: "vertical" | "horizontal";
  inputName?: string;
}

export interface IConfigInput {
  title: string;
  description: string;
  input: ReactNode;
  inputName: string;
  optional?: boolean;
}

export const ConfigFormItem: FC<IConfigForm> = ({ title, description, input, divider, optional, layout }) => {
  return (
    <>
      <div
        className={styles.cms__form}
        style={{
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

      {divider && <Divider style={{ margin: "15px 0px" }} />}
    </>
  );
};

export default ConfigFormItem;
