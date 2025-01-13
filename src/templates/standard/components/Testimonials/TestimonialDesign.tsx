import { FC, useEffect, useState } from "react";
import styles from "./Testimonials.module.scss";
import { Button, Flex, Switch } from "antd";
import { PageSiteConfig } from "@/services/siteConstant";
import SvgIcons from "@/components/SvgIcons";
import { useRouter } from "next/router";
const TestimonialDesign: FC<{
  config: PageSiteConfig;
  updateSiteConfig: (config: PageSiteConfig) => void;
}> = ({ updateSiteConfig, config }) => {
  const router = useRouter();
  return (
    <div className={styles.testimonial__design__wrapper}>
      <Flex className={styles.disable__switch} align="center" justify="space-between">
        <h5> {config.sections?.testimonials?.enabled ? "Disable Testimonials" : "Enable Testimonials"}</h5>
        <Switch
          size="small"
          value={config.sections?.testimonials?.enabled}
          onChange={(value) => {
            config.sections?.testimonials &&
              updateSiteConfig({
                ...config,
                sections: {
                  ...config.sections,
                  testimonials: {
                    ...config.sections.testimonials,
                    enabled: !config.sections.testimonials.enabled,
                  },
                },
              });
          }}
        />
      </Flex>

      {(config.sections?.testimonials?.items === null || config.sections?.testimonials?.items?.length === 0) && (
        <Flex vertical justify="center" style={{ textAlign: "center" }}>
          <p>No Testimonials exists</p>
          <Button
            onClick={() => {
              router.push("/admin/site/content/testimonials");
            }}
            type="primary"
          >
            <Flex align="center" gap={10}>
              Add Testimonials
              <i style={{ fontSize: 18, lineHeight: 0 }}> {SvgIcons.arrowRight}</i>
            </Flex>
          </Button>
        </Flex>
      )}
    </div>
  );
};

export default TestimonialDesign;
