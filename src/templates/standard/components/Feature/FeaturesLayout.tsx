import { FC } from "react";
import styles from "./features.module.scss";
import Link from "next/link";
import { IFeatureCard } from "@/types/landing/feature";
import { Skeleton } from "antd";

const FeatureCard: FC<IFeatureCard> = ({ img, title, description, link, cardClass }) => (
  <Link href={link ? `${link}` : "#"} className={`${styles.features__card} ${cardClass}`}>
    <img alt={title} aria-label={`icon for ${title.toLowerCase()}`} src={img} />
    <h4>{title}</h4>
    <p>{description}</p>
  </Link>
);

const FeaturesLayout: FC<{}> = () => {
  const layoutItems = [
    {
      title: "First layout",
      layoutId: "1",
      children: (
        <div className={`${styles.features__layout__card}`}>
          <Skeleton.Avatar size="small" shape="square" style={{ height: 40, width: 40 }} />

          <Skeleton paragraph={{ rows: 2 }} style={{ marginTop: 0 }} />
        </div>
      ),
    },
  ];
  return (
    <section className={styles.features__layout_container}>
      <div className={`${styles.features}`}>
        {layoutItems.map((feature, i) => {
          return (
            <div key={i}>
              <h5>{feature.title}</h5>
              <div>{feature.children}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturesLayout;
