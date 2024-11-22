import { FC } from "react";
import styles from "@/components/SiteConfigure/SiteSetup/SiteSetup.module.scss";
import { PageSiteConfig } from "@/services/siteConstant";
import Link from "next/link";
import { ISiteSetupCard } from "@/types/setup/siteSetup";
const SetupOptionCard: FC<ISiteSetupCard> = ({ icon, title, description, link, iconBgColor }) => (
  <Link href={link} className={`${styles.setup__card} `}>
    <div style={{ backgroundColor: iconBgColor }}>
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
          <p>Your brand new publication is set up and ready to go.</p>
        </div>
        <h4>What do you want to do first?</h4>

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
      <div className={styles.site__preview__container}>
        <div className={styles.site__preview__titlebar}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <iframe
          loading="lazy"
          className={styles.site__preview}
          src={`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}`}
        ></iframe>
      </div>
    </section>
  );
};

export default SiteSetup;
