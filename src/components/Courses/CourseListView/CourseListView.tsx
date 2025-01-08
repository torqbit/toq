import { EmptyCourses } from "@/components/SvgIcons";
import { PageSiteConfig } from "@/services/siteConstant";
import { ICourseListItem } from "@/types/courses/Course";
import { Theme } from "@/types/theme";
import { FC, ReactNode, useState } from "react";
import styles from "./CourseListView.module.scss";
import { Button, Card, Flex, Space, Tabs, TabsProps, Tag, Dropdown, MenuProps } from "antd";
import { Role, StateType } from "@prisma/client";
import { capsToPascalCase } from "@/lib/utils";
import { useRouter } from "next/router";
import Link from "next/link";
const { Meta } = Card;
const CourseViewItem: FC<{ course: ICourseListItem }> = ({ course }) => {
  const router = useRouter();

  const handleEdit = (id: number) => {
    router.push(`admin/content/course/${id}/edit`);
  };

  const handleManage = (id: number) => {
    router.push(`admin/content/course/${id}/manage`);
  };

  const handlePurchase = (slug: string) => {
    router.push(`/courses/${slug}`);
  };

  const items: MenuProps["items"] = [
    {
      label: <Link href={`/courses/${course.slug}`}>View</Link>,
      key: "1",
    },
    {
      label: <Link href={`/admin/content/course/${course.id}/edit`}>Edit</Link>,
      key: "2",
    },
  ];

  return (
    <Card
      className={styles.course__card}
      cover={<img className={styles.card__img} alt={`thumbnail of ${course.title}`} src={course.trailerThumbnail} />}
    >
      <Meta
        className={styles.meta}
        title={
          <>
            <Space>
              <Tag bordered={true} style={{ fontWeight: "normal" }}>
                {course.difficultyLevel}
              </Tag>
              {course.state === StateType.DRAFT && (
                <Tag bordered={true} color="warning" style={{ fontWeight: "normal" }}>
                  {capsToPascalCase(StateType.DRAFT)}
                </Tag>
              )}
            </Space>
            <h4 style={{ marginTop: 5, marginBottom: 5 }}>{course.title}</h4>
            <p style={{ fontWeight: "normal", marginBottom: 0, fontSize: 14 }}>
              A course by <b>{course.author}</b>
            </p>
          </>
        }
        description={course.description}
      />
      <Flex justify="space-between" align="center" className={styles.card__footer}>
        <div>
          {course.currency} {course.price}
        </div>

        {course.userRole &&
          (course.userRole === Role.AUTHOR || course.userRole === Role.ADMIN) &&
          course.state == StateType.DRAFT && (
            <Button onClick={(e) => handleEdit(course.id)} type="default">
              Edit
            </Button>
          )}
        {course.userRole &&
          (course.userRole === Role.AUTHOR || course.userRole === Role.ADMIN) &&
          course.state == StateType.ACTIVE && (
            <Dropdown.Button
              type="default"
              trigger={["click"]}
              menu={{ items }}
              onClick={() => handleManage(course.id)}
              style={{ width: "auto" }}
            >
              Manage
            </Dropdown.Button>
          )}
        {course.userRole && course.userRole === Role.NOT_ENROLLED && (
          <Button type="default" onClick={(e) => handlePurchase(course.slug)}>
            Buy Now
          </Button>
        )}
        {course.userRole && course.userRole === Role.STUDENT && <Button type="default">Go to Course</Button>}
      </Flex>
    </Card>
  );
};

export const CoursesListView: FC<{
  courses: ICourseListItem[];
  siteConfig: PageSiteConfig;
  currentTheme: Theme;
  handleCourseCreate: () => void;
  emptyView: ReactNode;
  role?: Role;
}> = ({ courses, currentTheme, siteConfig, handleCourseCreate, emptyView, role }) => {
  const [tab, setTab] = useState("1");
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Published Courses",
      children: (
        <div className={styles.course__grid}>
          {courses
            .filter((c) => c.state === StateType.ACTIVE)
            .map((c, index) => (
              <CourseViewItem course={c} key={index} />
            ))}
        </div>
      ),
    },
    {
      key: "2",
      label: `${role == "AUTHOR" ? "Authored Courses" : "All Courses"}`,
      children: (
        <>
          <div className={styles.course__grid}>
            {role == Role.AUTHOR && (
              <>
                {courses
                  .filter((c) => c.userRole && c.userRole === Role.AUTHOR)
                  .map((c, index) => (
                    <CourseViewItem course={c} key={index} />
                  ))}
              </>
            )}
            {role == Role.ADMIN && (
              <>
                {courses.map((c, index) => (
                  <CourseViewItem course={c} key={index} />
                ))}
              </>
            )}
          </div>
        </>
      ),
    },
  ];
  return (
    <div className={styles.courses__list}>
      {role && role !== Role.STUDENT && (
        <>
          <h4>Courses</h4>
          <Tabs tabBarGutter={40} items={items} activeKey={tab} onChange={(k) => setTab(k)} />
        </>
      )}

      {role && role === Role.STUDENT && (
        <>
          <h4>Courses</h4>
          <div className={styles.course__grid}>
            {courses
              .filter((c) => c.state === StateType.ACTIVE)
              .map((c, index) => (
                <CourseViewItem course={c} key={index} />
              ))}
          </div>
        </>
      )}

      {typeof role === "undefined" && courses.length > 0 && (
        <div className={styles.course__grid}>
          {courses.map((c, index) => (
            <CourseViewItem course={c} key={index} />
          ))}
        </div>
      )}

      {typeof role === "undefined" && courses.length == 0 && <>{emptyView}</>}
    </div>
  );
};
