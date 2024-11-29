import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import { User } from "@prisma/client";
import { FC, useEffect, useRef } from "react";
import Frame from "react-frame-component";

import { GetServerSidePropsContext, NextPage } from "next";
import StandardTemplate from "@/templates/standard/StandardTemplate";
import { getSiteConfig } from "@/services/getSiteConfig";
import { useSession } from "next-auth/react";
import App from "../_app";
interface IStandardTemplateProps {
  user: User;
  siteConfig: PageSiteConfig;
}

const IframeComponent: FC<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    // This ensures that the iframe's document is loaded
    const iframe = iframeRef.current;

    if (iframe) {
      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

      // Ensure styles are correctly applied in the iframe
      const inlineStyleNodes = document.querySelectorAll("style");
      inlineStyleNodes.forEach((styleNode) => {
        iframeDocument.head.appendChild(styleNode.cloneNode(true));
      });
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
      stylesheets.forEach((style) => {
        const clone = style.cloneNode();
        iframeDocument.head.appendChild(clone);
      });

      // Optionally, you can inject external or internal CSS into the iframe
    }
  }, []);

  return (
    <Frame ref={iframeRef} initialContent='<!DOCTYPE html><html><head></head><body><div></div></body></html>' width={1400} height={600}>
      <StandardTemplate siteConfig={siteConfig} />
    </Frame>
  );
};
const PreviewPage: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const { data: user } = useSession();

  return (
    <div>
      <h2>Hello its an iframe</h2>
      <IframeComponent siteConfig={siteConfig} />
    </div>
  );
};

export default PreviewPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const siteConfig = getSiteConfig();
  const { site } = siteConfig;
  return {
    props: {
      siteConfig: site,
    },
  };
};
