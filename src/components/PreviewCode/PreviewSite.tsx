import { forwardRef, IframeHTMLAttributes } from "react";
import styles from "./PreviewSite.module.scss";

const PreviewSite = forwardRef<HTMLIFrameElement, IframeHTMLAttributes<HTMLIFrameElement>>((props, ref) => {
  return (
    <>
      <div className={styles.site__preview__container}>
        <div className={styles.site__preview__titlebar}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <iframe
          ref={ref}
          loading="lazy"
          style={{ transform: "scale(0.9)", width: "111%" }}
          className={styles.site__preview__iframe}
          {...props}
        ></iframe>
      </div>
    </>
  );
});

export default PreviewSite;
