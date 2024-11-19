import { FC } from "react";
import styles from "./feature.module.scss";
import Link from "next/link";
import Image from "next/image";
import { IFeatureCard, IFeatureInfo } from "@/types/landing/feature";

const FeatureCard: FC<IFeatureCard> = ({ img, title, description, link, cardClass }) => (
  <Link href={link} className={`${styles.steps__card} ${cardClass}`}>
    <img alt={title} aria-label={`icon for ${title.toLowerCase()}`} src={img} />
    <h4>{title}</h4>
    <p>{description}</p>
  </Link>
);

const Feature: FC<IFeatureInfo> = ({ title, description, featureList }) => (
  <section className={styles.setup__container}>
    <div>
      <h2>{title}</h2>
      <p style={{ marginBottom: 30 }}>{description}</p>
      <div className={`${styles.steps} ${styles.steps__triple}`}>
        {featureList.map((feature, i) => {
          return (
            <FeatureCard
              img={feature.img}
              title={feature.title}
              description={feature.description}
              link={feature.link}
              cardClass={`${styles[featureList.length <= 2 ? "steps__card__large" : `"steps__card__small"`]} ${
                feature.cardClass
              }`}
            />
          );
        })}
      </div>
    </div>
  </section>
);

export default Feature;
