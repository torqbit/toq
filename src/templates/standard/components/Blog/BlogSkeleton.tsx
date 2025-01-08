import { FC } from "react";
import styles from "./Blog.module.scss";

import { CourseCardSize } from "@/types/landing/courses";
import { Flex, Skeleton, Tag } from "antd";
import { useMediaQuery } from "react-responsive";

const SkeletonCard: FC<{ size: CourseCardSize }> = ({ size }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

  return (
    <div style={{ cursor: "pointer" }} className={`${styles.blogs__card}`}>
      <Skeleton.Image
        style={{ width: isMobile ? 316 : 378, height: 200, borderTopRightRadius: 16, borderTopLeftRadius: 16 }}
      />
      <Flex vertical className={styles.blogs__card__footer}>
        <Skeleton paragraph={{ rows: 0 }} title={{ width: 280 }} />
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
          gridTemplateColumns: "repeat(auto-fill, minmax())",
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
