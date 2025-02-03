import { PageSiteConfig } from "@/services/siteConstant";
import { Theme } from "@/types/theme";
import { FC, ReactNode, useEffect, useState } from "react";
import styles from "@/components/Courses/CourseListView/CourseListView.module.scss";
import {
  Button,
  Card,
  Flex,
  Space,
  Tabs,
  TabsProps,
  Tag,
  Dropdown,
  MenuProps,
  Progress,
  Skeleton,
  Segmented,
  message,
  Spin,
} from "antd";
import { CourseType, Role, StateType } from "@prisma/client";
import { capsToPascalCase, validateImage } from "@/lib/utils";
import { useRouter } from "next/router";
import Link from "next/link";
import SvgIcons from "@/components/SvgIcons";
import { getDummyArray } from "@/lib/dummyData";
import { useMediaQuery } from "react-responsive";
import { ILearningPathDetail } from "@/types/learingPath";
import { ICourseListItem } from "@/types/courses/Course";
import { CourseViewItem } from "@/components/Courses/CourseListView/CourseListView";
import ProgramService from "@/services/ProgramService";
import { LoadingOutlined } from "@ant-design/icons";
import FallBackImage from "@/templates/standard/components/FallBackImage/FallBackImage";
import { EnrolledCourseProgressList } from "@/components/Dashboard/StudentDashboard";
const { Meta } = Card;
export const LearnViewItem: FC<{ learning: ILearningPathDetail; previewMode?: boolean; userRole?: Role }> = ({
  learning,
  previewMode,
  userRole,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

  const router = useRouter();
  const [showDummyPurchase, setDummyBtn] = useState(typeof previewMode !== "undefined" && previewMode);

  const handleEdit = (id: number) => {
    router.push(`academy/path/${id}/edit`);
  };

  const handlePurchase = (slug: string) => {
    router.push(`/path/${slug}`);
  };

  const items: MenuProps["items"] = [
    {
      label: <Link href={`/path/${learning.slug}`}>View</Link>,
      key: "1",
    },
  ];

  return (
    <Card
      className={styles.course__card}
      cover={
        <FallBackImage
          width={isMobile ? "80vw" : "300px"}
          height={168}
          imageSrc={learning.banner}
          ariaLabel={`thumbnail of ${learning.title}`}
        />
      }
    >
      <Meta
        className={styles.meta}
        title={
          <>
            <Flex align="center" justify="space-between" gap={5}>
              <Tag bordered={true} style={{ fontWeight: "normal" }}>
                {learning.learningPathCourses.length} courses
              </Tag>
              {learning.state === StateType.DRAFT && (
                <Tag bordered={true} color="warning" style={{ fontWeight: "normal" }}>
                  {capsToPascalCase(StateType.DRAFT)}
                </Tag>
              )}
            </Flex>

            <h4 style={{ marginTop: 5, marginBottom: 5 }}>{learning.title}</h4>
            <p style={{ fontWeight: "normal", marginBottom: 0, fontSize: 14 }}>
              A learning path by <b>{learning.author.name}</b>
            </p>
          </>
        }
        description={learning.description}
      />
      <Flex justify="space-between" align="center" className={styles.card__footer}>
        <div>{learning.price > 0 ? CourseType.PAID : CourseType.FREE}</div>

        {!showDummyPurchase &&
          userRole &&
          (userRole === Role.AUTHOR || userRole === Role.ADMIN) &&
          learning.state == StateType.DRAFT && (
            <Button onClick={(e) => handleEdit(learning.id)} type="default">
              Edit
            </Button>
          )}
        {!showDummyPurchase &&
          userRole &&
          (userRole === Role.AUTHOR || userRole === Role.ADMIN) &&
          learning.state == StateType.ACTIVE && (
            <Dropdown.Button
              type="default"
              trigger={["click"]}
              menu={{ items }}
              onClick={() => handleEdit(learning.id)}
              style={{ width: "auto" }}
            >
              Edit
            </Dropdown.Button>
          )}
        {!showDummyPurchase && userRole && userRole === Role.NOT_ENROLLED && (
          <Button type="default" onClick={(e) => handlePurchase(learning.slug)}>
            {learning.price > 0 ? "Buy Now" : "Enroll Now"}
          </Button>
        )}
        {!showDummyPurchase && userRole && userRole === Role.STUDENT && (
          <Button type="default" onClick={(e) => handlePurchase(learning.slug)}>
            Go to Learning
          </Button>
        )}
        {!showDummyPurchase && !userRole && (
          <Button type="default" onClick={(e) => handlePurchase(learning.slug)}>
            {learning.price > 0 ? "Buy Now" : "Enroll Now"}
          </Button>
        )}
        {showDummyPurchase && <Button type="default">{learning.price > 0 ? "Buy Now" : "Enroll Now"}</Button>}
      </Flex>
    </Card>
  );
};

export const AcademyItemsListView: FC<{
  pathList: ILearningPathDetail[];
  loadingCourses: boolean;
  courses: ICourseListItem[];
  getPathList: () => void;
  siteConfig: PageSiteConfig;
  handleItemsList: (key: string) => void;
  currentTheme: Theme;
  emptyView: ReactNode;
  role?: Role;
  loading: boolean;
  studentItems?: TabsProps["items"];
}> = ({
  pathList,
  currentTheme,
  siteConfig,
  loadingCourses,
  handleItemsList,
  getPathList,
  emptyView,
  role,
  studentItems,
  loading,
  courses,
}) => {
  const [messageApi, contextMessageHolder] = message.useMessage();
  const [tab, setTab] = useState(studentItems ? "student" : "courses");
  const [segmentValue, setSegmentValue] = useState<string>("all");

  const router = useRouter();
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });
  const handleLearningCreate = () => {
    return router.push("academy/path/add");
  };
  const onChangeTab = (k: string) => {
    switch (k) {
      case "courses":
        setTab(k);
        setSegmentValue("all");
        return handleItemsList(k);
      case "learning":
        setTab(k);
        setSegmentValue("all");
        return handleItemsList(k);
      case "student":
        setTab(k);
        setSegmentValue("all");
        return handleItemsList(k);

      default:
        return handleItemsList(k);
    }
  };

  const showCourses = (segementvalue: string) => {
    switch (segementvalue) {
      case StateType.DRAFT:
        return (
          <>
            {courses.filter((p) => p.state === StateType.DRAFT).length == 0 && (
              <Flex vertical gap={0} justify="center" align="center">
                {emptyView}
                <p>No courses are available in the draft state</p>
              </Flex>
            )}
            {courses.length > 0 && (
              <div className={styles.course__grid}>
                {courses
                  .filter((c) => c.state === StateType.DRAFT)
                  .map((c, index) => (
                    <CourseViewItem course={c} key={index} />
                  ))}
              </div>
            )}
          </>
        );
      case StateType.ACTIVE:
        return (
          <>
            {courses.filter((p) => p.state === StateType.ACTIVE).length == 0 && (
              <Flex vertical gap={0} justify="center" align="center">
                {emptyView}
                <p>No courses are available in the active state</p>
              </Flex>
            )}
            {courses.length > 0 && (
              <div className={styles.course__grid}>
                {courses
                  .filter((c) => c.state === StateType.ACTIVE)
                  .map((c, index) => (
                    <CourseViewItem course={c} key={index} />
                  ))}
              </div>
            )}
          </>
        );

      default:
        return (
          <>
            {courses.length == 0 && (
              <Flex vertical gap={0} justify="center" align="center">
                {emptyView}
                <p>No courses are available </p>
              </Flex>
            )}
            {courses.length > 0 && (
              <div className={styles.course__grid}>
                {courses.map((c, index) => (
                  <CourseViewItem course={c} key={index} />
                ))}
              </div>
            )}
          </>
        );
    }
  };

  const showLearningPath = (segementvalue: string) => {
    switch (segementvalue) {
      case StateType.DRAFT:
        return (
          <>
            {pathList.filter((p) => p.state === StateType.DRAFT).length == 0 && (
              <Flex vertical gap={0} justify="center" align="center">
                {emptyView}
                <p>No learning paths are available in the draft state</p>
              </Flex>
            )}
            {pathList.filter((p) => p.state === StateType.DRAFT).length > 0 && (
              <div className={styles.course__grid}>
                {pathList
                  .filter((p) => p.state === StateType.DRAFT)
                  .map((path, index) => (
                    <LearnViewItem userRole={role} learning={path} key={index} />
                  ))}
              </div>
            )}
          </>
        );
      case StateType.ACTIVE:
        return (
          <>
            {pathList.filter((p) => p.state === StateType.ACTIVE).length == 0 && (
              <Flex vertical gap={0} justify="center" align="center">
                {emptyView}
                <p>No learning paths are available in the active state</p>
              </Flex>
            )}
            {pathList.length > 0 && (
              <div className={styles.course__grid}>
                {pathList
                  .filter((path) => path.state === StateType.ACTIVE)
                  .map((path, index) => (
                    <LearnViewItem userRole={role} learning={path} key={index} />
                  ))}
              </div>
            )}
          </>
        );

      default:
        return (
          <>
            {pathList.length == 0 && (
              <Flex vertical gap={0} justify="center" align="center">
                {emptyView}
                <p>No learning paths are available</p>
              </Flex>
            )}
            {pathList.length > 0 && (
              <div className={styles.course__grid}>
                {pathList.map((path, index) => (
                  <LearnViewItem userRole={role} learning={path} key={index} />
                ))}
              </div>
            )}
          </>
        );
    }
  };

  const items: TabsProps["items"] = [
    {
      key: "courses",
      label: "Courses",
      children: (
        <Spin spinning={loadingCourses || !courses} indicator={<LoadingOutlined spin />} size="large">
          {typeof role == "undefined" && courses && courses.length > 0 && showCourses(StateType.ACTIVE)}

          {role && courses && courses.length > 0 && (
            <Flex vertical gap={10}>
              {role && role !== Role.STUDENT && (
                <Segmented
                  style={{ width: "fit-content" }}
                  onChange={setSegmentValue}
                  options={[
                    { value: "all", label: "All" },
                    { value: StateType.ACTIVE, label: "Published" },
                    { value: StateType.DRAFT, label: "Draft" },
                  ]}
                />
              )}
              <>{role && showCourses(segmentValue)}</>
            </Flex>
          )}

          {loadingCourses && courses.length == 0 && (
            <div className={styles.course__grid}>
              {getDummyArray(3).map((t, i) => {
                return (
                  <Card
                    key={i}
                    className={styles.course__card}
                    cover={
                      <Skeleton.Image style={{ width: isMobile ? "Calc(100vw - 40px)" : "300px", height: "168px" }} />
                    }
                  >
                    <Skeleton />
                  </Card>
                );
              })}
            </div>
          )}
        </Spin>
      ),
    },
    {
      key: "learning",
      label: "Learning Paths",
      children: (
        <Spin spinning={loading} indicator={<LoadingOutlined spin />} size="large">
          {typeof role == "undefined" && pathList.length > 0 && showLearningPath(StateType.ACTIVE)}
          {role && pathList.length > 0 && (
            <Flex vertical gap={10}>
              {role && role !== Role.STUDENT && (
                <Segmented
                  style={{ width: "fit-content" }}
                  onChange={setSegmentValue}
                  options={[
                    { value: "all", label: "All" },
                    { value: StateType.ACTIVE, label: "Published" },
                    { value: StateType.DRAFT, label: "Draft" },
                  ]}
                />
              )}
              <>{role && showLearningPath(segmentValue)}</>
            </Flex>
          )}

          {loading && pathList.length == 0 && (
            <div className={styles.course__grid}>
              {getDummyArray(3).map((t, i) => {
                return (
                  <Card
                    key={i}
                    className={styles.course__card}
                    cover={
                      <Skeleton.Image style={{ width: isMobile ? "Calc(100vw - 40px)" : "300px", height: "168px" }} />
                    }
                  >
                    <Skeleton />
                  </Card>
                );
              })}
            </div>
          )}
        </Spin>
      ),
    },
  ];

  const addCourse = () => {
    ProgramService.createDraftCourses(
      undefined,
      (result) => {
        messageApi.success(result.message);
        router.push(`/academy/course/${result.getCourse.courseId}/edit`);
      },
      (error) => {
        messageApi.error(error);
      }
    );
  };
  return (
    <div className={styles.courses__list}>
      {contextMessageHolder}

      {router.pathname !== "/" && (
        <Flex align="center" justify="space-between">
          <h4>Academy</h4>
          {role && role !== Role.STUDENT && (
            <Dropdown.Button
              style={{ width: "fit-content" }}
              type="primary"
              onClick={() => {
                addCourse();
              }}
              icon={SvgIcons.chevronDown}
              menu={{
                items: [
                  {
                    key: 1,
                    label: "Add Learning Path",
                    onClick: () => {
                      handleLearningCreate();
                    },
                  },
                ],
              }}
            >
              Add Course
            </Dropdown.Button>
          )}
        </Flex>
      )}

      <Tabs
        tabBarGutter={isMobile ? 30 : 40}
        items={studentItems ? studentItems.concat(items) : items}
        activeKey={tab}
        onChange={onChangeTab}
      />
    </div>
  );
};
