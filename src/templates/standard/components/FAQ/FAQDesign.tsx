import { FC, useEffect, useState } from "react";
import styles from "./FAQ.module.scss";
import { Button, Flex, Switch } from "antd";
import { PageSiteConfig } from "@/services/siteConstant";
import SvgIcons from "@/components/SvgIcons";
import { useRouter } from "next/router";
const FAQDesign: FC<{
  config: PageSiteConfig;
  updateSiteConfig: (config: PageSiteConfig) => void;
}> = ({ updateSiteConfig, config }) => {
  const router = useRouter();
  return (
    <div className={styles.faq__design__wrapper}>
      <Flex className={styles.disable__switch} align="center" justify="space-between">
        <h5> {config.sections?.faq?.enabled ? "Disable FAQ" : "Enable FAQ"}</h5>
        <Switch
          size="small"
          value={config.sections?.faq?.enabled}
          onChange={(value) => {
            config.sections?.faq &&
              updateSiteConfig({
                ...config,
                sections: {
                  ...config.sections,
                  faq: { ...config.sections?.faq, enabled: value },
                },
              });
          }}
        />
      </Flex>

      {(config.sections?.faq?.items && config.sections?.faq?.items.length === 0) ||
        (!config.sections?.faq?.items && (
          <Flex vertical justify="center">
            <p>No FAQ exists</p>
            <Button
              onClick={() => {
                router.push("/admin/site/content/faq");
              }}
              type="primary"
            >
              <Flex align="center" gap={10}>
                Add FAQ <i style={{ fontSize: 18, lineHeight: 0 }}> {SvgIcons.arrowRight}</i>
              </Flex>
            </Button>
          </Flex>
        ))}
    </div>
  );
};

export default FAQDesign;
