import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import { useEffect, useState } from "react";
import { getFetch } from "@/services/request";
import { Button } from "antd";
import Blank, { OverlapNumber } from "@/components/Layouts/Blank";
import { useRouter } from "next/router";
import React, { FC } from "react";

const NotFoundPage: FC = () => {
  const router = useRouter();
  const [siteConfig, setSiteConfig] = useState<PageSiteConfig>();
  const getSiteConfig = async () => {
    const res = await getFetch("/api/v1/admin/site/site-info/get");
    const result = await res.json();
    if (res.status == 200) {
      setSiteConfig(result.siteConfig);
    }
  };

  useEffect(() => {
    getSiteConfig();
  }, []);
  return (
    <section>
      <Blank siteConfig={siteConfig || DEFAULT_THEME}>
        <div style={{ textAlign: "center" }}>
          <OverlapNumber number={404} />
          <h1>{router.query.error == "siteNotFound" ? "Site" : "Page"} Not Found</h1>

          <p>The {router.query.error == "siteNotFound" ? "site" : "Page"} you are looking for is not available</p>
          <Button
            type="primary"
            onClick={() =>
              router.push(router.query.error == "siteNotFound" ? `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}` : "/")
            }
          >
            Go Back to Home
          </Button>
        </div>
      </Blank>
    </section>
  );
};
export default NotFoundPage;
