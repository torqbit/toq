import { forwardRef, IframeHTMLAttributes } from "react";
import styles from "./PreviewSite.module.scss";
import { PageSiteConfig } from "@/services/siteConstant";
import SvgIcons from "../SvgIcons";
interface PreviewProps extends IframeHTMLAttributes<HTMLIFrameElement> {
  siteConfig: PageSiteConfig;
}
const PreviewSite = forwardRef<HTMLIFrameElement, PreviewProps>((props, ref) => {
  return (
    <>
      <div className={styles.site__preview__container}>
        <div className={styles.site__preview__titlebar}>
          <div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className={styles.tab_wrapper}>
            {props.siteConfig.brand?.favicon && <img src={props.siteConfig.brand?.favicon} alt="" />}
            <p>
              {props.siteConfig.brand?.name} · {props.siteConfig.brand?.title}
            </p>
            <i>{SvgIcons.xMark}</i>
          </div>
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
