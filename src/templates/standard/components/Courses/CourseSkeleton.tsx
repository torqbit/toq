import { FC } from "react";
import styles from "./Courses.module.scss";
import { CourseCardSize } from "@/types/landing/courses";
import { Flex, Skeleton, Tag } from "antd";

const SkeletonCard: FC<{ size: CourseCardSize }> = ({ size }) => {
  return (
    <div
      className={`${styles.courses__card} courses__card__${size} `}
      style={{ cursor: "pointer", flexDirection: "column", height: 400 }}
    >
      <Skeleton.Image style={{ width: 360, height: 180 }} />

      <div>
        <div>
          <Flex vertical gap={10}>
            <Skeleton paragraph={{ rows: 2 }} />
          </Flex>
        </div>
        <Flex gap={60} className={styles.card__footer}>
          <Skeleton.Button size="small" />

          <Skeleton.Button size="small" />
        </Flex>
      </div>
    </div>
  );
};

const CourseSkeleton: FC<{ size: number }> = ({ size }) => {
  let cardSize: CourseCardSize = size === 3 || size > 4 ? "small" : "large";
  const dummyArray = Array.from({ length: size }, (_, i) => i + 1);

  return (
    <section className={styles.courses__container}>
      <div
        style={{
          gridTemplateColumns: size === 4 || size <= 2 ? "580px 580px" : "1fr 1fr 1fr",
        }}
        className={`${styles.courses} ${styles.courses__triple}`}
      >
        {dummyArray.map((d, i) => {
          return <SkeletonCard key={i} size={cardSize} />;
        })}
      </div>
    </section>
  );
};

export default CourseSkeleton;
