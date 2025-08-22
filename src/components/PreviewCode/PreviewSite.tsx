import { forwardRef, IframeHTMLAttributes, useRef, useState } from "react";
import styles from "./PreviewSite.module.scss";
import { PageSiteConfig } from "@/services/siteConstant";
import SvgIcons from "../SvgIcons";
import { Flex, Segmented, Tooltip } from "antd";
import Link from "next/link";
import { PreviewMode } from "@/types/template";
import { isValidImagePath } from "@/lib/utils";
interface PreviewProps extends IframeHTMLAttributes<HTMLIFrameElement> {
  siteConfig: PageSiteConfig;
  hostUrl: string;
  overlay: boolean;
  width?: string;
}
const PreviewSite = forwardRef<HTMLIFrameElement, PreviewProps>((props, ref) => {
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");

  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <section
      style={{ height: "calc(100vh - 20px)" }}
      className={` ${styles.preview__site__wrapper}
      
      ${previewMode === "desktop" ? `${styles.preview__desktop__wrapper}` : styles.preview__mobile__wrapper}`}
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
      <div className={styles.site__preview__container} style={{ position: "relative" }}>
        <div className={`${styles.site__preview__titlebar} ${props.width ? props.width : " md:w-[calc(100vw-400px)]"}`}>
          <div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className={styles.tab_wrapper}>
            <Flex align="center" gap={5} style={{ width: "100%" }}>
              {isValidImagePath(`${props.siteConfig.brand?.favicon}`) && (
                <img src={props.siteConfig.brand?.favicon} alt="" />
              )}
              <p>
                {props.siteConfig.brand?.name} · {props.siteConfig.brand?.title}
              </p>
            </Flex>
            <i>{SvgIcons.xMark}</i>
          </div>
          <Flex align="center" justify="space-between" gap={20} className={styles.new__window__link_wrapper}>
            <p>{props.hostUrl}</p>
            <Link target="_blank" href={`${props.hostUrl}`}>
              <i>{SvgIcons.newWindow}</i>
            </Link>
          </Flex>
        </div>
        <div style={{ position: "relative" }}>
          <iframe
            ref={ref}
            loading="lazy"
            style={{ transform: "scale(0.9)", width: "111%" }}
            className={styles.site__preview__iframe}
            src={props.src}
          ></iframe>
        </div>
      </div>
    </section>
  );
});

export default PreviewSite;
