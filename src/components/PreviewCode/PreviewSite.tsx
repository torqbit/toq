import { FC, forwardRef, useEffect } from "react";
import styles from "./PreviewSite.module.scss";

const PreviewSite = forwardRef<HTMLIFrameElement>((props, ref) => {
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
          className={styles.site__preview__iframe}
          src={`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/admin/site/preview`}
        ></iframe>
      </div>
    </>
  );
});

export default PreviewSite;
