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
  const [enable, setEnable] = useState<boolean | undefined>(config.sections?.testimonials?.enabled);
  const router = useRouter();
  useEffect(() => {
    config.sections?.testimonials?.items &&
      config.sections.testimonials.items.length > 0 &&
      updateSiteConfig({
        ...config,
        sections: {
          ...config.sections,
          testimonials: { ...config.sections?.testimonials, enabled: !enable },
        },
      });
  }, [enable]);
  return (
    <div className={styles.testimonial__design__wrapper}>
      {config.sections?.testimonials?.items && config.sections?.testimonials?.items.length === 0 ? (
        <Flex vertical justify="center">
          <p>No Testimonials exists</p>
          <Button
            onClick={() => {
              router.push("/admin/site/content/testimonials");
            }}
            type="primary"
          >
            <Flex align="center" gap={10}>
              Add Testimonials
              <i>{SvgIcons.arrowRight}</i>
            </Flex>
          </Button>
        </Flex>
      ) : (
        <Flex className={styles.disable__switch} align="center" justify="space-between">
          <h5> {config.sections?.testimonials?.enabled ? "Disable Testimonials" : "Enable Testimonials"}</h5>
          <Switch
            size="small"
            value={config.sections?.testimonials?.enabled}
            onChange={(value) => {
              setEnable(!enable);
            }}
          />
        </Flex>
      )}
    </div>
  );
};

export default TestimonialDesign;
