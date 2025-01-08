import { FC } from "react";
import styles from "./features.module.scss";
import Link from "next/link";
import { IFeatureCard } from "@/types/landing/feature";
import { Flex, Skeleton, Switch } from "antd";
import { PageSiteConfig } from "@/services/siteConstant";

const FeaturesLayout: FC<{ config: PageSiteConfig; updateSiteConfig: (value: PageSiteConfig) => void }> = ({
  config,
  updateSiteConfig,
}) => {
  return (
    <section className={styles.features__layout_container}>
      <Flex className={styles.disable__switch} align="center" justify="space-between">
        <h5> {config.sections?.features?.enabled ? "Disable Features" : "Enable Features"}</h5>
        <Switch
          size="small"
          value={config.sections?.features?.enabled}
          onChange={(value) => {
            config.sections?.features &&
              updateSiteConfig({
                ...config,
                sections: {
                  ...config.sections,
                  features: {
                    ...config.sections.features,
                    enabled: !config.sections.features.enabled,
                  },
                },
              });
          }}
        />
      </Flex>
    </section>
  );
};

export default FeaturesLayout;
