import { FC } from "react";
import styles from "./Courses.module.scss";
import Link from "next/link";
import { CourseCardSize, ICourseCard, ICourseInfo } from "@/types/landing/courses";
import { Flex, Skeleton, Tag } from "antd";

import { CourseType } from "@prisma/client";

const CourseCard: FC<ICourseCard> = ({
  thumbnail,
  title,
  description,
  link,
  cardClass,
  price,
  courseType,
  difficulty,
  duration,
  size,
  previewMode,
}) => {
  return (
    <Link href={`${link}`} className={`${styles.courses__card} courses__card__${size} ${cardClass}`}>
      {previewMode ? (
        <Skeleton.Image style={{ width: 180, height: 180 }} />
      ) : (
        <img alt={title} aria-label={`icon for ${title.toLowerCase()}`} src={thumbnail} />
      )}
      <div>
        <div>
          <Flex vertical gap={10}>
            {!previewMode && <Tag className={styles.tag_difficulty}>{difficulty}</Tag>}
            {!previewMode && <h4>{title}</h4>}
            {previewMode ? <Skeleton paragraph={{ rows: 2 }} /> : <> {size === "large" && <p>{description}</p>}</>}
          </Flex>
        </div>
        <div className={styles.card__footer}>
          {previewMode ? <Skeleton.Button size="small" style={{ width: 60 }} /> : duration}
          {previewMode ? (
            <Skeleton.Button size="small" style={{ width: 60 }} />
          ) : (
            <>{courseType === CourseType.FREE && price > 0 ? <span>Free</span> : <span>INR {price}</span>}</>
          )}
        </div>
      </div>
    </Link>
  );
};

const CourseList: FC<ICourseInfo> = ({ title, description, courseList, previewMode }) => {
  let cardSize: CourseCardSize = courseList.length === 3 || courseList.length > 4 ? "small" : "large";
  const dummyArray = [1, 2, 3];

  return (
    <section className={styles.courses__container}>
      <div>
        <h2>{title}</h2>
        <p style={{ marginBottom: 30 }}>{description}</p>
        <div
          style={{
            gridTemplateColumns: courseList.length === 4 ? "580px 580px" : "1fr 1fr 1fr",
          }}
          className={`${styles.courses} ${styles.courses__triple}`}
        >
          {previewMode || courseList.length === 0 ? (
            <>
              {dummyArray.map((d, i) => {
                return (
                  <CourseCard
                    key={i}
                    thumbnail={""}
                    title={"title"}
                    description={"description"}
                    link={"/"}
                    duration={"2 hourse"}
                    courseType={"FREE"}
                    price={2000}
                    difficulty={"Advance"}
                    size={cardSize}
                    previewMode
                  />
                );
              })}
            </>
          ) : (
            <>
              {courseList.map((course, i) => {
                return (
                  <CourseCard
                    key={i}
                    thumbnail={course.thumbnail}
                    title={course.title}
                    description={course.description}
                    link={`${course.link}`}
                    cardClass={`${course.cardClass}`}
                    duration={course.duration}
                    courseType={course.courseType}
                    price={2000}
                    difficulty={course.difficulty}
                    size={cardSize}
                  />
                );
              })}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default CourseList;
