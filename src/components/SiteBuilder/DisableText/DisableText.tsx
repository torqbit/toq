import { FC } from "react";

import styles from "./Disable.module.scss";
import { Switch } from "antd";
const DisableText: FC<{ text: string; onTriggerSwitch: (value: boolean) => void; value?: boolean }> = ({
  text,
  value,
  onTriggerSwitch,
}) => {
  return (
    <div className={styles.disable__text}>
      <Switch
        onChange={(value) => {
          onTriggerSwitch(true);
        }}
      />
      <p>{text}</p>
    </div>
  );
};
export default DisableText;
