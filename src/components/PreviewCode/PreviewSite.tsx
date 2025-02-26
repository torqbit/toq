import { forwardRef, IframeHTMLAttributes, useState } from "react";
import styles from "./PreviewSite.module.scss";
import { PageSiteConfig } from "@/services/siteConstant";
import SvgIcons from "../SvgIcons";
import { Flex, Segmented, Tooltip } from "antd";
import Link from "next/link";
import { PreviewMode } from "@/types/template";
import { isValidImagePath } from "@/lib/utils";
interface PreviewProps extends IframeHTMLAttributes<HTMLIFrameElement> {
  siteConfig: PageSiteConfig;
}
const PreviewSite = forwardRef<HTMLIFrameElement, PreviewProps>((props, ref) => {
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");

  return (
    <section
      className={` ${styles.preview__site__wrapper} ${
        previewMode === "desktop" ? styles.preview__desktop__wrapper : styles.preview__mobile__wrapper
      }`}
    >
      <Flex align="center" justify="center">
        <Segmented
          style={{ width: "fit-content" }}
          onChange={(value: PreviewMode) => setPreviewMode(value)}
          value={previewMode}
          options={[
            {
              label: (
                <Tooltip title={"Desktop mode"}>
                  <i style={{ display: "flex", marginTop: 5 }} className={styles.screen__mode__handler}>
                    {SvgIcons.desktop}
                  </i>
                </Tooltip>
              ),
              value: "desktop",
            },
            {
              label: (
                <Tooltip title={"Mobile mode"}>
                  <i style={{ display: "flex", marginTop: 5 }} className={styles.screen__mode__handler}>
                    {SvgIcons.mobile}
                  </i>
                </Tooltip>
              ),
              value: "mobile",
            },
          ]}
        />
      </Flex>
      <div className={styles.site__preview__container}>
        <div className={styles.site__preview__titlebar}>
          <div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className={styles.tab_wrapper}>
            {isValidImagePath(`${props.siteConfig.brand?.favicon}`) && (
              <img src={props.siteConfig.brand?.favicon} alt="" />
            )}
            <p>
              {props.siteConfig.brand?.name} · {props.siteConfig.brand?.title}
            </p>
            <i>{SvgIcons.xMark}</i>
          </div>
          <Flex align="center" justify="space-between" gap={20} className={styles.new__window__link_wrapper}>
            <p>{process.env.NEXT_PUBLIC_NEXTAUTH_URL}</p>
            <Link target="_blank" href={`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}`}>
              <i>{SvgIcons.newWindow}</i>
            </Link>
          </Flex>
        </div>
        <iframe
          ref={ref}
          loading="lazy"
          style={{ transform: "scale(0.9)", width: "111%" }}
          className={styles.site__preview__iframe}
          src={props.src}
        ></iframe>
      </div>
    </section>
  );
});

export default PreviewSite;
