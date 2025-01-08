import { FC, useEffect, useState } from "react";
import styles from "./BlogForm.module.scss";
import { Divider, Flex, Form, Input, Switch } from "antd";
import ConfigForm from "@/components/Configuration/ConfigForm";
import { IConfigForm } from "@/components/Configuration/CMS/ContentManagementSystem";
import { PageSiteConfig } from "@/services/siteConstant";
import { IBlogConfig } from "@/types/schema";
const BlogForm: FC<{
  config: PageSiteConfig;
  updateSiteConfig: (config: PageSiteConfig) => void;
}> = ({ updateSiteConfig, config }) => {
  const [blogConfig, setBlogConfig] = useState<IBlogConfig | undefined>(config.sections?.blog);
  useEffect(() => {
    updateSiteConfig({ ...config, sections: { ...config.sections, blog: blogConfig } });
  }, [blogConfig]);

  return (
    <div className={styles.blog__Form__wrapper}>
      <Flex className={styles.disable__switch} align="center" justify="space-between">
        <h5> {config.sections?.blog?.enable ? "Disable blog" : "Enable blog"}</h5>
        <Switch
          size="small"
          value={config.sections?.blog?.enable}
          onChange={(value) => {
            setBlogConfig({ ...blogConfig, enable: !config.sections?.blog?.enable });
          }}
        />
      </Flex>
    </div>
  );
};

export default BlogForm;
