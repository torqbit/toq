import { FC } from "react";
import styles from "./Courses.module.scss";
import Link from "next/link";
import { ICourseCard, ICourseInfo } from "@/types/landing/courses";
import { Tag } from "antd";

import { CourseType } from "@prisma/client";

const CourseCard: FC<ICourseCard> = ({
  img,
  title,
  description,
  link,
  cardClass,
  coursePrice,
  courseType,
  difficulty,
  duration,
  courseListLength,
}) => (
  <Link href={link} className={`${styles.courses__card} ${cardClass}`}>
    <img alt={title} aria-label={`icon for ${title.toLowerCase()}`} src={img} />
    <div>
      <div>
        <div>
          <Tag className={styles.tag_difficulty}>{difficulty}</Tag>
          <h4>{title}</h4>
          {courseListLength && (courseListLength <= 2 || courseListLength === 4) && <p>{description}</p>}
        </div>
      </div>
      <div className={styles.card__footer}>
        {duration}
        {courseType === CourseType.FREE && coursePrice > 0 ? <span>Free</span> : <span>INR {coursePrice}</span>}
      </div>
    </div>
  </Link>
);

const CourseLIst: FC<ICourseInfo> = ({ title, description, courseList }) => (
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
        {courseList.map((course, i) => {
          return (
            <CourseCard
              key={i}
              img={course.img}
              title={course.title}
              description={course.description}
              link={course.link}
              cardClass={`${styles[courseList.length <= 2 ? "courses__card__large" : `"courses__card__small"`]} ${
                course.cardClass
              }`}
              duration={course.duration}
              courseType={course.courseType}
              coursePrice={2000}
              difficulty={course.difficulty}
              courseListLength={courseList.length}
            />
          );
        })}
      </div>
    </div>
  </section>
);

export default CourseLIst;
