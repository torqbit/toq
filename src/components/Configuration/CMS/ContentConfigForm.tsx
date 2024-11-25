import { FC } from "react";

import styles from "./CMS.module.scss";
import { ICmsForm } from "./ContentManagementSystem";

const ContentConfigForm: FC<ICmsForm> = ({ title, description, input, divider, optional }) => {
  return (
    <div className={styles.cms__form} style={{ borderBottom: !divider ? "none" : "" }}>
      <div>
        <h5>
          {title} {optional && <p>Optional</p>}
        </h5>
        <p>{description}</p>
      </div>
      <div>{input}</div>
    </div>
  );
};

export default ContentConfigForm;
