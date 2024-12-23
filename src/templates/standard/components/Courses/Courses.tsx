import { FC } from "react";
import styles from "./Courses.module.scss";
import Link from "next/link";
import { CourseCardSize, ICourseCard, ICourseInfo } from "@/types/landing/courses";
import { Button, Flex, Skeleton, Tag } from "antd";

import { CourseType, Role } from "@prisma/client";
import CourseSkeleton from "./CourseSkeleton";
import SvgIcons, { EmptyCourses } from "@/components/SvgIcons";
import { getIconTheme } from "@/services/darkThemeConfig";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

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
      <img alt={title} aria-label={`icon for ${title.toLowerCase()}`} src={thumbnail} />

      <div>
        <div>
          <Flex vertical gap={10}>
            <Tag className={styles.tag_difficulty}>{difficulty}</Tag>
            <h4>{title}</h4>
            {size === "large" && <p>{description}</p>}
          </Flex>
        </div>
        <div className={styles.card__footer}>
          {duration}
          {courseType === CourseType.FREE && price > 0 ? <span>Free</span> : <span>INR {price}</span>}
        </div>
      </div>
    </Link>
  );
};

const CourseList: FC<ICourseInfo> = ({ title, description, courseList, previewMode, brand, loading }) => {
  const { globalState } = useAppContext();
  const { data: user } = useSession();
  let cardSize: CourseCardSize = courseList.length === 3 || courseList.length > 4 ? "small" : "large";
  const router = useRouter();
  return (
    <section className={styles.courses__container}>
      <div>
        <h2>{title}</h2>
        <p style={{ marginBottom: 30 }}>{description}</p>
        {courseList.length > 0 ? (
          <div
            style={{
              gridTemplateColumns: courseList.length === 4 ? "580px 580px" : "1fr 1fr 1fr",
            }}
            className={`${styles.courses} ${styles.courses__triple}`}
          >
            {previewMode ? (
              <>
                <CourseSkeleton size={3} />
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
        ) : (
          <Flex vertical align="center" justify="center">
            {!loading && (
              <Flex vertical align="center" justify="center" className={styles.no_course_found}>
                <EmptyCourses size="300px" {...getIconTheme(globalState.theme || "light", brand)} />
                <h4 style={{ marginBottom: 20 }}>No Courses were found</h4>
                {user?.role === Role.ADMIN && courseList.length === 0 && (
                  <Button
                    onClick={() => {
                      router.push(`/admin/content`);
                    }}
                    type="primary"
                  >
                    <Flex align="center" gap={10}>
                      <span>Add Course</span>
                      <i style={{ lineHeight: 0 }}>{SvgIcons.arrowRight}</i>
                    </Flex>
                  </Button>
                )}
              </Flex>
            )}
          </Flex>
        )}
      </div>
    </section>
  );
};

export default CourseList;
