import { FC } from "react";
import styles from "./SetupPlatform.module.scss";
import Link from "next/link";
import Image from "next/image";
import { IFeatureCard } from "@/types/landing/feature";

const StepCard: FC<IFeatureCard> = ({ img, title, description, link, cardClass }) => (
  <Link href={link} className={`${styles.steps__card} ${cardClass}`}>
    <img alt={title} aria-label={`icon for ${title.toLowerCase()}`} src={img} />
    <h4>{title}</h4>
    <p>{description}</p>
  </Link>
);

const SetupPlatform = () => (
  <section className={styles.setup__container}>
    <div>
      <h2>Setup the platform</h2>
      <p className="landingPagePara" style={{ marginBottom: 30 }}>
        Set up the authentication, and other configuration for the learning platform
      </p>
      <div className={`${styles.steps} ${styles.steps__triple}`}>
        <StepCard
          img="/img/landing/auth.png"
          title="Authentication"
          description="Configure authentication with Google, Github or any other auth provider supported by NextAuth"
          link="/docs/auth"
          cardClass={styles.steps__card__small}
        />
        <StepCard
          img="/img/landing/email.png"
          title="Emails"
          description="Configure email configurations for sending emails for welcoming to course, course completions and many more."
          link="/docs/auth"
          cardClass={styles.steps__card__small}
        />
        <StepCard
          img="/img/landing/payment.png"
          title="Payments"
          description="Configure the supported payment gateways in order to start selling your courses"
          link="/docs/auth"
          cardClass={styles.steps__card__small}
        />
      </div>
    </div>
    <div>
      <h2>Get started</h2>
      <p style={{ marginBottom: 30 }}>Post configuration, configure the video streaming and start creating courses</p>
      <div className={`${styles.steps} ${styles.steps__double}`}>
        <StepCard
          img="/img/landing/video-stream.png"
          title="Video Streaming"
          description="Configure video storage and streaming using Bunny.net credentials and start uploading video lessons"
          link="/docs/auth"
          cardClass={styles.steps__card__large}
        />
        <StepCard
          img="/img/landing/course.png"
          title="Courses"
          description="Create your first course by uploading video lessons and assignments, and offer it for free or a handsome price "
          link="/docs/auth"
          cardClass={styles.steps__card__large}
        />
      </div>
    </div>
  </section>
);

export default SetupPlatform;
