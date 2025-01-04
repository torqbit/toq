import React, { FC } from "react";
import styles from "../../styles/Dashboard.module.scss";
import { useSession } from "next-auth/react";
import { Flex, Tag } from "antd";

import Link from "next/link";
import { convertSecToHourandMin } from "@/pages/admin/content";
import Image from "next/image";
import { Role } from "@prisma/client";

interface ICourseCard {
  thumbnail: string;
  courseName: string;
  courseDescription: string;
  duration: string;
  courseId: number;
  courseType: string;
  difficulty: string;
  previewMode: boolean;
  slug: string;
}

const CourseCard: FC<ICourseCard> = ({
  thumbnail,
  courseName,
  courseDescription,
  courseId,
  duration,
  courseType,
  difficulty,
  previewMode,
  slug,
}) => {
  return (
    <Link href={`/courses/${slug}`}>
      <div className={styles.course_card}>
        <div className={styles.card_img}>
          <Image height={250} width={250} src={thumbnail} alt={courseName} loading="lazy" />
        </div>
        <div className={styles.card_content}>
          <div>
            <Flex align="center" gap={0}>
              <Tag className={styles.card_difficulty_level}>{difficulty}</Tag>
              {previewMode && (
                <Tag className={styles.card_mode} color="yellow-inverse" style={{ marginLeft: 5 }}>
                  Preview
                </Tag>
              )}
            </Flex>

            <h4 className={styles.card_title}>{courseName}</h4>
            <p className={styles.card_description}>{courseDescription}</p>
          </div>

          <div className={styles.card_footer}>
            <div className={styles.course_duration}>{duration}</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const Courses: FC<{
  allCourses: any[];
  userRole?: Role;
}> = ({ allCourses, userRole }) => {
  return (
    <>
      {allCourses.length ? (
        <section className={styles.course_content}>
          <div
            className={`${styles.course_card_wrapper} ${
              userRole ? styles.logged__in__course__card : styles.logged__out__course__card
            }`}
          >
            {allCourses.map((course: any, i) => {
              let totalDuration = 0;
              course.chapters.forEach((chap: any) => {
                chap.resource.forEach((r: any) => {
                  if (r.video) {
                    totalDuration = totalDuration + r.video?.videoDuration;
                  } else if (r.assignment) {
                    totalDuration = totalDuration + Number(r.assignment.estimatedDuration) * 60;
                  }
                });
              });
              let duration = convertSecToHourandMin(totalDuration);
              return (
                <CourseCard
                  thumbnail={""}
                  courseName={course.name}
                  courseDescription={course.description}
                  duration={String(duration)}
                  courseId={course.courseId}
                  courseType={course.courseType}
                  difficulty={course.difficultyLevel}
                  previewMode={course.previewMode}
                  slug={course.slug}
                />
              );
            })}
          </div>
        </section>
      ) : (
        <>
          <div className={styles.no_course_found}>
            <img src="/img/common/empty.svg" alt="" />
            <h4>No Courses were found</h4>
          </div>
        </>
      )}
    </>
  );
};

export default Courses;
