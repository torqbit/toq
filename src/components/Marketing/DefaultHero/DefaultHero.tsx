import { FC } from "react";
import styles from "@/styles/Marketing/PageHero.module.scss";

const DefaulttHero: FC<{ title: string; description: string }> = ({ title, description }) => {
  return (
    <section className={styles.hero__content__wrapper}>
      <div className={styles.blogContentContainer}>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
};

export default DefaulttHero;
