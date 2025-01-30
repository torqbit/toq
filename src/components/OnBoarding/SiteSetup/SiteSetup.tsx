import { FC } from "react";
import styles from "./SiteSetup.module.scss";
import { PageSiteConfig } from "@/services/siteConstant";
import Link from "next/link";
import { ISiteSetupCard } from "@/types/setup/siteSetup";
import PreviewSite from "@/components/PreviewCode/PreviewSite";
const SetupOptionCard: FC<ISiteSetupCard> = ({ icon, title, description, link, iconBgColor }) => (
  <Link href={link} className={`${styles.setup__card} `}>
    <div style={{ backgroundColor: iconBgColor ? iconBgColor : "transparent" }}>
      <img alt={title} aria-label={`icon for ${title.toLowerCase()}`} src={icon} />
    </div>
    <div>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  </Link>
);

const SiteSetup: FC<{ siteConfig: PageSiteConfig; setupOptions: ISiteSetupCard[] }> = ({
  siteConfig,
  setupOptions,
}) => {
  return (
    <section className={styles.site__setup__container}>
      <div className={styles.setup__side__bar}>
        <div className={styles.side__bar__header}>
          <h2>All done!</h2>
          <p>Your brand new education platform is set up, but few things still pending.</p>
          <h4>What do you want to do first?</h4>
        </div>

        <div className={styles.setup__options}>
          {setupOptions.map((setup, i) => {
            return (
              <SetupOptionCard
                key={i}
                icon={setup.icon}
                title={setup.title}
                description={setup.description}
                link={setup.link}
                iconBgColor={setup.iconBgColor}
              />
            );
          })}
        </div>
      </div>
      <div>
        <PreviewSite
          id="myIframe"
          ref={undefined}
          siteConfig={siteConfig}
          src={`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/admin/site/preview/${siteConfig.template}`}
        />
      </div>
    </section>
  );
};

export default SiteSetup;
