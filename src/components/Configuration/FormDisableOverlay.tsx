import { FC } from "react";
import styles from "./CMS/CMS.module.scss";

const FormDisableOverlay: FC<{ message?: string }> = ({ message = "First complete the previous step" }) => {
  return (
    <div className={styles.form__disabled__overlay}>
      <h4>{message}</h4>
    </div>
  );
};

export default FormDisableOverlay;
