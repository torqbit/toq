import { FC } from "react";
import styles from "./Blog.module.scss";

import { CourseCardSize } from "@/types/landing/courses";
import { Flex, Skeleton, Tag } from "antd";

const SkeletonCard: FC<{ size: CourseCardSize }> = ({ size }) => {
  return (
    <div style={{ cursor: "pointer" }} className={`${styles.blogs__card}`}>
      <Skeleton.Image
        style={{ width: 378, height: 200, borderRadius: 16, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
      />
      <Flex vertical className={styles.blogs__card__footer}>
        <Skeleton paragraph={{ rows: 0 }} title={{ width: 300 }} />
        <Flex align="center" gap={5}>
          <Skeleton.Avatar size="small" />
          <Skeleton.Input size="small" style={{ height: 20 }} />
        </Flex>
      </Flex>
    </div>
  );
};

const BlogSkeleton: FC<{ size: number }> = ({ size }) => {
  let cardSize: CourseCardSize = size === 3 || size > 4 ? "small" : "large";
  const dummyArray = Array.from({ length: size }, (_, i) => i + 1);

  return (
    <section className={styles.blog__list__container}>
      <div
        style={{
          gridTemplateColumns: size === 4 || size <= 2 ? "580px 580px" : "1fr 1fr 1fr",
        }}
        className={`${styles.blogs} ${size <= 2 ? styles.blogs__double : styles.blogs__triple}`}
      >
        {dummyArray.map((d, i) => {
          return <SkeletonCard key={i} size={cardSize} />;
        })}
      </div>
    </section>
  );
};

export default BlogSkeleton;
