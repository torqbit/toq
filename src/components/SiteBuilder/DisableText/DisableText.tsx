import { FC } from "react";

import styles from "./Disable.module.scss";
const DisableText: FC<{ text: string }> = ({ text }) => {
  return (
    <div className={styles.disable__text}>
      <p>{text}</p>
    </div>
  );
};
export default DisableText;
