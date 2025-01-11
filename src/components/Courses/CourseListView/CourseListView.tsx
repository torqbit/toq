import { PageSiteConfig } from "@/services/siteConstant";
import { ICourseListItem } from "@/types/courses/Course";
import { Theme } from "@/types/theme";
import { FC, ReactNode, useEffect, useState } from "react";
import styles from "./CourseListView.module.scss";
import { Button, Card, Flex, Space, Tabs, TabsProps, Tag, Dropdown, MenuProps, Progress } from "antd";
import { Role, StateType } from "@prisma/client";
import { capsToPascalCase, validateImage } from "@/lib/utils";
import { useRouter } from "next/router";
import Link from "next/link";
import SvgIcons from "@/components/SvgIcons";
const { Meta } = Card;
export const CourseViewItem: FC<{ course: ICourseListItem; previewMode?: boolean }> = ({ course, previewMode }) => {
  const router = useRouter();
  const [showDummyPurchase, setDummyBtn] = useState(typeof previewMode !== undefined && previewMode);
  const [validImage, setImageValid] = useState<boolean>(true);

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

  const checkImageValidation = async (url: string) => {
    const isValid = await validateImage(url);
    setImageValid(isValid);
  };

  useEffect(() => {
    course.trailerThumbnail && checkImageValidation(course.trailerThumbnail);
  }, [course.trailerThumbnail]);

  return (
    <Card
      className={styles.course__card}
      cover={

        validImage ? (
          <img className={styles.card__img} alt={`thumbnail of ${course.title}`} src={course.trailerThumbnail} />
        ) : (
          <div className={styles.invalid__img}>
            <i>{SvgIcons.academicCap}</i>
          </div>
        )
      }
    >
      <Meta
        className={styles.meta}
        title={
          <>
            <Flex vertical gap={5}>
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
            </Flex>

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

        {showDummyPurchase && <Button type="default">Buy Now</Button>}

        {!showDummyPurchase &&
          course.userRole &&
          (course.userRole === Role.AUTHOR || course.userRole === Role.ADMIN) &&
          course.state == StateType.DRAFT && (
            <Button onClick={(e) => handleEdit(course.id)} type="default">
              Edit
            </Button>
          )}
        {!showDummyPurchase &&
          course.userRole &&
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
        {!showDummyPurchase && course.userRole && course.userRole === Role.NOT_ENROLLED && (
          <Button type="default" onClick={(e) => handlePurchase(course.slug)}>
            Buy Now
          </Button>
        )}
        {!showDummyPurchase && course.userRole && course.userRole === Role.STUDENT && (
          <Button type="default" onClick={(e) => handlePurchase(course.slug)}>
            Go to Course
          </Button>
        )}
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
          <Tabs
            tabBarGutter={40}
            items={items}
            activeKey={tab}
            onChange={(k) => setTab(k)}
            tabBarExtraContent={
              <Button type="primary" onClick={handleCourseCreate}>
                Add Course
              </Button>
            }
          />
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
