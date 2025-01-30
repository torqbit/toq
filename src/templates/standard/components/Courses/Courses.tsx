import { FC } from "react";
import styles from "./Courses.module.scss";
import courseGrid from "@/components/Courses/CourseListView/CourseListView.module.scss";
import Link from "next/link";
import { CourseCardSize, ICourseCard, ICourseInfo } from "@/types/landing/courses";
import { Button, Flex, Tag } from "antd";

import { CourseType, StateType } from "@prisma/client";
import CourseSkeleton from "./CourseSkeleton";
import { CourseViewItem } from "@/components/Courses/CourseListView/CourseListView";
import SvgIcons from "@/components/SvgIcons";

const CourseCard: FC<ICourseCard> = ({
  tvThumbnail,
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
      <img alt={title} aria-label={`icon for ${title.toLowerCase()}`} src={tvThumbnail} />

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
          {courseType === CourseType.FREE || price == 0 ? <span>Free</span> : <span>INR {price}</span>}
        </div>
      </div>
    </Link>
  );
};

const CourseList: FC<ICourseInfo> = ({ title, description, courseList, previewMode }) => {
  return (
    <>
      {
        <section className={styles.courses__container}>
          <div>
            <Flex justify="space-between">
              <h2>{title}</h2>
              {courseList.length > 3 && (
                <Button href="/courses" type="link">
                  <Flex align="center" gap={10}>
                    <span>View more</span>
                    <i style={{ fontSize: 18, lineHeight: 0 }}>{SvgIcons.arrowRight}</i>
                  </Flex>
                </Button>
              )}
            </Flex>
            <p className="landingPagePara" style={{ marginBottom: 30 }}>
              {description}
            </p>

            {previewMode && courseList.length === 0 && (
              <>
                <CourseSkeleton size={3} />
              </>
            )}
            <div className={styles.list__preview__wrapper}>
              {courseList.length > 0 && (
                <div className={courseGrid.course__grid}>
                  {courseList.slice(0, 3).map((c, index) => (
                    <CourseViewItem course={c} key={index} previewMode={previewMode} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      }
    </>
  );
};

export default CourseList;
