import { FC } from "react";
import styles from "@/styles/Marketing/LandingPage/LandingPage.module.scss";
import Image from "next/image";
import MediaQuery from "react-responsive";

const HeroImage: FC<{ isMobile: boolean }> = ({ isMobile }) => (
  <section className={styles.hero__img}>
    <MediaQuery maxWidth={430}>
      <Image
        alt="Website builder screenshot"
        height={218}
        width={350}
        loading="lazy"
        src="https://cdn.torqbit.com/website/img/display-markkk.png"
      />
    </MediaQuery>

    <MediaQuery minWidth={1200}>
      <Image
        alt="Website builder screenshot"
        height={625}
        width={1000}
        loading="lazy"
        src="https://cdn.torqbit.com/website/img/display-markkk.png"
      />
    </MediaQuery>
  </section>
);

export default HeroImage;
